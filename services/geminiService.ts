
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, CoreValue, AIConfig } from "../types";

// Helper for default offline state
const getOfflineResult = (text: string, message: string): AnalysisResult => ({
  score: Math.min(text.length, 50),
  feedback: message,
  detectedValue: null,
  corn: {
    context: { present: false, feedback: "Offline" },
    observation: { present: false, feedback: "Offline" },
    result: { present: false, feedback: "Offline" },
    nextStep: { present: false, feedback: "Offline" }
  },
  refinedMessage: null
});

// Prompt Template
const SYSTEM_INSTRUCTION = `You are an expert on "Radical Candor" and EOS Core Values.
Analyze the provided recognition message.

Tasks:
1. Score quality (0-100) based on specificity and impact.
2. Identify the best matching Core Value from: 'Bravely Speak & Humbly Listen', 'We Before Me', 'Hungry to Learn', 'Pursuit of Excellence'.
3. Analyze for the CORN framework (Context, Observation, Result, Next Step).
4. Provide a refined version of the message that improves on missing CORN elements.`;

const JSON_SCHEMA_PROMPT = `
Response must be valid JSON matching this structure:
{
  "score": number,
  "feedback": "string (max 15 words)",
  "detectedValue": "string",
  "contextPresent": boolean,
  "contextFeedback": "string",
  "observationPresent": boolean,
  "observationFeedback": "string",
  "resultPresent": boolean,
  "resultFeedback": "string",
  "nextStepPresent": boolean,
  "nextStepFeedback": "string",
  "refinedMessage": "string"
}`;

export const analyzeShoutout = async (text: string, config: AIConfig): Promise<AnalysisResult> => {
  if (!text || text.length < 10) {
    return getOfflineResult(text, "Keep typing! Be specific.");
  }

  if (!config.enabled || !config.apiKey) {
    return getOfflineResult(text, "AI features not configured.");
  }

  try {
    let result: any = {};

    // --- GEMINI STRATEGY ---
    if (config.provider === 'Gemini') {
      const ai = new GoogleGenAI({ apiKey: config.apiKey });
      const modelName = config.model || "gemini-3-flash-preview";
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Analyze this employee recognition message: "${text}"`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING, description: "Short overall tip (max 15 words)" },
              detectedValue: { type: Type.STRING },
              contextPresent: { type: Type.BOOLEAN },
              contextFeedback: { type: Type.STRING },
              observationPresent: { type: Type.BOOLEAN },
              observationFeedback: { type: Type.STRING },
              resultPresent: { type: Type.BOOLEAN },
              resultFeedback: { type: Type.STRING },
              nextStepPresent: { type: Type.BOOLEAN },
              nextStepFeedback: { type: Type.STRING },
              refinedMessage: { type: Type.STRING, description: "An improved version of the shoutout using Radical Candor principles." }
            },
            required: ["score", "feedback", "detectedValue", "refinedMessage", "contextPresent", "observationPresent", "resultPresent"]
          }
        }
      });
      
      result = JSON.parse(response.text || "{}");
    } 
    
    // --- OPENAI / GROQ STRATEGY (REST) ---
    else if (config.provider === 'OpenAI' || config.provider === 'Groq') {
       const endpoint = config.endpoint || (config.provider === 'OpenAI' 
         ? 'https://api.openai.com/v1/chat/completions' 
         : 'https://api.groq.com/openai/v1/chat/completions');
       
       const model = config.model || (config.provider === 'OpenAI' ? 'gpt-4o' : 'llama3-8b-8192');

       const resp = await fetch(endpoint, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${config.apiKey}`
         },
         body: JSON.stringify({
           model: model,
           messages: [
             { role: "system", content: SYSTEM_INSTRUCTION + JSON_SCHEMA_PROMPT },
             { role: "user", content: `Analyze this: "${text}"` }
           ],
           response_format: { type: "json_object" }
         })
       });

       if (!resp.ok) throw new Error(`API Error: ${resp.statusText}`);
       const json = await resp.json();
       result = JSON.parse(json.choices[0].message.content);
    }

    // --- CLAUDE STRATEGY (REST) ---
    else if (config.provider === 'Claude') {
        const endpoint = config.endpoint || 'https://api.anthropic.com/v1/messages';
        const model = config.model || 'claude-3-5-sonnet-20240620';

        const resp = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'x-api-key': config.apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                max_tokens: 1024,
                system: SYSTEM_INSTRUCTION + JSON_SCHEMA_PROMPT,
                messages: [
                    { role: "user", content: `Analyze this: "${text}"` }
                ]
            })
        });

        if (!resp.ok) throw new Error(`API Error: ${resp.statusText}`);
        const json = await resp.json();
        // Claude returns content as list of blocks
        if (json.content && json.content[0].text) {
             result = JSON.parse(json.content[0].text);
        }
    }

    // Map string response to Enum
    let mappedValue = null;
    if (result.detectedValue) {
       Object.values(CoreValue).forEach(val => {
         if (result.detectedValue.includes(val) || val.includes(result.detectedValue)) {
           mappedValue = val;
         }
       });
    }

    return {
      score: result.score || 0,
      feedback: result.feedback || "Keep going!",
      detectedValue: mappedValue,
      corn: {
        context: { present: result.contextPresent || false, feedback: result.contextFeedback || "Add context" },
        observation: { present: result.observationPresent || false, feedback: result.observationFeedback || "Add observation" },
        result: { present: result.resultPresent || false, feedback: result.resultFeedback || "Add result" },
        nextStep: { present: result.nextStepPresent || false, feedback: result.nextStepFeedback || "Add next steps" }
      },
      refinedMessage: result.refinedMessage || null
    };

  } catch (error) {
    console.error("AI analysis failed", error);
    return getOfflineResult(text, `Error: ${error instanceof Error ? error.message : 'Analysis failed'}`);
  }
};


import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, CoreValue } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeShoutout = async (text: string): Promise<AnalysisResult> => {
  if (!text || text.length < 10) {
    return {
      score: 10,
      feedback: "Keep typing! Be specific about what they did.",
      detectedValue: null,
      corn: {
        context: { present: false, feedback: "Missing context" },
        observation: { present: false, feedback: "Missing specific observation" },
        result: { present: false, feedback: "Missing impact/result" },
        nextStep: { present: false, feedback: "Missing next steps" }
      },
      refinedMessage: null
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this employee recognition message: "${text}"`,
      config: {
        systemInstruction: `You are an expert on "Radical Candor" and EOS Core Values.
        Analyze the provided recognition message.
        
        Tasks:
        1. Score quality (0-100) based on specificity and impact.
        2. Identify the best matching Core Value from: 'Bravely Speak & Humbly Listen', 'We Before Me', 'Hungry to Learn', 'Pursuit of Excellence'.
        3. Analyze for the CORN framework (Context, Observation, Result, Next Step).
        4. Provide a refined version of the message that improves on missing CORN elements.`,
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

    const result = JSON.parse(response.text || "{}");
    
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
    console.error("Gemini analysis failed", error);
    return {
      score: Math.min(text.length, 50),
      feedback: "Analysis currently offline.",
      detectedValue: null,
      corn: {
        context: { present: false, feedback: "Offline" },
        observation: { present: false, feedback: "Offline" },
        result: { present: false, feedback: "Offline" },
        nextStep: { present: false, feedback: "Offline" }
      },
      refinedMessage: null
    };
  }
};

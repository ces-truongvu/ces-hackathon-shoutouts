
import React, { useState, useEffect } from 'react';
import DuoButton from './DuoButton';
import { User, CoreValue, AnalysisResult, AppConfig } from '../types';
import { analyzeShoutout } from '../services/geminiService';
import OwlMascot from './OwlMascot';
import { CORE_VALUE_COLORS } from '../constants';
import { useTheme } from '../context/ThemeContext';

interface RecognitionWizardProps {
  users: readonly User[];
  currentUser: User;
  config: AppConfig;
  shoutoutCount: number; // Current month's count
  onComplete: (xp: number, recipientIds: string[], message: string, coreValues: CoreValue[]) => void;
  onCancel: () => void;
}

const RecognitionWizard: React.FC<RecognitionWizardProps> = ({ users, currentUser, config, shoutoutCount, onComplete, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [selectedValues, setSelectedValues] = useState<CoreValue[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult>({ 
    score: 0, 
    feedback: "Start typing!", 
    detectedValue: null, 
    corn: {
        context: { present: false, feedback: "" },
        observation: { present: false, feedback: "" },
        result: { present: false, feedback: "" },
        nextStep: { present: false, feedback: "" }
    },
    refinedMessage: null
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { currentTheme } = useTheme();

  const quotaRemaining = config.budget.monthlyQuota - shoutoutCount;
  const isOverQuota = quotaRemaining <= 0;
  
  // AI Enabled Check
  const isAIActive = config.ai.enabled && config.ai.apiKey && config.ai.apiKey.length > 0;

  // useEffect moved to top level
  useEffect(() => {
      if (step !== 2) return;
      
      if (!isAIActive) {
          setAnalysis(prev => ({...prev, feedback: "AI Coaching is offline."}));
          return;
      }

      const timer = setTimeout(async () => {
          if (message.length > 10) {
              setIsAnalyzing(true);
              const result = await analyzeShoutout(message, config.ai);
              setAnalysis(result);
              // Pre-select detected value if we don't have a selection yet
              if (result.detectedValue) {
                setSelectedValues(prev => prev.length === 0 ? [result.detectedValue!] : prev);
              }
              setIsAnalyzing(false);
          }
      }, 1000);
      return () => clearTimeout(timer);
  }, [message, step, config.ai, isAIActive]);

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.find(u => u.id === user.id)) {
        setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
        setSelectedUsers([...selectedUsers, user]);
    }
  };

  const toggleValueSelection = (val: CoreValue) => {
    if (selectedValues.includes(val)) {
        setSelectedValues(selectedValues.filter(v => v !== val));
    } else {
        setSelectedValues([...selectedValues, val]);
    }
  };

  const getHealthColor = (score: number) => {
      if (score < 40) return 'bg-danger';
      if (score < 80) return 'bg-accent';
      return 'bg-primary';
  };

  const useRefinedMessage = () => {
    if (analysis.refinedMessage) {
        setMessage(analysis.refinedMessage);
    }
  };
  
  // Step 1: Select Colleagues (Multi-select)
  if (step === 1) {
    return (
      <div className="space-y-6 animate-pop h-full flex flex-col">
        {/* Budget Banner */}
        {config.budget.enforcementMode === 'warning' && isOverQuota && (
            <div className="bg-accent/10 border-theme border-accent text-accentDark p-3 rounded-theme text-xs font-bold text-center">
                Warning: You have reached your monthly quota of {config.budget.monthlyQuota}.
            </div>
        )}
        {!isOverQuota && (
            <div className="text-center text-xs font-bold text-textMuted">
                Monthly Budget: {shoutoutCount}/{config.budget.monthlyQuota} Used
            </div>
        )}

        <OwlMascot message="Who deserves a shout-out? Pick one or more!" mood="neutral" />
        <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
            {users.filter(u => u.id !== currentUser.id).map(user => {
                const isSelected = selectedUsers.some(u => u.id === user.id);
                return (
                    <div 
                    key={user.id}
                    onClick={() => toggleUserSelection(user)}
                    className={`
                        cursor-pointer p-4 rounded-theme border-theme transition-all
                        flex flex-col items-center gap-2 relative border-b-[4px]
                        ${isSelected
                        ? 'border-secondary bg-secondary/10 translate-y-1 !border-b-2' 
                        : 'border-borderMain hover:border-textMuted bg-background'
                        }
                    `}
                    >
                    {isSelected && (
                        <div className="absolute top-2 right-2 bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {currentTheme.icons.ui.check}
                        </div>
                    )}
                    <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-borderMain" />
                    <span className="font-bold text-textMain text-center text-sm">{user.name}</span>
                    </div>
                );
            })}
            </div>
        </div>
        <div className="flex justify-between pt-4 border-t-theme border-borderMain">
            <DuoButton variant="ghost" onClick={onCancel}>Cancel</DuoButton>
            <DuoButton 
                disabled={selectedUsers.length === 0} 
                onClick={() => setStep(2)}
                className="w-40"
            >
                CONTINUE
            </DuoButton>
        </div>
      </div>
    );
  }

  // Step 2: Draft Message (AI Powered with CORN)
  if (step === 2) {
    return (
      <div className="space-y-4 animate-pop h-full flex flex-col">
        <div className="flex justify-between items-center mb-1">
           <DuoButton variant="ghost" onClick={() => setStep(1)} className="!p-0 text-sm">{currentTheme.icons.ui.back} Back</DuoButton>
           <span className="font-bold text-textMuted uppercase tracking-widest text-xs">Step 2 of 3</span>
        </div>

        {!isAIActive ? (
            <div className="bg-textMuted/10 p-4 rounded-theme border-theme border-textMuted flex items-center gap-3">
                <div className="text-2xl text-textMuted grayscale opacity-50">{currentTheme.icons.mascot.sad}</div>
                <div>
                    <div className="font-black text-textMain text-sm">AI Coach Sleeping</div>
                    <div className="text-xs text-textMuted">Ask admin to configure API keys in settings to enable feedback.</div>
                </div>
            </div>
        ) : (
            <OwlMascot 
            mood={analysis.score > 80 ? 'happy' : 'neutral'} 
            message={analysis.feedback} 
            />
        )}

        {/* Health Bar (Only if AI Active) */}
        {isAIActive && (
            <div className="h-4 w-full bg-borderMain rounded-full overflow-hidden border-2 border-borderMain relative">
                <div 
                    className={`h-full transition-all duration-500 ${getHealthColor(analysis.score)}`} 
                    style={{ width: `${analysis.score}%` }}
                />
                <div className="absolute top-0 w-full text-center text-[10px] font-black text-black/30 mt-0">
                    QUALITY METER
                </div>
            </div>
        )}

        <textarea 
            className="w-full h-40 p-4 rounded-theme border-theme border-borderMain focus:border-secondary focus:border-b-[6px] outline-none resize-none text-xl text-textMain font-medium bg-background placeholder:text-textMuted/50"
            placeholder={`What did ${selectedUsers.map(u => u.name.split(' ')[0]).join(', ')} do?`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
        />

        {/* CORN Analysis Grid (Only if AI Active) */}
        {isAIActive && (
            <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                    { label: 'Context', metric: analysis.corn.context },
                    { label: 'Observation', metric: analysis.corn.observation },
                    { label: 'Result', metric: analysis.corn.result },
                    { label: 'Next Step', metric: analysis.corn.nextStep }
                ].map((item, idx) => (
                    <div key={idx} className={`p-2 rounded-theme-sm border-theme text-xs flex items-center justify-between ${item.metric.present ? 'bg-primary/10 border-primary' : 'bg-background border-borderMain'}`}>
                        <span className="font-bold text-textMain">{item.label}</span>
                        <span className="">{item.metric.present ? currentTheme.icons.ui.check : '⚪'}</span>
                    </div>
                ))}
            </div>
        )}

        {isAIActive && analysis.refinedMessage && analysis.score < 90 && (
            <div className="bg-secondary/10 p-3 rounded-theme border-theme border-secondary border-dashed text-sm text-textMain">
                <p className="font-bold mb-1 text-secondaryDark">💡 AI Suggestion:</p>
                <p className="italic opacity-80 mb-2">"{analysis.refinedMessage}"</p>
                <button 
                    onClick={useRefinedMessage}
                    className="text-xs bg-secondary text-white font-bold px-3 py-1 rounded-theme-sm hover:bg-secondaryDark transition-colors"
                >
                    Use This
                </button>
            </div>
        )}

        <div className="flex-1"></div>

        <DuoButton 
            disabled={message.length < 5 || isAnalyzing} 
            onClick={() => setStep(3)}
            fullWidth
            className="mt-2"
        >
            CHECK VALUES
        </DuoButton>
      </div>
    );
  }

  // Step 3: Value Match
  if (step === 3) {
      return (
          <div className="space-y-6 animate-pop h-full flex flex-col">
              <OwlMascot 
                mood="excited" 
                message={analysis.detectedValue 
                    ? `I think this sounds like "${analysis.detectedValue}"!` 
                    : "Which core values does this represent?"} 
              />
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {Object.values(CoreValue).map((val) => {
                    const isSelected = selectedValues.includes(val); 
                    
                    return (
                        <button
                            key={val}
                            onClick={() => toggleValueSelection(val)}
                            className={`
                                w-full p-4 rounded-theme border-theme transition-all flex items-center justify-between font-bold border-b-[4px]
                                ${isSelected 
                                    ? CORE_VALUE_COLORS[val] + ' text-white !border-b-0 translate-y-1' 
                                    : 'bg-surface border-borderMain text-textMuted hover:bg-background'}
                            `}
                        >
                            {val}
                            {isSelected && <span className="text-xl">{currentTheme.icons.ui.check}</span>}
                        </button>
                    )
                })}
              </div>

              <div className="pt-4">
                <DuoButton 
                    variant="primary" 
                    fullWidth 
                    disabled={selectedValues.length === 0}
                    onClick={() => {
                        setStep(4);
                        setTimeout(() => onComplete(50, selectedUsers.map(u => u.id), message, selectedValues), 2500); 
                    }}
                >
                    SEND SHOUT-OUT (+50 XP)
                </DuoButton>
              </div>
          </div>
      )
  }

  // Step 4: Success
  if (step === 4) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center animate-pop relative overflow-hidden">
               {/* Confetti simulation using theme icons */}
               {[...Array(20)].map((_, i) => (
                   <div 
                     key={i} 
                     className="absolute animate-float text-xl"
                     style={{
                         top: `${Math.random() * 100}%`,
                         left: `${Math.random() * 100}%`,
                         animationDelay: `${Math.random() * 2}s`,
                         opacity: 0.5
                     }}
                   >
                       {currentTheme.icons.gamification.confetti[Math.floor(Math.random() * currentTheme.icons.gamification.confetti.length)]}
                   </div>
               ))}

              <div className="text-8xl mb-6 animate-bounce">{currentTheme.icons.gamification.confetti[0]}</div>
              <h2 className="text-4xl font-black text-primary mb-4">SHOUT-OUT SENT!</h2>
              
              <div className="bg-surface p-6 rounded-theme border-theme border-borderMain shadow-sm w-full max-w-sm mb-6">
                <div className="text-sm font-bold text-textMuted uppercase mb-2">Rewards Earned</div>
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-textMain">XP Gained</span>
                    <span className="font-black text-accent text-xl">+50 {currentTheme.icons.gamification.xp}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-textMain">Streak</span>
                    <span className="font-black text-danger text-xl">{currentTheme.icons.gamification.streak} Extended!</span>
                </div>
              </div>

              <p className="text-textMuted font-bold animate-pulse">Returning to feed...</p>
          </div>
      )
  }

  return null;
};

export default RecognitionWizard;

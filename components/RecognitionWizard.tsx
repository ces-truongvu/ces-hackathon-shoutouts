
import React, { useState, useEffect, useMemo } from 'react';
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
  shoutoutCount: number; 
  onComplete: (xp: number, recipientIds: string[], message: string, coreValues: CoreValue[]) => void;
  onCancel: () => void;
}

const RecognitionWizard: React.FC<RecognitionWizardProps> = ({ users, currentUser, config, shoutoutCount, onComplete, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [searchTerm, setSearchTerm] = useState('');
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

  const isAIActive = config.ai.enabled && config.ai.apiKey && config.ai.apiKey.length > 0;

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

  const filteredUsers = useMemo(() => {
    return users
      .filter(u => u.id !== currentUser.id)
      .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [users, currentUser.id, searchTerm]);

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

  const getLeagueColor = (league: string) => {
    switch(league) {
        case 'Gold': return 'text-accent';
        case 'Silver': return 'text-textMuted';
        case 'Bronze': return 'text-orange-700';
        default: return 'text-textMuted';
    }
  };
  
  if (step === 1) {
    return (
      <div className="space-y-3 animate-pop h-full flex flex-col">
        {/* Progress Header */}
        <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-textMuted uppercase shrink-0">
            <span>Step 1: Pick Teammates</span>
            <span>{shoutoutCount}/{config.budget.monthlyQuota} Quota</span>
        </div>

        {/* Search Bar - Compact */}
        <div className="relative shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textMuted/50 text-sm">
                🔍
            </div>
            <input 
                type="text"
                placeholder="Search teammates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-theme border-theme border-borderMain bg-background font-bold text-textMain focus:border-secondary focus:border-b-[3px] outline-none transition-all placeholder:text-textMuted/40 text-sm"
            />
        </div>

        {/* Selected List - Horizontal Strip */}
        {selectedUsers.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 shrink-0">
                {selectedUsers.map(u => (
                    <div 
                        key={u.id} 
                        onClick={() => toggleUserSelection(u)}
                        className="flex-shrink-0 bg-secondary/10 border border-secondary/30 rounded-full pl-1 pr-2 py-0.5 flex items-center gap-1.5 cursor-pointer hover:bg-danger/10 hover:border-danger transition-colors group"
                    >
                        <img src={u.avatar} className="w-4 h-4 rounded-full" alt="" />
                        <span className="text-[9px] font-black text-secondaryDark group-hover:hidden truncate max-w-[50px]">{u.name.split(' ')[0]}</span>
                        <span className="text-[9px] font-black text-danger hidden group-hover:block uppercase">×</span>
                    </div>
                ))}
            </div>
        )}

        {/* Scrollable List Area - Ultra Dense 5 Column Grid with Large Avatars */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0">
            {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                    <div className="text-4xl mb-2">{currentTheme.icons.mascot.sad}</div>
                    <p className="text-[10px] font-black uppercase tracking-widest">No Matches</p>
                </div>
            ) : (
                <div className="grid grid-cols-5 gap-x-1 gap-y-6 py-4">
                    {filteredUsers.map(user => {
                        const isSelected = selectedUsers.some(u => u.id === user.id);
                        return (
                            <div 
                                key={user.id}
                                onClick={() => toggleUserSelection(user)}
                                className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-95 transition-transform"
                            >
                                <div className="relative">
                                    <div className={`
                                        w-14 h-14 rounded-full flex items-center justify-center border-theme transition-all duration-200
                                        ${isSelected 
                                            ? 'border-secondary scale-110 shadow-lg ring-4 ring-secondary/20' 
                                            : 'border-borderMain group-hover:border-textMuted'}
                                    `}>
                                        <img 
                                            src={user.avatar} 
                                            alt={user.name} 
                                            className="w-full h-full rounded-full object-cover" 
                                        />
                                    </div>
                                    {isSelected && (
                                        <div className="absolute -top-1 -right-1 bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black border-2 border-white animate-pop">
                                            {currentTheme.icons.ui.check}
                                        </div>
                                    )}
                                </div>
                                <div className="text-center w-full px-1">
                                    <div className={`font-black text-[10px] truncate leading-tight uppercase tracking-tight ${isSelected ? 'text-secondaryDark' : 'text-textMain'}`}>
                                        {user.name.split(' ')[0]}
                                    </div>
                                    <div className={`text-[7px] font-black uppercase opacity-60 ${getLeagueColor(user.league)}`}>
                                        {user.league}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t-theme border-borderMain flex items-center justify-between bg-surface shrink-0">
            <DuoButton variant="ghost" onClick={onCancel} className="!px-2 !py-1 !text-[10px]">Cancel</DuoButton>
            <div className="flex items-center gap-3">
                {selectedUsers.length > 0 && (
                    <div className="text-[10px] font-black text-secondaryDark uppercase text-right leading-none">
                        <div>{selectedUsers.length} Selected</div>
                    </div>
                )}
                <DuoButton 
                    disabled={selectedUsers.length === 0} 
                    onClick={() => setStep(2)}
                    className="w-24 !py-2 !text-xs"
                >
                    NEXT
                </DuoButton>
            </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4 animate-pop h-full flex flex-col">
        <div className="flex justify-between items-center mb-1">
           <DuoButton variant="ghost" onClick={() => setStep(1)} className="!p-0 text-sm">{currentTheme.icons.ui.back} Back</DuoButton>
           <span className="font-bold text-textMuted uppercase tracking-widest text-xs">Step 2: Coaching</span>
        </div>

        {!isAIActive ? (
            <div className="bg-textMuted/10 p-4 rounded-theme border-theme border-borderMain flex items-center gap-3">
                <div className="text-2xl text-textMuted grayscale opacity-50">{currentTheme.icons.mascot.sad}</div>
                <div>
                    <div className="font-black text-textMain text-sm">AI Coach Sleeping</div>
                    <div className="text-xs text-textMuted">Ask admin to configure API keys in settings.</div>
                </div>
            </div>
        ) : (
            <OwlMascot 
            mood={analysis.score > 80 ? 'happy' : 'neutral'} 
            message={analysis.feedback} 
            />
        )}

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
            className="w-full flex-1 p-4 rounded-theme border-theme border-borderMain focus:border-secondary focus:border-b-[6px] outline-none resize-none text-xl text-textMain font-medium bg-background placeholder:text-textMuted/50"
            placeholder={`What did ${selectedUsers.map(u => u.name.split(' ')[0]).join(', ')} do?`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
        />

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

  if (step === 4) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center animate-pop relative overflow-hidden">
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

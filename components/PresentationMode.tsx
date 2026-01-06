
import React, { useState, useEffect, useCallback } from 'react';
import { Shoutout, User } from '../types';
import { CORE_VALUE_COLORS } from '../constants';
import DuoButton from './DuoButton';
import { useTheme } from '../context/ThemeContext';

interface PresentationModeProps {
  shoutouts: Shoutout[];
  users: readonly User[];
  onClose: () => void;
  onMarkAnnounced: (shoutoutId: string) => void;
}

const PresentationMode: React.FC<PresentationModeProps> = ({ shoutouts, users, onClose, onMarkAnnounced }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | 'none'>('none');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { currentTheme } = useTheme();

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const currentShoutout = shoutouts[currentIndex];

  const nextSlide = () => {
    if (currentIndex < shoutouts.length - 1) {
      setDirection('right');
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setDirection('left');
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;
    if (diff > 50) {
      nextSlide();
      setTouchStart(null);
    } else if (diff < -50) {
      prevSlide();
      setTouchStart(null);
    }
  };

  const handleTripleClick = (e: React.MouseEvent) => {
    // Check for triple click (detail === 3)
    if (e.detail === 3) {
      handleAnnounce();
    }
  };

  const handleAnnounce = () => {
    if (!currentShoutout) return;
    setShowConfetti(true);
    setTimeout(() => {
      onMarkAnnounced(currentShoutout.id);
      setShowConfetti(false);
      // If we announced the last one, close or stay? 
      // Logic: If it removes from list, we stick to index or go to next available
      if (shoutouts.length <= 1) {
        onClose();
      } else if (currentIndex >= shoutouts.length - 1) {
        setCurrentIndex(prev => Math.max(0, prev - 1));
      }
    }, 800);
  };

  if (!currentShoutout) {
    return (
      <div className="fixed inset-0 z-50 bg-eos-green flex flex-col items-center justify-center text-white p-8 animate-pop">
        <div className="text-8xl mb-4">{currentTheme.icons.ui.hello}</div>
        <h1 className="text-4xl font-black mb-4 text-center">ALL CAUGHT UP!</h1>
        <p className="font-bold text-xl mb-8 opacity-90">No pending shout-outs to announce.</p>
        <DuoButton variant="secondary" onClick={onClose}>Exit Mode</DuoButton>
      </div>
    );
  }

  const fromUser = users.find(u => u.id === currentShoutout.fromUserId);
  const recipients = currentShoutout.recipientIds.map(id => users.find(u => u.id === id)).filter(Boolean) as User[];

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <div className="text-white/50 font-black uppercase tracking-widest text-sm">
          Presentation Mode • {currentIndex + 1} / {shoutouts.length}
        </div>
        <button 
          onClick={onClose} 
          className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold transition-colors"
        >
          {currentTheme.icons.ui.close}
        </button>
      </div>

      {/* Main Card Area */}
      <div 
        className="w-full max-w-2xl relative perspective-1000"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div 
            onClick={handleTripleClick}
            className={`
                bg-white rounded-[32px] p-8 md:p-12 border-b-8 border-gray-300 shadow-2xl relative cursor-pointer select-none
                transition-all duration-300 transform
                ${showConfetti ? 'scale-110 opacity-0 translate-y-[-100px] rotate-6' : 'scale-100 opacity-100'}
            `}
        >
             {/* Triple Click Hint */}
             <div className="absolute top-4 right-4 text-[10px] text-gray-300 font-bold uppercase border border-gray-100 px-2 py-1 rounded-lg">
                Triple Tap to Mark Announced
             </div>

             {/* Header: Giver -> Receiver */}
             <div className="flex flex-col items-center mb-8 gap-4">
                 <div className="flex items-center gap-4">
                    <img src={fromUser?.avatar} className="w-16 h-16 rounded-full border-4 border-gray-100" />
                    <div className="text-gray-400 font-black text-2xl">➜</div>
                    <div className="flex -space-x-4">
                        {recipients.map(r => (
                            <img key={r.id} src={r.avatar} className="w-20 h-20 rounded-full border-4 border-white shadow-lg" />
                        ))}
                    </div>
                 </div>
                 <div className="text-center">
                     <h2 className="text-3xl md:text-4xl font-black text-eos-text">
                        {recipients.map(r => r.name).join(', ')}
                     </h2>
                     <p className="text-gray-400 font-bold text-lg">from {fromUser?.name}</p>
                 </div>
             </div>

             {/* Message */}
             <div className="text-center mb-10">
                 <p className="text-2xl md:text-3xl font-bold text-eos-text leading-tight">
                    "{currentShoutout.message}"
                 </p>
             </div>

             {/* Core Values */}
             <div className="flex flex-wrap justify-center gap-3 mb-8">
                {currentShoutout.coreValues.map(val => (
                    <span 
                        key={val} 
                        className={`text-sm md:text-lg font-black uppercase px-6 py-2 rounded-2xl text-white border-b-4 transform hover:-translate-y-1 transition-transform ${CORE_VALUE_COLORS[val]}`}
                    >
                        {val}
                    </span>
                ))}
             </div>

             {/* Actions */}
             <div className="flex justify-center pt-4 border-t-2 border-gray-100 gap-4">
                <DuoButton 
                    variant="ghost" 
                    onClick={(e) => { e.stopPropagation(); prevSlide(); }} 
                    disabled={currentIndex === 0}
                >
                    {currentTheme.icons.ui.back} Previous
                </DuoButton>
                <DuoButton 
                    variant="primary" 
                    onClick={(e) => { e.stopPropagation(); handleAnnounce(); }}
                    className="w-40"
                >
                    ANNOUNCE!
                </DuoButton>
                <DuoButton 
                    variant="ghost" 
                    onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                    disabled={currentIndex === shoutouts.length - 1}
                >
                    Next ➜
                </DuoButton>
             </div>
        </div>
      </div>

      {/* Confetti Effect (CSS driven in index.html, triggering class here) */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[60]">
             <div className="text-9xl animate-bounce">{currentTheme.icons.gamification.confetti[0]}</div>
        </div>
      )}

      {/* Keyboard Hint */}
      <div className="absolute bottom-8 text-white/40 text-sm font-bold hidden md:block">
         Use Arrow Keys ⬅ ➡ to navigate • ESC to close
      </div>
    </div>
  );
};

export default PresentationMode;

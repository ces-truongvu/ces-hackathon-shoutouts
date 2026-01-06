
import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface OwlMascotProps {
  mood?: 'happy' | 'neutral' | 'sad' | 'excited';
  message: string;
}

const OwlMascot: React.FC<OwlMascotProps> = ({ mood = 'neutral', message }) => {
  const { currentTheme } = useTheme();

  const getEmoji = () => {
    switch (mood) {
      case 'happy': return currentTheme.icons.mascot.happy;
      case 'excited': return currentTheme.icons.mascot.excited;
      case 'sad': return currentTheme.icons.mascot.sad;
      default: return currentTheme.icons.mascot.neutral;
    }
  };

  return (
    <div className="flex items-end gap-3 my-4">
      <div className="text-6xl filter drop-shadow-md animate-pop origin-bottom hover:scale-110 transition-transform cursor-pointer">
        {getEmoji()}
      </div>
      <div className="bg-surface border-theme border-borderMain rounded-theme rounded-bl-none p-4 shadow-sm relative mb-4 max-w-[70%] animate-pop">
        <p className="text-textMain font-bold text-sm md:text-base leading-snug">
          {message}
        </p>
      </div>
    </div>
  );
};

export default OwlMascot;

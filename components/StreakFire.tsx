
import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface StreakFireProps {
  days: number;
  active: boolean;
}

const StreakFire: React.FC<StreakFireProps> = ({ days, active }) => {
  const { currentTheme } = useTheme();

  return (
    <div className="relative flex flex-col items-center justify-center px-2 cursor-default select-none group">
      <div className={`text-3xl transition-transform ${active ? 'animate-bounce-short drop-shadow-sm' : 'grayscale opacity-50'}`}>
        {currentTheme.icons.gamification.streak}
      </div>
      <span className={`font-black text-sm ${active ? 'text-textMain' : 'text-textMuted'}`}>
        {days}
      </span>
    </div>
  );
};

export default StreakFire;

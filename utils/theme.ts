
export interface ThemeColors {
  primary: string;
  primaryDark: string; // For 3D border effect
  secondary: string;
  secondaryDark: string;
  accent: string;
  accentDark: string;
  danger: string;
  dangerDark: string;
  background: string;
  surface: string; // Card background
  text: string;
  textMuted: string;
  border: string;
  
  // Core Value Specific Colors (Semantic)
  value1: string; 
  value2: string; 
  value3: string; 
  value4: string; 
}

export interface ThemeIcons {
  nav: {
    home: string;
    leaderboard: string;
    profile: string;
    analytics: string;
    rewards: string;
    settings: string;
    logout: string;
  };
  gamification: {
    streak: string; // The streak symbol (Fire, Star, Heart)
    xp: string; // XP symbol (XP, Coin, Gem)
    trophy: string; // Leaderboard trophy
    confetti: string[]; // Array of confetti emojis
    crown: string;
  };
  mascot: {
    happy: string;
    excited: string;
    neutral: string;
    sad: string;
  };
  ui: {
    back: string;
    close: string;
    check: string;
    hello: string;
    empty: string;
    clap: string;
    draw: string; // Slot machine/Draw icon
  };
}

export interface AppTheme {
  id: string;
  name: string;
  description: string;
  font: string; // CSS Font Family
  radius: string; // CSS Border Radius (e.g., '16px', '0px')
  borderWidth: string; // For general UI elements
  buttonBorderWidth: string; // For the 3D button effect
  shadow: string; // Box shadow definition
  baseFontSize: string; // Base REM size (e.g., '16px', '18px')
  bgPattern?: string; // Optional CSS background gradient/pattern
  colors: ThemeColors;
  icons: ThemeIcons;
}

export const THEMES: Record<string, AppTheme> = {
  default: {
    id: 'default',
    name: 'Default',
    description: 'The classic gamified experience.',
    font: 'Nunito',
    radius: '16px',
    borderWidth: '2px',
    buttonBorderWidth: '4px',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    baseFontSize: '18px', // Bigger by default
    colors: {
      primary: '#58CC02',
      primaryDark: '#46A302',
      secondary: '#1CB0F6',
      secondaryDark: '#1899D6',
      accent: '#FF9600',
      accentDark: '#D47D00',
      danger: '#FF4B4B',
      dangerDark: '#D63E3E',
      background: '#FEFEFE',
      surface: '#FFFFFF',
      text: '#4B4B4B',
      textMuted: '#AFB2B7',
      border: '#E5E5E5',
      value1: '#A855F7',
      value2: '#3B82F6',
      value3: '#22C55E',
      value4: '#EF4444'
    },
    icons: {
      nav: { home: '🏠', leaderboard: '🏆', profile: '👤', analytics: '📊', rewards: '🎁', settings: '⚙️', logout: '🚪' },
      gamification: { streak: '🔥', xp: '⚡', trophy: '🏆', crown: '👑', confetti: ['🎉', '✨', '⭐', '🎊'] },
      mascot: { happy: '🦉', excited: '🤩', neutral: '🦉', sad: '🥺' },
      ui: { back: '←', close: '✕', check: '✓', hello: '👋', empty: '📭', clap: '👏', draw: '🎰' }
    }
  },
  barbie: {
    id: 'barbie',
    name: 'Dream House',
    description: 'Life in plastic, it\'s fantastic!',
    font: 'Fredoka', 
    radius: '24px', 
    borderWidth: '3px', 
    buttonBorderWidth: '5px',
    shadow: '0 6px 16px rgba(236, 72, 153, 0.4)',
    baseFontSize: '18px', 
    bgPattern: 'radial-gradient(circle, #fce7f3 2px, transparent 2.5px)', 
    colors: {
      primary: '#ec4899', // Pink 500
      primaryDark: '#be185d', // Pink 700
      secondary: '#06b6d4', // Cyan 500
      secondaryDark: '#0891b2', // Cyan 600
      accent: '#facc15', // Yellow 400
      accentDark: '#ca8a04',
      danger: '#f43f5e', // Rose 500
      dangerDark: '#be123c',
      background: '#fff1f2', // Rose 50
      surface: '#ffffff',
      text: '#831843', // Pink 900
      textMuted: '#db2777', // Pink 600
      border: '#fbcfe8', // Pink 200
      value1: '#ec4899',
      value2: '#06b6d4',
      value3: '#a855f7',
      value4: '#facc15'
    },
    icons: {
      nav: { home: '🏰', leaderboard: '👑', profile: '🎀', analytics: '📈', rewards: '🛍️', settings: '💄', logout: '👠' },
      gamification: { streak: '💖', xp: '💎', trophy: '🦄', crown: '👸', confetti: ['💅', '💖', '✨', '🌸'] },
      mascot: { happy: '😽', excited: '😻', neutral: '🐱', sad: '😿' },
      ui: { back: '🔙', close: '❌', check: '💅', hello: '💖', empty: '👜', clap: '💋', draw: '👛' }
    }
  },
  plumber: {
    id: 'plumber',
    name: 'Plumber 64',
    description: 'It\'s-a me! Bouncy, round, and colorful.',
    font: 'Fredoka', // Very round, bubble-like font
    radius: '24px', // Exaggerated roundness
    borderWidth: '4px', // Thick cartoon borders
    buttonBorderWidth: '8px', // Deep 3D press
    shadow: '4px 4px 0px 0px rgba(0,0,0,0.2)',
    baseFontSize: '20px', // Extra chunky
    bgPattern: 'radial-gradient(#e0f2fe 1px, transparent 1px)',
    colors: {
      primary: '#E60012', // Mario Red
      primaryDark: '#90000B',
      secondary: '#0047BB', // Overalls Blue
      secondaryDark: '#002664',
      accent: '#FFD700', // Star Yellow
      accentDark: '#B29600',
      danger: '#5C3A21', // Goomba Brown
      dangerDark: '#3A2414',
      background: '#6BB5FF', // Sky Blue
      surface: '#FFFFFF',
      text: '#222222',
      textMuted: '#666666',
      border: '#222222', // Black cartoon outlines
      value1: '#E60012',
      value2: '#0047BB',
      value3: '#009C3B', // Luigi Green
      value4: '#FFD700'
    },
    icons: {
      nav: { home: '🏰', leaderboard: '🏳️', profile: '👨‍🔧', analytics: '📝', rewards: '📦', settings: '🔧', logout: '🌪️' },
      gamification: { streak: '⭐', xp: '🪙', trophy: '🍄', crown: '👑', confetti: ['🪙', '🍄', '⭐', '🌻'] },
      mascot: { happy: '🦖', excited: '🥚', neutral: '🦖', sad: '🐢' },
      ui: { back: '⬅️', close: '✖️', check: '✅', hello: '‼️', empty: '🕸️', clap: '🆙', draw: '❓' }
    }
  },
  pocket: {
    id: 'pocket',
    name: 'Pocket Monster',
    description: 'Gotta catch \'em all! 8-bit handheld nostalgia.',
    font: '"Press Start 2P", monospace', // Pixel font
    radius: '0px', // Sharp edges
    borderWidth: '4px',
    buttonBorderWidth: '6px',
    shadow: '6px 6px 0px 0px #0f380f', // Deep dark shadow
    baseFontSize: '12px', // Pixel fonts need to be smaller to be readable/fit
    colors: {
      primary: '#306230', // Dark Green (Gameboy)
      primaryDark: '#0f380f', // Darkest
      secondary: '#306230', 
      secondaryDark: '#0f380f',
      accent: '#0f380f', // Changed from Light Green (#8bac0f) to Darkest (#0f380f) to fix invisible text
      accentDark: '#000000',
      danger: '#0f380f',
      dangerDark: '#000000',
      background: '#8bac0f', // Screen Light
      surface: '#9bbc0f', // Screen Lightest
      text: '#0f380f', // Ink - Darkest
      textMuted: '#1f441f', // Made darker for better contrast
      border: '#0f380f', // Solid dark borders
      value1: '#0f380f', 
      value2: '#306230', 
      value3: '#8bac0f', 
      value4: '#0f380f'
    },
    icons: {
      nav: { home: '🛖', leaderboard: '⚔️', profile: '🧢', analytics: '📟', rewards: '🎒', settings: '💾', logout: '🔌' },
      gamification: { streak: '⚡', xp: '🍬', trophy: '🏅', crown: '👑', confetti: ['⚡', '🍎', '💎', '🌿'] },
      mascot: { happy: '👾', excited: '🐉', neutral: '👾', sad: '🥚' },
      ui: { back: '◀', close: '✖', check: '🆗', hello: '❗', empty: '🕸', clap: '🤜', draw: '🎲' }
    }
  },
  blocks: {
    id: 'blocks',
    name: 'Block Builder',
    description: 'Line \'em up. 1984 logic puzzle vibes.',
    font: 'VT323', // Terminal/Arcade font
    radius: '2px', // Slight chamfer
    borderWidth: '2px',
    buttonBorderWidth: '4px',
    shadow: '0 0 10px rgba(0, 255, 0, 0.2)', // Neon glow hint
    baseFontSize: '20px',
    bgPattern: 'linear-gradient(rgba(18, 18, 18, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 18, 18, 0.8) 1px, transparent 1px)',
    colors: {
      primary: '#bf00ff', // T-Piece Purple
      primaryDark: '#8000aa',
      secondary: '#00f0f0', // I-Piece Cyan
      secondaryDark: '#00aaaa',
      accent: '#eec20e', // O-Piece Yellow
      accentDark: '#aa8800',
      danger: '#f00000', // Z-Piece Red
      dangerDark: '#aa0000',
      background: '#1a1a1d', // Almost Black
      surface: '#2d2d30', // Gray block
      text: '#ffffff',
      textMuted: '#a0a0a0',
      border: '#555555',
      value1: '#00f0f0',
      value2: '#0000f0', // J-Piece Blue
      value3: '#00f000', // S-Piece Green
      value4: '#f0a000'  // L-Piece Orange
    },
    icons: {
      nav: { home: '🏠', leaderboard: '🏅', profile: '🗿', analytics: '📉', rewards: '🧊', settings: '🔧', logout: '⏹️' },
      gamification: { streak: '🚀', xp: '⭐️', trophy: '🏆', crown: '👑', confetti: ['🟪', '🟦', '🟧', '🟨'] },
      mascot: { happy: '🤖', excited: '👾', neutral: '🤖', sad: '💥' },
      ui: { back: '◀', close: 'X', check: 'OK', hello: '👋', empty: '⬛', clap: '⬆️', draw: '🎲' }
    }
  },
  maze: {
    id: 'maze',
    name: 'Waka Waka',
    description: 'Chasing ghosts in a neon maze.',
    font: 'VT323',
    radius: '8px',
    borderWidth: '2px',
    buttonBorderWidth: '4px',
    shadow: '0 0 15px var(--color-primary)', // Neon Glow
    baseFontSize: '20px',
    colors: {
      primary: '#FFFF00', // Pac-Man Yellow
      primaryDark: '#B3B300',
      secondary: '#2121ff', // Maze Blue
      secondaryDark: '#0000bb',
      accent: '#ffb8ae', // Pinky
      accentDark: '#ff5c5c', // Blinky Red (Mapping logic slightly adjusted)
      danger: '#ff0000', // Blinky
      dangerDark: '#990000',
      background: '#000000', // Void
      surface: '#000000', // Void
      text: '#ffffff',
      textMuted: '#dedede',
      border: '#2121ff', // Maze Wall Blue
      value1: '#ff0000', // Blinky
      value2: '#ffb8ff', // Pinky
      value3: '#00ffff', // Inky
      value4: '#ffb852'  // Clyde
    },
    icons: {
      nav: { home: '🟡', leaderboard: '🍒', profile: '👻', analytics: '🍎', rewards: '🍓', settings: '🕹️', logout: '🚪' },
      gamification: { streak: '🍒', xp: '•', trophy: '🗝️', crown: '👑', confetti: ['🍒', '🍓', '🍊', '🍎'] },
      mascot: { happy: '👻', excited: '😱', neutral: '👻', sad: '👀' },
      ui: { back: '◀', close: 'X', check: 'OK', hello: '🟡', empty: '⬛', clap: '🔔', draw: '🍒' }
    }
  }
};

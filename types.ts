
export enum CoreValue {
  BRAVELY_SPEAK = "Bravely Speak & Humbly Listen",
  WE_BEFORE_ME = "We Before Me",
  HUNGRY_TO_LEARN = "Hungry to Learn",
  PURSUIT_OF_EXCELLENCE = "Pursuit of Excellence"
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  league: 'Bronze' | 'Silver' | 'Gold';
  streakDays: number;
  role: 'Admin' | 'Staff';
}

export interface Shoutout {
  id: string;
  fromUserId: string;
  recipientIds: string[];
  message: string;
  coreValues: CoreValue[];
  timestamp: number;
  reactions: number;
  status: 'pending' | 'announced'; // New field for Presentation Mode
}

export interface CornMetric {
  present: boolean;
  feedback: string;
}

export interface AnalysisResult {
  score: number; // 0-100
  feedback: string;
  detectedValue: CoreValue | null;
  corn: {
    context: CornMetric;
    observation: CornMetric;
    result: CornMetric;
    nextStep: CornMetric;
  };
  refinedMessage: string | null;
}

// --- Rewards / Prize Draw Types ---

export interface Gift {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  pointCost: number;
  maxQuantity: number;
  drawEligible: boolean;
}

export interface DrawResult {
  id: string;
  winnerId: string;
  giftId: string;
  drawDate: number;
}

// --- Admin / Configuration Types ---

export interface Meme {
  id: string;
  url: string;
  category: 'Motivation' | 'Funny' | 'Inspiring' | 'Sports';
  caption?: string;
}

export interface AppConfig {
  schedule: {
    shoutoutDay: string; // e.g., "Friday"
    aggregationTime: string; // "17:00"
    reminderTime: string; // "08:00"
  };
  budget: {
    monthlyQuota: number;
    enforcementMode: 'hard_stop' | 'warning';
    resetDay: number; // 1-31
  };
  gamification: {
    streaksEnabled: boolean;
    drawEnabled: boolean;
    leaderboardVisibility: 'public' | 'admin_only';
    xpMultiplier: number;
  };
  rewards: {
    gifts: Gift[];
    lastDrawResult: DrawResult | null;
  };
  content: {
    memes: Meme[];
    reminderTemplate: string;
    dmTemplate: string;
    aggregationHeader: string;
    aggregationIntro: string;
    aggregationFooter: string;
  };
  integration: {
    channelId: string;
  };
}

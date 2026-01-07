
import { CoreValue, AppConfig } from "./types";

export const MOCK_USERS = [
  { id: 'u1', name: 'Alice Chen', avatar: 'https://picsum.photos/100/100?random=1', xp: 1200, league: 'Gold', streakDays: 12, role: 'Admin' },
  { id: 'u2', name: 'Bob Smith', avatar: 'https://picsum.photos/100/100?random=2', xp: 850, league: 'Silver', streakDays: 3, role: 'Staff' },
  { id: 'u3', name: 'Charlie Kim', avatar: 'https://picsum.photos/100/100?random=3', xp: 400, league: 'Bronze', streakDays: 0, role: 'Staff' },
  { id: 'u4', name: 'Diana Prince', avatar: 'https://picsum.photos/100/100?random=4', xp: 920, league: 'Silver', streakDays: 5, role: 'Staff' },
] as const;

// Updated to use semantic theme variables
export const CORE_VALUE_COLORS = {
  [CoreValue.BRAVELY_SPEAK]: 'bg-val1 border-val1',
  [CoreValue.WE_BEFORE_ME]: 'bg-val2 border-val2',
  [CoreValue.HUNGRY_TO_LEARN]: 'bg-val3 border-val3',
  [CoreValue.PURSUIT_OF_EXCELLENCE]: 'bg-val4 border-val4',
};

export const DEFAULT_CONFIG: AppConfig = {
  schedule: {
    shoutoutDay: 'Friday',
    aggregationTime: '17:00',
    reminderTime: '08:00'
  },
  budget: {
    monthlyQuota: 4,
    enforcementMode: 'warning',
    resetDay: 1
  },
  gamification: {
    streaksEnabled: true,
    drawEnabled: true,
    leaderboardVisibility: 'public',
    xpMultiplier: 1.0
  },
  rewards: {
    gifts: [
      { id: 'g1', name: '$50 Amazon Gift Card', description: 'Buy whatever you want!', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Amazon_icon.png/120px-Amazon_icon.png', pointCost: 0, maxQuantity: 5, drawEligible: true },
      { id: 'g2', name: 'Extra PTO Day', description: 'Relax and recharge.', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2662/2662503.png', pointCost: 0, maxQuantity: 2, drawEligible: true },
      { id: 'g3', name: 'Team Lunch Voucher', description: 'Lunch on us!', imageUrl: 'https://cdn-icons-png.flaticon.com/512/1046/1046751.png', pointCost: 0, maxQuantity: 10, drawEligible: false }
    ],
    lastDrawResult: null
  },
  content: {
    memes: [
      { id: 'm1', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzJ4Ynd6YjJ4Ynd6YjJ4Ynd6YjJ4Ynd6YjJ4Ynd6YjJ4Ynd6/d31vTpVi1kQ19Xw1/giphy.gif', category: 'Funny' },
      { id: 'm2', url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif', category: 'Motivation' }
    ],
    reminderTemplate: "It's Shout-out Friday! Who was a rockstar this week?",
    dmTemplate: "🎉 **YOU'VE BEEN RECOGNIZED!** 🎉\n\n**From:** {giver}\n**Value Recognized:** {value}\n\n**Message:**\n\"{message}\"\n\n[View in Shout-Out Feed] [React with Emoji]",
    aggregationHeader: "📢 **FRIDAY SHOUT-OUT RECAP** (Week of {date})",
    aggregationIntro: "Today we recognized {count} colleagues for living our values!",
    aggregationFooter: "Total Shout-Outs This Week: {total} | Most Recognized Value: {topValue}"
  },
  integration: {
    channelId: 'town-square'
  },
  ai: {
    enabled: true,
    provider: 'Gemini',
    apiKey: '', // Empty by default, must be set in Admin
    model: 'gemini-3-flash-preview',
    endpoint: ''
  }
};

// SQL Schema for the User's reference (mimicked by localStorage in this frontend demo)
export const SQL_SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    xp INTEGER DEFAULT 0,
    league TEXT DEFAULT 'Bronze',
    streak_days INTEGER DEFAULT 0,
    last_active_date TEXT,
    role TEXT DEFAULT 'Staff'
);

CREATE TABLE IF NOT EXISTS shoutouts (
    id TEXT PRIMARY KEY,
    from_user_id TEXT NOT NULL,
    to_user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    core_values TEXT NOT NULL, -- Stored as comma-separated values or JSON array
    timestamp INTEGER NOT NULL,
    reactions INTEGER DEFAULT 0,
    FOREIGN KEY(from_user_id) REFERENCES users(id),
    FOREIGN KEY(to_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS leaderboard (
    user_id TEXT PRIMARY KEY,
    weekly_xp INTEGER DEFAULT 0,
    league_rank INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS monthly_quota_tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id TEXT NOT NULL,
    month_year TEXT NOT NULL, -- Format: YYYY-MM
    shoutouts_given INTEGER DEFAULT 0,
    quota_limit INTEGER,
    last_reset DATE
);

-- PRIZE DRAW & GIFT MANAGEMENT --

CREATE TABLE IF NOT EXISTS gift_config (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  point_cost INT,
  max_quantity INT,
  draw_eligible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS draw_entries (
  id INTEGER PRIMARY KEY,
  staff_id VARCHAR(26),
  entry_count INT,  -- Number of entries this staff has
  week_ending DATE,
  created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS draw_results (
  id INTEGER PRIMARY KEY,
  winner_id VARCHAR(26),
  gift_id INT,
  draw_date TIMESTAMP,
  claimed_at TIMESTAMP,
  FOREIGN KEY (gift_id) REFERENCES gift_config(id)
);
`;

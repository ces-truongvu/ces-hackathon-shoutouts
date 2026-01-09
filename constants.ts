import { CoreValue, AppConfig } from "./types";

export const MOCK_USERS = [
  { id: 'u1', name: 'Alice Chen', avatar: 'https://i.pravatar.cc/150?u=u1', xp: 1200, league: 'Gold', streakDays: 12, role: 'Admin' },
  { id: 'u2', name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?u=u2', xp: 850, league: 'Silver', streakDays: 3, role: 'Staff' },
  { id: 'u3', name: 'Charlie Kim', avatar: 'https://i.pravatar.cc/150?u=u3', xp: 400, league: 'Bronze', streakDays: 0, role: 'Staff' },
  { id: 'u4', name: 'Diana Prince', avatar: 'https://i.pravatar.cc/150?u=u4', xp: 920, league: 'Silver', streakDays: 5, role: 'Staff' },
  { id: 'u5', name: 'Ethan Hunt', avatar: 'https://i.pravatar.cc/150?u=u5', xp: 1100, league: 'Gold', streakDays: 8, role: 'Staff' },
  { id: 'u6', name: 'Fiona Gallagher', avatar: 'https://i.pravatar.cc/150?u=u6', xp: 300, league: 'Bronze', streakDays: 2, role: 'Staff' },
  { id: 'u7', name: 'George Bluth', avatar: 'https://i.pravatar.cc/150?u=u7', xp: 1500, league: 'Gold', streakDays: 20, role: 'Admin' },
  { id: 'u8', name: 'Hannah Abbott', avatar: 'https://i.pravatar.cc/150?u=u8', xp: 720, league: 'Silver', streakDays: 4, role: 'Staff' },
  { id: 'u9', name: 'Ian Wright', avatar: 'https://i.pravatar.cc/150?u=u9', xp: 980, league: 'Silver', streakDays: 6, role: 'Staff' },
  { id: 'u10', name: 'Julia Roberts', avatar: 'https://i.pravatar.cc/150?u=u10', xp: 550, league: 'Bronze', streakDays: 1, role: 'Staff' },
  { id: 'u11', name: 'Kevin Hart', avatar: 'https://i.pravatar.cc/150?u=u11', xp: 1350, league: 'Gold', streakDays: 15, role: 'Staff' },
  { id: 'u12', name: 'Laura Palmer', avatar: 'https://i.pravatar.cc/150?u=u12', xp: 640, league: 'Silver', streakDays: 3, role: 'Staff' },
  { id: 'u13', name: 'Mike Ross', avatar: 'https://i.pravatar.cc/150?u=u13', xp: 890, league: 'Silver', streakDays: 5, role: 'Staff' },
  { id: 'u14', name: 'Nina Simone', avatar: 'https://i.pravatar.cc/150?u=u14', xp: 1250, league: 'Gold', streakDays: 10, role: 'Staff' },
  { id: 'u15', name: 'Oscar Wilde', avatar: 'https://i.pravatar.cc/150?u=u15', xp: 210, league: 'Bronze', streakDays: 0, role: 'Staff' },
  { id: 'u16', name: 'Pam Beesly', avatar: 'https://i.pravatar.cc/150?u=u16', xp: 1050, league: 'Gold', streakDays: 7, role: 'Staff' },
  { id: 'u17', name: 'Quentin Blake', avatar: 'https://i.pravatar.cc/150?u=u17', xp: 480, league: 'Bronze', streakDays: 2, role: 'Staff' },
  { id: 'u18', name: 'Riley Reid', avatar: 'https://i.pravatar.cc/150?u=u18', xp: 770, league: 'Silver', streakDays: 4, role: 'Staff' },
  { id: 'u19', name: 'Steve Jobs', avatar: 'https://i.pravatar.cc/150?u=u19', xp: 1600, league: 'Gold', streakDays: 25, role: 'Admin' },
  { id: 'u20', name: 'Tina Fey', avatar: 'https://i.pravatar.cc/150?u=u20', xp: 930, league: 'Silver', streakDays: 6, role: 'Staff' },
  { id: 'u21', name: 'Uma Thurman', avatar: 'https://i.pravatar.cc/150?u=u21', xp: 1180, league: 'Gold', streakDays: 9, role: 'Staff' },
  { id: 'u22', name: 'Vince Vaughn', avatar: 'https://i.pravatar.cc/150?u=u22', xp: 350, league: 'Bronze', streakDays: 1, role: 'Staff' },
  { id: 'u23', name: 'Wanda Maximoff', avatar: 'https://i.pravatar.cc/150?u=u23', xp: 1420, league: 'Gold', streakDays: 18, role: 'Staff' },
  { id: 'u24', name: 'Xavier Woods', avatar: 'https://i.pravatar.cc/150?u=u24', xp: 810, league: 'Silver', streakDays: 4, role: 'Staff' },
  { id: 'u25', name: 'Yara Shahidi', avatar: 'https://i.pravatar.cc/150?u=u25', xp: 690, league: 'Silver', streakDays: 3, role: 'Staff' },
] as const;

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
    monthlyQuota: 10,
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
    apiKey: '', 
    model: 'gemini-3-flash-preview',
    endpoint: ''
  }
};

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
    core_values TEXT NOT NULL, 
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
    month_year TEXT NOT NULL, 
    shoutouts_given INTEGER DEFAULT 0,
    quota_limit INTEGER,
    last_reset DATE
);

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
  entry_count INT, 
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
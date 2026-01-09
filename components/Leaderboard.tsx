
import React, { useState } from 'react';
import { User, Shoutout, CoreValue } from '../types';
import DuoButton from './DuoButton';
import { CORE_VALUE_COLORS } from '../constants';
import { useTheme } from '../context/ThemeContext';

interface LeaderboardProps {
    users: readonly User[];
    shoutouts: readonly Shoutout[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, shoutouts }) => {
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const { currentTheme } = useTheme();
    
    // Sort users by XP descending and limit to top 5
    const sortedUsers = [...users].sort((a, b) => b.xp - a.xp).slice(0, 5);

    const getStatsForUser = (userId: string) => {
        const received = shoutouts.filter(s => s.recipientIds.includes(userId));
        const valueCounts: Record<string, number> = {
            [CoreValue.BRAVELY_SPEAK]: 0,
            [CoreValue.WE_BEFORE_ME]: 0,
            [CoreValue.HUNGRY_TO_LEARN]: 0,
            [CoreValue.PURSUIT_OF_EXCELLENCE]: 0
        };

        received.forEach(s => {
            s.coreValues.forEach(v => {
                if (valueCounts[v] !== undefined) valueCounts[v]++;
            });
        });

        const totalValueTags = Object.values(valueCounts).reduce((a, b) => a + b, 0);

        return {
            received,
            valueCounts,
            totalValueTags,
            recent: received.sort((a, b) => b.timestamp - a.timestamp).slice(0, 3)
        };
    };

    const viewingUserStats = viewingUser ? getStatsForUser(viewingUser.id) : null;

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-4 md:p-0 animate-pop relative">
            
            {/* User Detail Modal */}
            {viewingUser && viewingUserStats && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewingUser(null)}></div>
                    <div className="bg-surface w-full max-w-md rounded-theme p-6 relative animate-pop shadow-2xl border-b-[8px] border-borderMain">
                        <div className="absolute -top-12 left-0 right-0 flex justify-center">
                            <img src={viewingUser.avatar} className="w-24 h-24 rounded-full border-4 border-surface shadow-md" alt={viewingUser.name} />
                        </div>
                        
                        <div className="mt-10 text-center mb-6">
                            <h2 className="text-2xl font-black text-textMain leading-none">{viewingUser.name}</h2>
                            <span className="text-xs font-bold text-textMuted uppercase tracking-widest">{viewingUser.league} League • {viewingUser.role}</span>
                        </div>

                        {/* Value Breakdown */}
                        <div className="space-y-3 mb-6">
                            <h4 className="text-xs font-black text-textMuted uppercase">Value Breakdown</h4>
                            {Object.values(CoreValue).map(val => {
                                const count = viewingUserStats.valueCounts[val];
                                const pct = viewingUserStats.totalValueTags > 0 
                                    ? (count / viewingUserStats.totalValueTags) * 100 
                                    : 0;
                                
                                return (
                                    <div key={val} className="space-y-1">
                                        <div className="flex justify-between text-xs font-bold text-textMain">
                                            <span>{val}</span>
                                            <span>{count}</span>
                                        </div>
                                        <div className="h-3 w-full bg-borderMain/30 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${CORE_VALUE_COLORS[val].split(' ')[0]}`} 
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Recent Shoutouts */}
                        <div className="space-y-3 mb-6">
                            <h4 className="text-xs font-black text-textMuted uppercase">Recent Shout-outs</h4>
                            {viewingUserStats.recent.length === 0 ? (
                                <p className="text-sm text-textMuted italic text-center py-4">No shout-outs received yet.</p>
                            ) : (
                                viewingUserStats.recent.map(shout => {
                                    const giver = users.find(u => u.id === shout.fromUserId);
                                    return (
                                        <div key={shout.id} className="bg-background p-3 rounded-theme-sm border border-borderMain text-sm">
                                            <div className="flex items-center gap-2 mb-1">
                                                <img src={giver?.avatar} className="w-4 h-4 rounded-full" alt="" />
                                                <span className="text-[10px] font-black text-textMuted uppercase">From: {giver?.name || 'Unknown'}</span>
                                            </div>
                                            <p className="text-textMain font-medium italic">"{shout.message}"</p>
                                            <div className="mt-2 flex gap-1">
                                                {shout.coreValues.map(v => (
                                                    <span key={v} className="text-[10px] font-bold bg-surface border border-borderMain px-2 rounded-theme-sm text-textMuted">
                                                        {v}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Ranking Trend Mock */}
                        <div className="bg-primary/10 p-3 rounded-theme-sm flex items-center gap-3 text-primaryDark font-bold text-sm mb-6">
                            <span className="text-xl">{currentTheme.icons.nav.analytics}</span>
                            <span>Trending up! Moved up 2 spots this week.</span>
                        </div>

                        <DuoButton fullWidth variant="secondary" onClick={() => setViewingUser(null)}>
                            {currentTheme.icons.ui.close} CLOSE
                        </DuoButton>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="bg-surface rounded-theme border-theme border-borderMain overflow-hidden shadow-sm">
                <div className="p-4 bg-background border-b-theme border-borderMain flex justify-between items-center">
                    <h3 className="font-black text-textMuted uppercase tracking-widest text-sm">Top 5 Leaders</h3>
                    <span className="bg-accent/20 text-accentDark px-3 py-1 rounded-theme-sm text-xs font-bold border border-accent/30">
                        {currentTheme.icons.gamification.trophy} Elite Tier
                    </span>
                </div>
                
                <div className="divide-y-2 divide-borderMain">
                    {sortedUsers.map((user, index) => (
                        <div 
                            key={user.id} 
                            onClick={() => setViewingUser(user)}
                            className="p-4 flex items-center gap-4 hover:bg-secondary/5 transition-colors cursor-pointer group"
                        >
                            <div className={`font-black text-xl w-8 text-center ${
                                index === 0 ? 'text-accent text-2xl drop-shadow-sm' : 
                                index === 1 ? 'text-textMuted' : 
                                index === 2 ? 'text-danger' : 'text-borderMain'
                            }`}>
                                {index + 1}
                            </div>
                            
                            <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-borderMain group-hover:scale-110 transition-transform" alt={user.name} />
                            
                            <div className="flex-1">
                                <h4 className="font-bold text-textMain group-hover:text-secondary transition-colors">{user.name}</h4>
                                <div className="text-xs text-textMuted font-bold">{user.xp} {currentTheme.icons.gamification.xp}</div>
                            </div>
                            
                            {/* Visual XP Bar for effect */}
                            <div className="hidden md:block w-24 h-2 bg-borderMain/30 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary" 
                                    style={{ width: `${(user.xp / Math.max(...users.map(u => u.xp))) * 100}%` }}
                                ></div>
                            </div>

                            <div className="text-borderMain text-lg group-hover:translate-x-1 transition-transform">
                                ➜
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-secondary rounded-theme p-6 text-white text-center border-b-[6px] border-secondaryDark shadow-theme">
                <h3 className="font-bold text-xl mb-2">Promotions in 2 Days</h3>
                <p className="opacity-90 text-sm">Top 3 players advance to the Diamond League!</p>
            </div>
        </div>
    );
};

export default Leaderboard;

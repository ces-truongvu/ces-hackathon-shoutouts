
import React, { useState } from 'react';
import { User, Shoutout, CoreValue } from '../types';
import DuoButton from './DuoButton';
import { CORE_VALUE_COLORS } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { THEMES } from '../theme';

interface ProfileProps {
  currentUser: User;
  users: readonly User[];
  shoutouts: readonly Shoutout[];
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, users, shoutouts, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'received' | 'given' | 'themes'>('received');
  const { currentTheme, setTheme } = useTheme();

  const received = shoutouts.filter(s => s.recipientIds.includes(currentUser.id));
  const given = shoutouts.filter(s => s.fromUserId === currentUser.id);

  const displayedShoutouts = activeTab === 'received' ? received : given;

  // Helper to format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-pop">
      {/* User Card */}
      <div className="bg-surface rounded-theme border-theme border-borderMain overflow-hidden text-center p-8 relative shadow-theme">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-borderMain relative">
             <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-black text-textMain">{currentUser.name}</h2>
        <p className="text-xs font-bold text-textMuted uppercase tracking-widest mt-1 mb-6">{currentUser.role} • {currentUser.league} League</p>
        
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-8">
            <div className="bg-background p-3 rounded-theme border-theme border-borderMain">
                <div className="text-2xl font-black text-primary">{currentUser.xp}</div>
                <div className="text-[10px] font-bold text-textMain opacity-75 uppercase">Total {currentTheme.icons.gamification.xp}</div>
            </div>
            <div className="bg-background p-3 rounded-theme border-theme border-borderMain">
                <div className="text-2xl font-black text-accent">{currentUser.streakDays}</div>
                <div className="text-[10px] font-bold text-textMain uppercase">Day Streak</div>
            </div>
        </div>

        <DuoButton variant="danger" onClick={onLogout} className="mx-auto text-sm px-6 py-2">{currentTheme.icons.nav.logout} LOG OUT</DuoButton>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-borderMain/30 rounded-theme mb-6 border-theme border-borderMain">
          <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-3 rounded-theme-sm text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'received' ? 'bg-surface text-secondary shadow-sm transform scale-100' : 'text-textMuted hover:text-textMain'}`}
          >
              Received
          </button>
          <button
              onClick={() => setActiveTab('given')}
              className={`flex-1 py-3 rounded-theme-sm text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'given' ? 'bg-surface text-secondary shadow-sm transform scale-100' : 'text-textMuted hover:text-textMain'}`}
          >
              Given
          </button>
          <button
              onClick={() => setActiveTab('themes')}
              className={`flex-1 py-3 rounded-theme-sm text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'themes' ? 'bg-surface text-secondary shadow-sm transform scale-100' : 'text-textMuted hover:text-textMain'}`}
          >
              🎨 Themes
          </button>
      </div>

      {/* Theme Selection Panel */}
      {activeTab === 'themes' && (
        <div className="bg-surface p-6 rounded-theme border-theme border-borderMain animate-pop shadow-theme">
            <h3 className="text-lg font-black text-textMain mb-2">Game Cartridges</h3>
            <p className="text-sm text-textMuted mb-6">Insert a cartridge to transform your world.</p>
            
            <div className="grid grid-cols-1 gap-4">
                {Object.values(THEMES).map(theme => (
                    <button
                        key={theme.id}
                        onClick={() => setTheme(theme.id)}
                        className={`
                            relative p-4 rounded-theme border-theme text-left transition-all hover:scale-105 active:scale-95 group overflow-hidden
                            ${currentTheme.id === theme.id ? 'border-primary bg-primary/10' : 'border-borderMain bg-background'}
                        `}
                        style={{ fontFamily: theme.font }}
                    >
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <div>
                                <span className={`text-lg font-black block ${currentTheme.id === theme.id ? 'text-primary' : 'text-textMain'}`}>
                                    {theme.name}
                                </span>
                                <span className="text-xs text-textMuted opacity-80">{theme.description}</span>
                            </div>
                            {currentTheme.id === theme.id && (
                                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm border-2 border-primaryDark">
                                    {currentTheme.icons.ui.check}
                                </span>
                            )}
                        </div>
                        
                        {/* Theme Preview Swatches */}
                        <div className="flex gap-2 relative z-10 mt-3">
                            <div className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm" style={{ backgroundColor: theme.colors.primary }}></div>
                            <div className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm" style={{ backgroundColor: theme.colors.secondary }}></div>
                            <div className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm" style={{ backgroundColor: theme.colors.background }}></div>
                             <div className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm flex items-center justify-center bg-gray-100 text-black text-xs font-bold" style={{ fontFamily: theme.font }}>
                                Aa
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
      )}

      {/* History Section */}
      {activeTab !== 'themes' && (
        <div className="space-y-4">
            {displayedShoutouts.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                    <div className="text-4xl mb-2">{currentTheme.icons.ui.empty}</div>
                    <p className="font-bold text-textMuted">No shout-outs found.</p>
                </div>
            ) : (
                displayedShoutouts.sort((a,b) => b.timestamp - a.timestamp).map(shout => {
                    let otherUserNames = '';
                    let label = '';
                    
                    if (activeTab === 'received') {
                         const from = users.find(u => u.id === shout.fromUserId);
                         otherUserNames = from?.name || 'Unknown';
                         label = 'From';
                    } else {
                         const recipients = shout.recipientIds.map(id => users.find(u => u.id === id)).filter(Boolean);
                         otherUserNames = recipients.map(u => u?.name).join(', ');
                         label = 'To';
                    }

                    return (
                        <div key={shout.id} className="bg-background border border-borderMain rounded-theme-sm p-4 hover:bg-surface hover:border-textMuted transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-xs font-bold text-textMuted">{formatDate(shout.timestamp)}</div>
                                <div className="flex gap-1">
                                    {shout.coreValues.map(v => (
                                        <div key={v} className={`w-2 h-2 rounded-full ${CORE_VALUE_COLORS[v].split(' ')[0]}`} title={v} />
                                    ))}
                                </div>
                            </div>
                            <div className="text-sm font-bold text-textMuted mb-1">
                                {label}: <span className="text-textMain">{otherUserNames}</span>
                            </div>
                            <p className="text-textMain text-sm">"{shout.message}"</p>
                        </div>
                    );
                })
            )}
        </div>
      )}
    </div>
  );
};

export default Profile;

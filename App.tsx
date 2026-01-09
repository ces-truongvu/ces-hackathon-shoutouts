import React, { useState } from 'react';
import DuoButton from './components/DuoButton';
import StreakFire from './components/StreakFire';
import RecognitionWizard from './components/RecognitionWizard';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import RewardsPanel from './components/RewardsPanel';
import ReportsDashboard from './components/ReportsDashboard';
import Profile from './components/Profile';
import PresentationMode from './components/PresentationMode';
import FeedHistory from './components/FeedHistory';
import { MOCK_USERS, DEFAULT_CONFIG } from './constants';
import { User, Shoutout, CoreValue, AppConfig } from './types';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Mock DB Initial State 
const INITIAL_SHOUTOUTS: Shoutout[] = [
  { 
    id: 's1', 
    fromUserId: 'u2', 
    recipientIds: ['u1'], 
    message: "Helped me debug the production issue late at night. You are a lifesaver!", 
    coreValues: [CoreValue.WE_BEFORE_ME], 
    timestamp: Date.now() - 86400000,
    reactions: 5,
    status: 'pending' 
  },
  { 
    id: 's2', 
    fromUserId: 'u1', 
    recipientIds: ['u4'], 
    message: "Great job presenting the quarterly review! Very clear and concise.", 
    coreValues: [CoreValue.BRAVELY_SPEAK], 
    timestamp: Date.now() - 172800000,
    reactions: 2,
    status: 'pending'
  },
  { 
    id: 's_bw1', 
    fromUserId: 'u7', 
    recipientIds: ['u25'], 
    message: "Yara handled the client crisis with absolute grace. She stayed calm, identified the root cause, and saved the contract.", 
    coreValues: [CoreValue.PURSUIT_OF_EXCELLENCE], 
    timestamp: Date.now() - 43200000,
    reactions: 15,
    status: 'announced' 
  },
  { 
    id: 's_op1', 
    fromUserId: 'u24', 
    recipientIds: ['u23'], 
    message: "Wanda led the warehouse reorganization project perfectly. We finished 2 days early!", 
    coreValues: [CoreValue.WE_BEFORE_ME, CoreValue.PURSUIT_OF_EXCELLENCE], 
    timestamp: Date.now() - 129600000,
    reactions: 10,
    status: 'announced' 
  },
  { 
    id: 's_im1', 
    fromUserId: 'u25', 
    recipientIds: ['u22'], 
    message: "Vince spent his weekend refactoring the legacy API. The latency dropped by 40%!", 
    coreValues: [CoreValue.HUNGRY_TO_LEARN], 
    timestamp: Date.now() - 216000000,
    reactions: 20,
    status: 'announced' 
  },
  { 
    id: 's_sj1', 
    fromUserId: 'u1', 
    recipientIds: ['u19'], 
    message: "Steve's feedback on the UI design was brutal but honest. It made the final product 10x better.", 
    coreValues: [CoreValue.BRAVELY_SPEAK], 
    timestamp: Date.now() - 302400000,
    reactions: 7,
    status: 'announced' 
  },
  { 
    id: 's_gr1', 
    fromUserId: 'u2', 
    recipientIds: ['u21'], 
    message: "Uma took on the extra tickets while the rest of the team was in training. Huge help!", 
    coreValues: [CoreValue.WE_BEFORE_ME], 
    timestamp: Date.now() - 388800000,
    reactions: 4,
    status: 'announced' 
  },
  { 
    id: 's_gb1', 
    fromUserId: 'u11', 
    recipientIds: ['u7'], 
    message: "George shared his expertise on the tax filing process during the lunch-and-learn. Very insightful!", 
    coreValues: [CoreValue.HUNGRY_TO_LEARN], 
    timestamp: Date.now() - 475200000,
    reactions: 9,
    status: 'announced' 
  },
  { 
    id: 's_er1', 
    fromUserId: 'u4', 
    recipientIds: ['u18'], 
    message: "Riley didn't hesitate to point out the safety risks in the new lab protocol. Safety first!", 
    coreValues: [CoreValue.BRAVELY_SPEAK], 
    timestamp: Date.now() - 561600000,
    reactions: 12,
    status: 'announced' 
  },
  { 
    id: 's_hg1', 
    fromUserId: 'u1', 
    recipientIds: ['u17'], 
    message: "Quentin's documentation for the new onboarding flow is a masterpiece of clarity.", 
    coreValues: [CoreValue.PURSUIT_OF_EXCELLENCE], 
    timestamp: Date.now() - 648000000,
    reactions: 18,
    status: 'announced' 
  },
  { 
    id: 's_wm1', 
    fromUserId: 'u25', 
    recipientIds: ['u23'], 
    message: "Wanda solved the weird intermittent bug in the CSS that had been bugging us for weeks!", 
    coreValues: [CoreValue.HUNGRY_TO_LEARN, CoreValue.PURSUIT_OF_EXCELLENCE], 
    timestamp: Date.now() - 734400000,
    reactions: 11,
    status: 'announced' 
  },
  { 
    id: 's3', 
    fromUserId: 'u3', 
    recipientIds: ['u1'], 
    message: "Thanks for the mentoring session. I finally understand the architectural layers.", 
    coreValues: [CoreValue.HUNGRY_TO_LEARN], 
    timestamp: Date.now() - 820800000,
    reactions: 8,
    status: 'announced' 
  },
  {
      id: 's4',
      fromUserId: 'u2',
      recipientIds: ['u3'],
      message: "Always cleaning up the common area without being asked. True team player!",
      coreValues: [CoreValue.WE_BEFORE_ME],
      timestamp: Date.now() - 907200000,
      reactions: 12,
      status: 'announced'
  }
];

type View = 'feed' | 'leaderboard' | 'profile' | 'admin' | 'rewards' | 'analytics' | 'history';

const AppContent: React.FC = () => {
  // State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('feed');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [shoutouts, setShoutouts] = useState<Shoutout[]>(INITIAL_SHOUTOUTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS as unknown as User[]);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const { currentTheme } = useTheme();

  const handleLogin = (username: string, role: 'Admin' | 'Staff') => {
    if (role === 'Admin') {
      const adminUser = users.find(u => u.role === 'Admin') || users[0];
      setCurrentUser(adminUser);
    } else {
      const staffUser = users.find(u => u.role === 'Staff') || users[1];
      setCurrentUser(staffUser);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('feed');
    setIsWizardOpen(false);
    setIsPresentationMode(false);
  };

  const handleShoutoutComplete = (xpEarned: number, recipientIds: string[], message: string, coreValues: CoreValue[]) => {
    if (!currentUser) return;

    // Mock updating backend
    const updatedUser = { ...currentUser, xp: currentUser.xp + xpEarned, streakDays: currentUser.streakDays + 1 };
    
    // Update users list locally
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser); 
    
    // Create new shoutout
    const newShoutout: Shoutout = {
        id: `s${Date.now()}`,
        fromUserId: currentUser.id,
        recipientIds: recipientIds,
        message: message,
        coreValues: coreValues,
        timestamp: Date.now(),
        reactions: 0,
        status: 'pending' // Default to pending
    };
    
    setShoutouts(prev => [newShoutout, ...prev]);

    // Close wizard after delay
    setTimeout(() => {
        setIsWizardOpen(false);
    }, 2500);
  };

  const handleMarkAnnounced = (id: string) => {
    setShoutouts(prev => prev.map(s => s.id === id ? { ...s, status: 'announced' } : s));
  };

  const handleConfigSave = (newConfig: AppConfig) => {
    setConfig(newConfig);
  };

  // Calculate Budget
  const shoutoutsThisMonth = shoutouts.filter(s => {
    if (!currentUser) return false;
    return s.fromUserId === currentUser.id; 
  }).length;

  const isOverQuota = shoutoutsThisMonth >= config.budget.monthlyQuota;

  // Derived Shoutout Lists
  const pendingShoutouts = shoutouts.filter(s => s.status === 'pending');
  const historyShoutouts = shoutouts.filter(s => s.status === 'announced').sort((a,b) => b.timestamp - a.timestamp);

  const NavButton = ({ view, label, icon }: { view: View, label: string, icon: string }) => (
    <button 
        onClick={() => setCurrentView(view)}
        className={`
            flex items-center gap-3 p-3 rounded-theme font-bold uppercase text-sm border-theme border-transparent transition-all w-full
            ${currentView === view 
                ? 'bg-secondary/10 text-secondary border-secondary/20' 
                : 'text-textMuted hover:bg-borderMain/20 hover:border-borderMain'}
        `}
    >
        <span className="text-xl">{icon}</span> <span className="hidden md:inline">{label}</span>
    </button>
  );

  const getCoreValueColor = (val: CoreValue) => {
    switch(val) {
        case CoreValue.BRAVELY_SPEAK: return 'bg-val1';
        case CoreValue.WE_BEFORE_ME: return 'bg-val2';
        case CoreValue.HUNGRY_TO_LEARN: return 'bg-val3';
        case CoreValue.PURSUIT_OF_EXCELLENCE: return 'bg-val4';
        default: return 'bg-textMuted';
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row max-w-7xl mx-auto border-x-theme border-borderMain shadow-theme my-0 md:my-4 rounded-theme overflow-hidden text-textMain transition-all duration-300 font-sans">
      
      {/* Presentation Mode Overlay */}
      {isPresentationMode && currentUser.role === 'Admin' && (
          <PresentationMode 
            shoutouts={pendingShoutouts} 
            users={users} 
            onClose={() => setIsPresentationMode(false)}
            onMarkAnnounced={handleMarkAnnounced}
          />
      )}

      {/* Sidebar / Mobile Nav */}
      <nav className="w-full md:w-64 bg-surface border-b-theme md:border-b-0 md:border-r-theme border-borderMain p-4 md:p-6 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-stretch z-10 transition-colors duration-300">
        <h1 className="text-2xl font-black text-primary tracking-tighter mb-0 md:mb-8 cursor-pointer hidden md:block drop-shadow-sm" onClick={() => setCurrentView('feed')}>
            EOS<span className="text-secondary">SHOUT</span>
        </h1>
        <div className="md:hidden font-black text-primary text-xl">EOS</div>
        
        <div className="flex md:flex-col gap-2 md:gap-4 flex-1 justify-center md:justify-start">
            <NavButton view="feed" label="Feed" icon={currentTheme.icons.nav.home} />
            <NavButton view="leaderboard" label="Leaderboard" icon={currentTheme.icons.nav.leaderboard} />
            <NavButton view="profile" label="Profile" icon={currentTheme.icons.nav.profile} />
            {currentUser.role === 'Admin' && (
                <div className="mt-4 pt-4 md:border-t-theme border-borderMain space-y-2">
                    <NavButton view="analytics" label="Analytics" icon={currentTheme.icons.nav.analytics} />
                    <NavButton view="rewards" label="Rewards" icon={currentTheme.icons.nav.rewards} />
                    <NavButton view="admin" label="Settings" icon={currentTheme.icons.nav.settings} />
                </div>
            )}
        </div>

        <div className="hidden md:block mt-auto pt-4 border-t-theme border-borderMain">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 p-3 rounded-theme font-bold uppercase text-sm text-textMuted hover:bg-danger/10 hover:text-danger transition-all"
           >
             <span>{currentTheme.icons.nav.logout}</span> Log Out
           </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-screen md:h-auto bg-background" style={{ backgroundImage: 'var(--bg-pattern)' }}>
        
        {/* Top Header */}
        <header className="h-20 border-b-theme border-borderMain flex items-center justify-between px-6 bg-surface sticky top-0 z-20 shrink-0 transition-colors duration-300">
           <div className="flex flex-col">
             <div className="font-black text-textMain uppercase tracking-widest text-xs">
               Your League: <span className="text-textMain font-black text-sm">{currentUser.league}</span>
             </div>
             {currentUser.role === 'Admin' && (
               <span className="text-[10px] font-bold bg-textMain text-surface px-2 py-0.5 rounded-full w-fit">ADMIN</span>
             )}
           </div>
           
           <div className="flex items-center gap-4">
             <StreakFire days={currentUser.streakDays} active={config.gamification.streaksEnabled} />
             <div className="flex items-center gap-2 group relative cursor-pointer" onClick={handleLogout}>
                <img src={currentUser.avatar} alt="Me" className="w-10 h-10 rounded-full border-2 border-borderMain" />
                <div className="md:hidden absolute top-12 right-0 bg-surface shadow-theme border-theme border-borderMain p-2 rounded-theme text-xs font-bold text-danger opacity-0 group-hover:opacity-100 pointer-events-none">
                  Tap to Logout
                </div>
             </div>
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            
            {isWizardOpen ? (
                <div className="h-full max-w-2xl mx-auto bg-surface rounded-theme p-6 md:p-8 border-theme border-borderMain shadow-theme overflow-hidden">
                    <RecognitionWizard 
                        users={users} 
                        currentUser={currentUser}
                        config={config}
                        shoutoutCount={shoutoutsThisMonth}
                        onComplete={handleShoutoutComplete}
                        onCancel={() => setIsWizardOpen(false)}
                    />
                </div>
            ) : (
                <>
                    {currentView === 'feed' && (
                        <div className="max-w-2xl mx-auto space-y-8">
                            
                            {/* Admin Presentation Trigger */}
                            {currentUser.role === 'Admin' && pendingShoutouts.length > 0 && (
                                <div className="bg-textMain text-surface p-4 rounded-theme flex items-center justify-between shadow-theme transform hover:-translate-y-1 transition-transform border-b-[6px] border-black/20">
                                    <div>
                                        <h3 className="font-black text-lg">📢 FRIDAY MEETING MODE</h3>
                                        <p className="text-sm opacity-80">{pendingShoutouts.length} Pending Shout-outs</p>
                                    </div>
                                    <DuoButton onClick={() => setIsPresentationMode(true)} variant="secondary">
                                        START ▶
                                    </DuoButton>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="bg-surface rounded-theme p-6 border-theme border-borderMain flex flex-col items-center text-center space-y-4 shadow-sm">
                                <div className="text-5xl animate-bounce-short">{currentTheme.icons.ui.hello}</div>
                                <h2 className="text-xl font-bold text-textMain">Hi, {currentUser.name.split(' ')[0]}!</h2>
                                <p className="text-textMuted">Recognize a teammate to earn {currentTheme.icons.gamification.xp} and climb the leaderboard.</p>
                                
                                {isOverQuota && config.budget.enforcementMode === 'hard_stop' ? (
                                    <div className="bg-borderMain/20 p-4 rounded-theme w-full border-theme border-borderMain text-textMuted font-bold text-sm">
                                        Monthly Quota Reached ({config.budget.monthlyQuota}/{config.budget.monthlyQuota}) <br/>
                                        Come back next month!
                                    </div>
                                ) : (
                                    <DuoButton fullWidth onClick={() => setIsWizardOpen(true)}>
                                        GIVE SHOUT-OUT
                                    </DuoButton>
                                )}
                                
                                <div className="text-xs font-bold text-textMuted uppercase tracking-widest mt-2">
                                    Budget: {shoutoutsThisMonth} / {config.budget.monthlyQuota} Used
                                </div>
                            </div>

                            {/* Pending/Active Feed Items */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-textMuted uppercase tracking-widest text-sm pl-2">
                                    {pendingShoutouts.length > 0 ? "🆕 New & Pending" : "🎉 All caught up!"}
                                </h3>
                                
                                {pendingShoutouts.map(shout => {
                                    const from = users.find(u => u.id === shout.fromUserId);
                                    const recipients = shout.recipientIds.map(id => users.find(u => u.id === id)).filter(Boolean);
                                    
                                    if (!from || recipients.length === 0) return null;

                                    return (
                                        <div key={shout.id} className="bg-surface rounded-theme border-theme border-borderMain p-4 relative group hover:border-secondary transition-colors shadow-sm">
                                            {/* Admin Quick Action */}
                                            {currentUser.role === 'Admin' && (
                                                <button 
                                                    onClick={() => handleMarkAnnounced(shout.id)}
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-background hover:bg-primary/20 text-textMuted hover:text-primary p-1 rounded-theme text-xs font-bold transition-all"
                                                    title="Mark as Announced"
                                                >
                                                    {currentTheme.icons.ui.check} Mark Read
                                                </button>
                                            )}

                                            <div className="flex items-center gap-3 mb-3">
                                                <img src={from.avatar} className="w-10 h-10 rounded-full border-theme border-borderMain" alt={from.name} />
                                                <div className="text-sm">
                                                    <span className="font-bold text-textMain">{from.name}</span>
                                                    <span className="text-textMuted mx-1">➜</span>
                                                    <div className="inline-flex gap-1 flex-wrap">
                                                        {recipients.map((r, idx) => (
                                                            <span key={r?.id} className="font-bold text-textMain bg-background px-1 rounded-theme-sm border border-borderMain">
                                                                {r?.name}{idx < recipients.length - 1 ? ',' : ''}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-textMain text-lg font-medium mb-4 leading-relaxed font-sans">
                                                "{shout.message}"
                                            </p>
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                <div className="flex flex-wrap gap-2">
                                                    {shout.coreValues.map((val) => (
                                                        <span key={val} className={`text-xs font-bold uppercase px-3 py-1 rounded-theme-sm text-white shadow-sm ${getCoreValueColor(val)}`}>
                                                            {val}
                                                        </span>
                                                    ))}
                                                </div>
                                                <button className="flex items-center gap-1 text-textMuted font-bold hover:text-secondary transition-colors self-end sm:self-auto">
                                                    <span>{currentTheme.icons.ui.clap}</span> {shout.reactions}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Link to History Archive */}
                             <div className="mt-6 pt-6 border-t-theme border-borderMain">
                                <DuoButton 
                                    variant="ghost" 
                                    fullWidth 
                                    onClick={() => setCurrentView('history')}
                                    className="text-textMuted hover:text-secondary border-theme border-borderMain bg-background hover:bg-surface"
                                >
                                    {currentTheme.icons.ui.empty} View History Archive ({historyShoutouts.length}) ➜
                                </DuoButton>
                            </div>

                        </div>
                    )}

                    {currentView === 'history' && (
                        <div className="max-w-2xl mx-auto space-y-4 animate-pop">
                            <div className="flex items-center gap-2 mb-4 bg-background/90 backdrop-blur-sm sticky top-0 p-2 z-10 border-b-theme border-borderMain rounded-b-theme">
                                <DuoButton variant="ghost" onClick={() => setCurrentView('feed')} className="!p-2 mr-2 bg-surface !border-borderMain">
                                    {currentTheme.icons.ui.back} Back
                                </DuoButton>
                                <h2 className="text-xl font-black text-textMain">History Archive</h2>
                                <span className="bg-borderMain text-textMuted text-xs font-bold px-2 py-0.5 rounded-full">{historyShoutouts.length}</span>
                            </div>
                            <FeedHistory shoutouts={historyShoutouts} users={users} />
                        </div>
                    )}

                    {currentView === 'leaderboard' && (
                        <Leaderboard users={users} shoutouts={shoutouts} />
                    )}

                    {currentView === 'profile' && (
                        <Profile 
                            currentUser={currentUser} 
                            users={users} 
                            shoutouts={shoutouts} 
                            onLogout={handleLogout} 
                        />
                    )}

                    {currentView === 'analytics' && currentUser.role === 'Admin' && (
                        <div className="h-full animate-pop">
                             <ReportsDashboard users={users} realShoutouts={shoutouts} />
                        </div>
                    )}

                    {currentView === 'rewards' && currentUser.role === 'Admin' && (
                        <RewardsPanel config={config} users={users} shoutouts={shoutouts} onSave={handleConfigSave} />
                    )}

                    {currentView === 'admin' && currentUser.role === 'Admin' && (
                        <AdminPanel config={config} users={users} shoutouts={shoutouts} onSave={handleConfigSave} />
                    )}
                </>
            )}
        </div>
      </main>
    </div>
  );
};

// Wrapper App to provide context
const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;
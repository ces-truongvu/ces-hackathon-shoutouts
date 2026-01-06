
import React, { useState } from 'react';
import { AppConfig, Gift, User, Shoutout } from '../types';
import DuoButton from './DuoButton';
import { useTheme } from '../context/ThemeContext';

interface RewardsPanelProps {
  config: AppConfig;
  users: readonly User[];
  shoutouts: readonly Shoutout[];
  onSave: (newConfig: AppConfig) => void;
}

type RewardsTab = 'catalog' | 'draw';

const RewardsPanel: React.FC<RewardsPanelProps> = ({ config, users, shoutouts, onSave }) => {
  const [activeTab, setActiveTab] = useState<RewardsTab>('catalog');
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);
  const [dirty, setDirty] = useState(false);
  const [drawAnimationState, setDrawAnimationState] = useState<'idle' | 'rolling' | 'winner'>('idle');
  const [simulatedWinner, setSimulatedWinner] = useState<{user: User, gift: Gift} | null>(null);
  const { currentTheme } = useTheme();

  // New State for Add Gift Modal
  const [isAddGiftOpen, setIsAddGiftOpen] = useState(false);
  const [draftGift, setDraftGift] = useState<Omit<Gift, 'id'>>({
      name: '',
      description: '',
      imageUrl: '',
      pointCost: 0,
      maxQuantity: 1,
      drawEligible: true
  });

  const updateConfig = <K extends keyof AppConfig>(section: K, updates: Partial<AppConfig[K]>) => {
    setLocalConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    setDirty(true);
  };

  const handleSave = () => {
    onSave(localConfig);
    setDirty(false);
    alert('Rewards configuration saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to discard unsaved changes?')) {
      setLocalConfig(config);
      setDirty(false);
    }
  };

  const openAddGiftModal = () => {
      setDraftGift({
          name: '',
          description: '',
          imageUrl: '',
          pointCost: 0,
          maxQuantity: 1,
          drawEligible: true
      });
      setIsAddGiftOpen(true);
  };

  const handleSaveNewGift = () => {
      if (!draftGift.name) {
          alert("Gift Name is required.");
          return;
      }

      const newGift: Gift = {
          id: `g${Date.now()}`,
          name: draftGift.name,
          description: draftGift.description || '',
          imageUrl: draftGift.imageUrl || 'https://via.placeholder.com/150',
          pointCost: draftGift.pointCost || 0,
          maxQuantity: draftGift.maxQuantity || 0,
          drawEligible: draftGift.drawEligible
      };

      updateConfig('rewards', { gifts: [...localConfig.rewards.gifts, newGift] });
      setIsAddGiftOpen(false);
  };

  const updateGift = (id: string, updates: Partial<Gift>) => {
    const newGifts = localConfig.rewards.gifts.map(g => g.id === id ? { ...g, ...updates } : g);
    updateConfig('rewards', { gifts: newGifts });
  };

  const removeGift = (id: string) => {
    if (confirm('Delete this gift?')) {
        updateConfig('rewards', { gifts: localConfig.rewards.gifts.filter(g => g.id !== id) });
    }
  };

  const calculateEntries = () => {
      // Logic: 1 entry per shoutout received
      const entryMap: Record<string, number> = {};
      shoutouts.forEach(s => {
          s.recipientIds.forEach(uid => {
             entryMap[uid] = (entryMap[uid] || 0) + 1;
          });
      });
      return entryMap;
  };

  const runDrawSimulation = () => {
    setDrawAnimationState('rolling');
    setSimulatedWinner(null);

    const entries = calculateEntries();
    // Build pool
    const pool: string[] = [];
    Object.entries(entries).forEach(([uid, count]) => {
        for(let i=0; i<count; i++) pool.push(uid);
    });

    if (pool.length === 0) {
        alert("No entries found! Generate some shoutouts first.");
        setDrawAnimationState('idle');
        return;
    }

    // Filter eligible gifts
    const eligibleGifts = localConfig.rewards.gifts.filter(g => g.drawEligible && g.maxQuantity > 0);
    if (eligibleGifts.length === 0) {
        alert("No eligible gifts configured!");
        setDrawAnimationState('idle');
        return;
    }

    setTimeout(() => {
        const winnerId = pool[Math.floor(Math.random() * pool.length)];
        const gift = eligibleGifts[Math.floor(Math.random() * eligibleGifts.length)];
        const winner = users.find(u => u.id === winnerId);
        
        if (winner && gift) {
            setSimulatedWinner({ user: winner, gift });
            setDrawAnimationState('winner');
            
            // In a real app, this would persist to the 'draw_results' table
            updateConfig('rewards', { 
                lastDrawResult: {
                    id: `dr${Date.now()}`,
                    winnerId: winner.id,
                    giftId: gift.id,
                    drawDate: Date.now()
                }
            });
        } else {
            setDrawAnimationState('idle');
        }
    }, 2000);
  };

  const entries = calculateEntries();

  return (
    <div className="max-w-4xl mx-auto bg-surface rounded-theme border-theme border-borderMain overflow-hidden shadow-theme animate-pop h-full flex flex-col relative">
      {/* Header */}
      <div className="bg-surface p-6 pb-4 border-b-theme border-borderMain flex justify-between items-end">
        <div>
            <div className="text-xs font-black text-textMuted uppercase tracking-widest mb-1">Admin Console</div>
            <h2 className="text-3xl font-black text-textMain flex items-center gap-2">
                {currentTheme.icons.nav.rewards} Rewards
            </h2>
        </div>
        <div className="flex gap-2">
            <DuoButton variant="ghost" onClick={handleReset} disabled={!dirty} className="!text-xs !py-2 !px-4 !border-b-2">Reset</DuoButton>
            <DuoButton onClick={handleSave} disabled={!dirty} className="!text-xs !py-2 !px-4 !border-b-2">Save</DuoButton>
        </div>
      </div>

      {/* Tabs - Segmented Control */}
      <div className="px-6 pt-4 bg-surface">
          <div className="flex p-1.5 bg-background rounded-theme border-theme border-borderMain">
                <button
                onClick={() => setActiveTab('catalog')}
                className={`flex-1 py-3 rounded-theme text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2
                    ${activeTab === 'catalog' 
                        ? 'bg-surface text-secondary shadow-sm border-theme border-borderMain translate-y-[-1px]' 
                        : 'text-textMuted hover:text-textMain hover:bg-borderMain/20 border-2 border-transparent'}`}
                >
                {currentTheme.icons.ui.empty} Inventory
                </button>
                <button
                onClick={() => setActiveTab('draw')}
                className={`flex-1 py-3 rounded-theme text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2
                    ${activeTab === 'draw' 
                        ? 'bg-surface text-secondary shadow-sm border-theme border-borderMain translate-y-[-1px]' 
                        : 'text-textMuted hover:text-textMain hover:bg-borderMain/20 border-2 border-transparent'}`}
                >
                {currentTheme.icons.ui.draw} Prize Draw
                </button>
          </div>
      </div>

      {/* Content Area */}
      <div className="p-6 overflow-y-auto flex-1 bg-surface">
        {activeTab === 'catalog' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-secondary/10 p-4 rounded-theme border-theme border-secondary/20">
                    <div>
                        <h3 className="text-lg font-black text-secondaryDark">Gift Items</h3>
                        <p className="text-secondary text-xs font-bold">Items here appear in the Prize Draw pool.</p>
                    </div>
                    <DuoButton onClick={openAddGiftModal} className="!text-xs !px-4 !py-2 !h-10 !border-b-2">
                        + New Gift
                    </DuoButton>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {localConfig.rewards.gifts.map(gift => (
                        <div key={gift.id} className="bg-background border-theme border-borderMain border-b-[4px] rounded-theme overflow-hidden group hover:-translate-y-1 transition-transform duration-200">
                            {/* Card Image */}
                            <div className="h-40 bg-borderMain relative group-focus-within:ring-2 ring-inset ring-secondary">
                                <img src={gift.imageUrl} alt={gift.name} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 flex gap-1">
                                     <div className={`px-2 py-1 rounded-lg text-[10px] font-black border-2 uppercase shadow-sm ${gift.drawEligible ? 'bg-primary border-primaryDark text-white' : 'bg-background border-borderMain text-textMuted'}`}>
                                        {gift.drawEligible ? 'Active' : 'Draft'}
                                     </div>
                                </div>
                            </div>
                            
                            {/* Card Body */}
                            <div className="p-4 space-y-3">
                                <input 
                                    value={gift.name}
                                    onChange={(e) => updateGift(gift.id, { name: e.target.value })}
                                    className="font-black text-textMain w-full bg-transparent outline-none border-b-2 border-transparent focus:border-secondary placeholder-textMuted transition-colors"
                                    placeholder="Gift Name"
                                />
                                <textarea 
                                    value={gift.description}
                                    onChange={(e) => updateGift(gift.id, { description: e.target.value })}
                                    className="text-xs font-bold text-textMuted w-full resize-none h-16 bg-surface rounded-theme-sm p-2 outline-none focus:bg-white focus:ring-2 ring-secondary transition-all"
                                    placeholder="Description..."
                                />
                                
                                <div className="h-px bg-borderMain" />
                                
                                <div className="flex items-center justify-between gap-2">
                                    {/* Draw Toggle */}
                                    <button 
                                        onClick={() => updateGift(gift.id, { drawEligible: !gift.drawEligible })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-theme-sm border-b-2 text-[10px] font-black uppercase transition-all active:border-b-0 active:translate-y-[2px] ${
                                            gift.drawEligible 
                                                ? 'bg-primary/20 border-primary text-primaryDark hover:bg-primary/30' 
                                                : 'bg-background border-borderMain text-textMuted hover:bg-borderMain/20'
                                        }`}
                                    >
                                        <span>{gift.drawEligible ? 'In Draw' : 'Hidden'}</span>
                                    </button>

                                    {/* Quantity Input */}
                                    <div className="relative w-16">
                                        <input 
                                            type="number" 
                                            value={gift.maxQuantity}
                                            onChange={(e) => updateGift(gift.id, { maxQuantity: parseInt(e.target.value) })}
                                            className="w-full pl-2 pr-1 py-2 rounded-theme-sm border-2 border-borderMain border-b-2 font-black text-center text-xs outline-none focus:border-secondary bg-surface text-textMain"
                                        />
                                        <div className="absolute top-0 right-1 bottom-0 flex items-center pointer-events-none">
                                            <span className="text-[8px] text-textMuted font-bold uppercase">Qty</span>
                                        </div>
                                    </div>

                                    {/* Delete */}
                                    <button 
                                        onClick={() => removeGift(gift.id)} 
                                        className="w-9 h-9 flex items-center justify-center rounded-theme-sm bg-danger/10 text-danger border-b-2 border-danger hover:bg-danger/20 active:border-b-0 active:translate-y-[2px] transition-all"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Add New Card Placeholder */}
                    <button 
                        onClick={openAddGiftModal}
                        className="border-4 border-dashed border-borderMain rounded-theme flex flex-col items-center justify-center gap-2 min-h-[300px] text-textMuted hover:text-secondary hover:border-secondary hover:bg-secondary/5 transition-all duration-300 group"
                    >
                        <div className="w-16 h-16 rounded-full bg-background group-hover:bg-surface flex items-center justify-center text-2xl border-2 border-borderMain group-hover:border-secondary/30 transition-colors">
                            +
                        </div>
                        <span className="font-black uppercase text-sm">Add Reward</span>
                    </button>
                </div>
            </div>
        )}

        {/* Draw Tab Content */}
        {activeTab === 'draw' && (
            <div className="max-w-xl mx-auto w-full space-y-8 text-center pt-8">
                {drawAnimationState === 'idle' && (
                    <>
                        <div>
                            <div className="text-6xl mb-4">{currentTheme.icons.ui.draw}</div>
                            <h3 className="text-2xl font-black text-textMain">Weekly Prize Draw</h3>
                            <p className="text-textMuted mt-2">
                                {Object.keys(entries).length} staff members have {Object.values(entries).reduce((a,b)=>a+b,0)} total entries based on this week's shout-outs.
                            </p>
                        </div>

                        <div className="bg-secondary/10 p-6 rounded-theme border-theme border-secondary/30 text-left border-b-4">
                            <h4 className="font-bold text-secondaryDark text-sm uppercase mb-3">Current Entry Pool</h4>
                            <div className="flex flex-wrap gap-2">
                                {users.filter(u => entries[u.id]).map(u => (
                                    <div key={u.id} className="bg-surface px-3 py-1 rounded-full text-xs font-bold border border-borderMain flex items-center gap-2 text-textMain">
                                        <img src={u.avatar} className="w-4 h-4 rounded-full" />
                                        {u.name} 
                                        <span className="bg-secondary text-white px-1.5 rounded-full text-[10px]">{entries[u.id]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DuoButton fullWidth onClick={runDrawSimulation}>
                            START DRAW
                        </DuoButton>
                    </>
                )}

                {drawAnimationState === 'rolling' && (
                        <div className="py-20 animate-pulse">
                            <div className="text-8xl animate-spin mb-8">{currentTheme.icons.ui.draw}</div>
                            <h2 className="text-3xl font-black text-textMain">PICKING A WINNER...</h2>
                        </div>
                )}

                {drawAnimationState === 'winner' && simulatedWinner && (
                        <div className="animate-pop">
                            <div className="text-6xl mb-4">{currentTheme.icons.gamification.confetti[0]}</div>
                            <h3 className="text-xl font-bold text-textMuted uppercase tracking-widest">We have a winner!</h3>
                            
                            <div className="my-8 relative inline-block">
                                <div className="absolute -inset-4 bg-accent/50 rounded-full blur-xl animate-pulse"></div>
                                <img src={simulatedWinner.user.avatar} className="w-32 h-32 rounded-full border-8 border-surface shadow-2xl relative z-10" />
                                <div className="absolute -bottom-2 -right-2 text-4xl">{currentTheme.icons.gamification.crown}</div>
                            </div>
                            
                            <h2 className="text-4xl font-black text-textMain mb-2">{simulatedWinner.user.name}</h2>
                            <p className="text-xl text-textMuted mb-8">Won: <strong className="text-secondary">{simulatedWinner.gift.name}</strong></p>

                            <div className="p-4 bg-primary/10 border-theme border-primary rounded-theme max-w-sm mx-auto mb-8 flex items-center gap-4 text-left">
                                <img src={simulatedWinner.gift.imageUrl} className="w-16 h-16 rounded-theme-sm object-cover border border-primary" />
                                <div>
                                    <div className="text-xs font-bold text-primaryDark uppercase">Prize Details</div>
                                    <div className="font-bold text-textMain">{simulatedWinner.gift.name}</div>
                                    <div className="text-xs text-textMuted">{simulatedWinner.gift.description}</div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <DuoButton variant="secondary" onClick={() => setDrawAnimationState('idle')}>Done</DuoButton>
                                <DuoButton onClick={() => alert("Announcement posted to Town Square!")}>Announce</DuoButton>
                            </div>
                        </div>
                )}
            </div>
        )}
      </div>

        {/* Add Gift Modal */}
        {isAddGiftOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-pop">
                <div className="bg-surface w-full max-w-md rounded-theme border-theme border-borderMain shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    <div className="bg-background p-4 border-b-theme border-borderMain flex justify-between items-center">
                        <h3 className="text-xl font-black text-textMain">Add New Reward</h3>
                        <button onClick={() => setIsAddGiftOpen(false)} className="text-textMuted hover:text-textMain">{currentTheme.icons.ui.close}</button>
                    </div>
                    
                    <div className="p-6 space-y-4 overflow-y-auto bg-surface">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-textMuted">Gift Name</label>
                            <input 
                                value={draftGift.name}
                                onChange={e => setDraftGift({...draftGift, name: e.target.value})}
                                className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain focus:border-secondary outline-none bg-background"
                                placeholder="e.g. $50 Amazon Card"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-textMuted">Description</label>
                            <textarea 
                                value={draftGift.description}
                                onChange={e => setDraftGift({...draftGift, description: e.target.value})}
                                className="w-full p-3 rounded-theme border-theme border-borderMain font-medium text-sm text-textMain focus:border-secondary outline-none h-24 resize-none bg-background"
                                placeholder="What do they get?"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-textMuted">Image URL</label>
                            <div className="flex gap-2">
                                <input 
                                    value={draftGift.imageUrl}
                                    onChange={e => setDraftGift({...draftGift, imageUrl: e.target.value})}
                                    className="flex-1 p-3 rounded-theme border-theme border-borderMain text-sm focus:border-secondary outline-none bg-background text-textMain"
                                    placeholder="https://..."
                                />
                                {draftGift.imageUrl && (
                                    <div className="w-12 h-12 rounded-theme border-theme border-borderMain overflow-hidden shrink-0 bg-background">
                                        <img src={draftGift.imageUrl} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-textMuted">Quantity</label>
                                <input 
                                    type="number"
                                    value={draftGift.maxQuantity}
                                    onChange={e => setDraftGift({...draftGift, maxQuantity: parseInt(e.target.value) || 0})}
                                    className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain focus:border-secondary outline-none bg-background"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-textMuted">Draw Eligible?</label>
                                <div 
                                    onClick={() => setDraftGift({...draftGift, drawEligible: !draftGift.drawEligible})}
                                    className={`cursor-pointer p-3 rounded-theme border-theme flex items-center gap-3 transition-colors ${draftGift.drawEligible ? 'bg-primary/10 border-primary' : 'bg-background border-borderMain'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${draftGift.drawEligible ? 'bg-primary border-primary' : 'border-textMuted'}`}>
                                        {draftGift.drawEligible && <span className="text-white text-xs">{currentTheme.icons.ui.check}</span>}
                                    </div>
                                    <span className={`font-bold text-sm ${draftGift.drawEligible ? 'text-primaryDark' : 'text-textMuted'}`}>
                                        {draftGift.drawEligible ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-background border-t-theme border-borderMain flex gap-2">
                        <DuoButton variant="ghost" fullWidth onClick={() => setIsAddGiftOpen(false)}>Cancel</DuoButton>
                        <DuoButton fullWidth onClick={handleSaveNewGift}>Add Gift</DuoButton>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default RewardsPanel;

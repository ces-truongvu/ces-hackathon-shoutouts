
import React, { useState } from 'react';
import { AppConfig, Meme, Gift, User, Shoutout, AIProvider } from '../types';
import DuoButton from './DuoButton';
import { useTheme } from '../context/ThemeContext';

interface AdminPanelProps {
  config: AppConfig;
  users: readonly User[];
  shoutouts: readonly Shoutout[];
  onSave: (newConfig: AppConfig) => void;
}

type Tab = 'schedule' | 'budget' | 'gamification' | 'content' | 'integration' | 'ai';
type ContentSubTab = 'dm' | 'recap' | 'general';

const AdminPanel: React.FC<AdminPanelProps> = ({ config, users, shoutouts, onSave }) => {
  const [activeTab, setActiveTab] = useState<Tab>('schedule');
  const [activeContentTab, setActiveContentTab] = useState<ContentSubTab>('dm');
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);
  const [dirty, setDirty] = useState(false);
  const { currentTheme } = useTheme();

  // Mock data for previews
  const mockPreviewData = {
      recipient: "Alice Chen",
      giver: "Bob Smith",
      value: "We Before Me",
      message: "Thanks for jumping on that call last minute! Saved the day.",
      date: new Date().toLocaleDateString(),
      count: 12,
      total: 45,
      topValue: "Hungry to Learn"
  };

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
    alert('Configuration saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to discard unsaved changes?')) {
      setLocalConfig(config);
      setDirty(false);
    }
  };

  const addMeme = () => {
    const url = prompt("Enter Image URL:");
    if (!url) return;
    const newMeme: Meme = {
        id: `m${Date.now()}`,
        url,
        category: 'Funny'
    };
    updateConfig('content', { memes: [...localConfig.content.memes, newMeme] });
  };

  const removeMeme = (id: string) => {
    updateConfig('content', { memes: localConfig.content.memes.filter(m => m.id !== id) });
  };

  const replacePlaceholders = (template: string) => {
      let result = template;
      Object.entries(mockPreviewData).forEach(([key, value]) => {
          result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
      });
      return result;
  };

  return (
    <div className="max-w-4xl mx-auto bg-surface rounded-theme border-theme border-borderMain overflow-hidden shadow-theme animate-pop h-full flex flex-col">
      {/* Header */}
      <div className="bg-background p-6 border-b-theme border-borderMain flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-black text-textMain">System Configuration</h2>
            <p className="text-textMuted font-bold text-sm">Mattermost Plugin Settings</p>
        </div>
        <div className="flex gap-2">
            <DuoButton variant="ghost" onClick={handleReset} disabled={!dirty}>Reset</DuoButton>
            <DuoButton onClick={handleSave} disabled={!dirty}>Save Changes</DuoButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-theme border-borderMain overflow-x-auto no-scrollbar bg-surface">
        {(['schedule', 'budget', 'gamification', 'content', 'integration', 'ai'] as const).map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                    px-6 py-4 font-bold uppercase text-xs tracking-wider border-b-[4px] transition-colors whitespace-nowrap
                    ${activeTab === tab 
                        ? 'border-secondary text-secondary bg-secondary/10' 
                        : 'border-transparent text-textMuted hover:text-textMain hover:bg-background'}
                `}
            >
                {tab === 'ai' ? '🧠 AI & Brain' : tab}
            </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-8 overflow-y-auto flex-1 bg-surface">
        
        {/* SCHEDULE */}
        {activeTab === 'schedule' && (
            <div className="space-y-6 max-w-lg animate-pop">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-textMuted">Shout-out Day</label>
                    <select 
                        value={localConfig.schedule.shoutoutDay}
                        onChange={(e) => updateConfig('schedule', { shoutoutDay: e.target.value })}
                        className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain bg-background focus:border-secondary outline-none"
                    >
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-textMuted">Aggregation Time</label>
                        <input 
                            type="time" 
                            value={localConfig.schedule.aggregationTime}
                            onChange={(e) => updateConfig('schedule', { aggregationTime: e.target.value })}
                            className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain bg-background focus:border-secondary outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-textMuted">Reminder Time</label>
                        <input 
                            type="time" 
                            value={localConfig.schedule.reminderTime}
                            onChange={(e) => updateConfig('schedule', { reminderTime: e.target.value })}
                            className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain bg-background focus:border-secondary outline-none"
                        />
                    </div>
                </div>
            </div>
        )}

        {/* BUDGET */}
        {activeTab === 'budget' && (
            <div className="space-y-6 max-w-lg animate-pop">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-textMuted">Monthly Quota (Per Staff)</label>
                    <input 
                        type="number" 
                        value={localConfig.budget.monthlyQuota}
                        onChange={(e) => updateConfig('budget', { monthlyQuota: parseInt(e.target.value) })}
                        className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain bg-background focus:border-secondary outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-textMuted">Quota Reset Day</label>
                    <input 
                        type="number" 
                        min="1" max="31"
                        value={localConfig.budget.resetDay}
                        onChange={(e) => updateConfig('budget', { resetDay: parseInt(e.target.value) })}
                        className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain bg-background focus:border-secondary outline-none"
                    />
                    <p className="text-xs text-textMuted">Day of the month when quotas reset.</p>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-textMuted">Enforcement Mode</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer p-3 border-theme border-borderMain rounded-theme flex-1 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                            <input 
                                type="radio" 
                                name="enforcement"
                                value="hard_stop"
                                checked={localConfig.budget.enforcementMode === 'hard_stop'}
                                onChange={() => updateConfig('budget', { enforcementMode: 'hard_stop' })}
                                className="w-5 h-5 accent-primary"
                            />
                            <div>
                                <div className="font-bold text-sm text-textMain">Hard Stop</div>
                                <div className="text-xs text-textMuted">Block usage when full</div>
                            </div>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer p-3 border-theme border-borderMain rounded-theme flex-1 has-[:checked]:border-accent has-[:checked]:bg-accent/10">
                            <input 
                                type="radio" 
                                name="enforcement"
                                value="warning"
                                checked={localConfig.budget.enforcementMode === 'warning'}
                                onChange={() => updateConfig('budget', { enforcementMode: 'warning' })}
                                className="w-5 h-5 accent-accent"
                            />
                            <div>
                                <div className="font-bold text-sm text-textMain">Warning</div>
                                <div className="text-xs text-textMuted">Show banner only</div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        )}

        {/* GAMIFICATION */}
        {activeTab === 'gamification' && (
            <div className="space-y-6 max-w-lg animate-pop">
                <div className="flex items-center justify-between p-4 border-theme border-borderMain rounded-theme bg-background">
                    <div>
                        <div className="font-bold text-textMain">Enable Streaks</div>
                        <div className="text-xs text-textMuted">Track consecutive weeks</div>
                    </div>
                    <input 
                        type="checkbox" 
                        checked={localConfig.gamification.streaksEnabled}
                        onChange={(e) => updateConfig('gamification', { streaksEnabled: e.target.checked })}
                        className="w-6 h-6 accent-primary"
                    />
                </div>

                <div className="flex items-center justify-between p-4 border-theme border-borderMain rounded-theme bg-background">
                    <div>
                        <div className="font-bold text-textMain">Enable Prize Draw</div>
                        <div className="text-xs text-textMuted">Random winner selection</div>
                    </div>
                    <input 
                        type="checkbox" 
                        checked={localConfig.gamification.drawEnabled}
                        onChange={(e) => updateConfig('gamification', { drawEnabled: e.target.checked })}
                        className="w-6 h-6 accent-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-textMuted">Leaderboard Visibility</label>
                    <select 
                        value={localConfig.gamification.leaderboardVisibility}
                        onChange={(e) => updateConfig('gamification', { leaderboardVisibility: e.target.value as any })}
                        className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain bg-background focus:border-secondary outline-none"
                    >
                        <option value="public">Public (Everyone)</option>
                        <option value="admin_only">Admins Only</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-textMuted">XP Multiplier</label>
                    <input 
                        type="number" 
                        step="0.1"
                        value={localConfig.gamification.xpMultiplier}
                        onChange={(e) => updateConfig('gamification', { xpMultiplier: parseFloat(e.target.value) })}
                        className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain bg-background focus:border-secondary outline-none"
                    />
                </div>
            </div>
        )}

        {/* CONTENT */}
        {activeTab === 'content' && (
            <div className="h-full flex flex-col">
                {/* Sub-navigation */}
                <div className="flex p-1 bg-background rounded-theme mb-6 shrink-0 border-theme border-borderMain">
                     <button
                        onClick={() => setActiveContentTab('dm')}
                        className={`flex-1 py-2 rounded-theme-sm text-xs font-black uppercase tracking-wider transition-all ${activeContentTab === 'dm' ? 'bg-surface text-secondary shadow-sm' : 'text-textMuted hover:text-textMain'}`}
                     >
                        Direct Messages
                     </button>
                     <button
                        onClick={() => setActiveContentTab('recap')}
                        className={`flex-1 py-2 rounded-theme-sm text-xs font-black uppercase tracking-wider transition-all ${activeContentTab === 'recap' ? 'bg-surface text-secondary shadow-sm' : 'text-textMuted hover:text-textMain'}`}
                     >
                        Weekly Recap
                     </button>
                     <button
                        onClick={() => setActiveContentTab('general')}
                        className={`flex-1 py-2 rounded-theme-sm text-xs font-black uppercase tracking-wider transition-all ${activeContentTab === 'general' ? 'bg-surface text-secondary shadow-sm' : 'text-textMuted hover:text-textMain'}`}
                     >
                        Reminders & Media
                     </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                    {/* Recipient DM Sub-Tab */}
                    {activeContentTab === 'dm' && (
                       <div className="space-y-6 animate-pop">
                           <div className="border-b-theme border-borderMain pb-4">
                               <h3 className="text-xl font-black text-textMain">Recipient Notification</h3>
                               <p className="text-textMuted text-sm">The private message sent to an employee when they receive a shout-out.</p>
                           </div>

                           <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-textMuted">Recipient Direct Message</label>
                                    <p className="text-[10px] text-textMuted mb-2">Variables: {'{recipient}, {giver}, {value}, {message}'}</p>
                                    <textarea 
                                        value={localConfig.content.dmTemplate}
                                        onChange={(e) => updateConfig('content', { dmTemplate: e.target.value })}
                                        className="w-full p-4 rounded-theme border-theme border-borderMain font-mono text-xs text-textMain bg-background h-64 resize-none focus:border-secondary outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-textMuted">Preview (Recipient View)</label>
                                    <div className="bg-surface border-theme border-borderMain rounded-theme p-4 shadow-sm h-auto min-h-[160px]">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0"></div>
                                            <div className="space-y-1">
                                                <div className="font-bold text-sm text-textMain">EOS Bot <span className="text-[10px] bg-background border border-borderMain px-1 rounded text-textMuted">BOT</span></div>
                                                <div className="text-sm whitespace-pre-wrap text-textMain">
                                                    {replacePlaceholders(localConfig.content.dmTemplate)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                           </div>
                       </div>
                    )}

                    {/* Town Square Recap Sub-Tab */}
                    {activeContentTab === 'recap' && (
                        <div className="space-y-6 animate-pop">
                            <div className="border-b-theme border-borderMain pb-4">
                               <h3 className="text-xl font-black text-textMain">Town Square Recap</h3>
                               <p className="text-textMuted text-sm">The public summary posted to the main channel on Fridays.</p>
                           </div>
                           
                           <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <span className="text-xs font-bold text-textMuted">Header</span>
                                        <input
                                            type="text"
                                            value={localConfig.content.aggregationHeader}
                                            onChange={(e) => updateConfig('content', { aggregationHeader: e.target.value })}
                                            className="w-full p-2 rounded-theme border-theme border-borderMain text-xs font-mono focus:border-secondary outline-none bg-background text-textMain"
                                        />
                                    </div>
                                     <div className="space-y-2">
                                        <span className="text-xs font-bold text-textMuted">Intro Text</span>
                                        <input
                                            type="text"
                                            value={localConfig.content.aggregationIntro}
                                            onChange={(e) => updateConfig('content', { aggregationIntro: e.target.value })}
                                            className="w-full p-2 rounded-theme border-theme border-borderMain text-xs font-mono focus:border-secondary outline-none bg-background text-textMain"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-xs font-bold text-textMuted">Footer</span>
                                        <input
                                            type="text"
                                            value={localConfig.content.aggregationFooter}
                                            onChange={(e) => updateConfig('content', { aggregationFooter: e.target.value })}
                                            className="w-full p-2 rounded-theme border-theme border-borderMain text-xs font-mono focus:border-secondary outline-none bg-background text-textMain"
                                        />
                                    </div>
                                    <p className="text-[10px] text-textMuted">Variables: {'{date}, {count}, {total}, {topValue}'}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-textMuted">Preview (Town Square)</label>
                                    <div className="bg-surface border-theme border-borderMain rounded-theme p-4 shadow-sm h-auto min-h-[250px]">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0"></div>
                                            <div className="space-y-1 w-full">
                                                <div className="font-bold text-sm text-textMain">EOS Bot <span className="text-[10px] bg-background border border-borderMain px-1 rounded text-textMuted">BOT</span></div>
                                                <div className="text-sm text-textMain whitespace-pre-wrap">
                                                    <p className="font-bold mb-2">{replacePlaceholders(localConfig.content.aggregationHeader)}</p>
                                                    <p className="mb-4">{replacePlaceholders(localConfig.content.aggregationIntro)}</p>
                                                    
                                                    <div className="mb-2">
                                                        <p className="font-bold text-secondary">🤝 We Before Me:</p>
                                                        <ul className="list-disc pl-5 text-textMuted">
                                                            <li><strong>Alice Chen:</strong> Helped me debug...</li>
                                                            <li><strong>Bob Smith:</strong> Covered my shift...</li>
                                                        </ul>
                                                    </div>

                                                     <div className="mb-4">
                                                        <p className="font-bold text-primary">📚 Hungry to Learn:</p>
                                                        <ul className="list-disc pl-5 text-textMuted">
                                                            <li><strong>Charlie Kim:</strong> Finished the certification...</li>
                                                        </ul>
                                                    </div>

                                                    <div className="text-xs text-textMuted border-t border-borderMain pt-2">
                                                        {replacePlaceholders(localConfig.content.aggregationFooter)}
                                                    </div>
                                                    
                                                    <div className="mt-2 flex gap-2">
                                                        <span className="text-xs bg-background px-2 py-1 rounded border border-borderMain text-textMain">See Full Board</span>
                                                        <span className="text-xs bg-background px-2 py-1 rounded border border-borderMain text-textMain">Weekly Leaders</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                           </div>
                        </div>
                    )}

                    {/* Reminders & Media Sub-Tab */}
                    {activeContentTab === 'general' && (
                        <div className="space-y-6 animate-pop">
                             <div className="border-b-theme border-borderMain pb-4">
                               <h3 className="text-xl font-black text-textMain">General Settings</h3>
                               <p className="text-textMuted text-sm">Reminders and celebration assets.</p>
                           </div>

                           <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-textMuted">Weekly Reminder Message</label>
                                <textarea 
                                    value={localConfig.content.reminderTemplate}
                                    onChange={(e) => updateConfig('content', { reminderTemplate: e.target.value })}
                                    className="w-full p-4 rounded-theme border-theme border-borderMain font-medium text-textMain h-24 resize-none focus:border-secondary outline-none bg-background"
                                />
                           </div>

                            {/* Meme Gallery Section */}
                            <div className="space-y-4 pt-4 border-t-theme border-borderMain">
                                <div className="flex justify-between items-center">
                                    <div>
                                         <h3 className="text-xl font-black text-textMain">Meme Gallery</h3>
                                         <p className="text-textMuted text-sm">Images used for celebration screens.</p>
                                    </div>
                                    <button onClick={addMeme} className="text-secondary font-bold text-sm hover:underline">+ Add Meme URL</button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {localConfig.content.memes.map(meme => (
                                        <div key={meme.id} className="relative group rounded-theme overflow-hidden border-theme border-borderMain aspect-square">
                                            <img src={meme.url} alt="Meme" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button onClick={() => removeMeme(meme.id)} className="text-white font-bold bg-danger px-3 py-1 rounded-full text-xs">Delete</button>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-surface/90 text-[10px] font-bold p-1 text-center truncate text-textMain">
                                                {meme.category}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* INTEGRATION */}
        {activeTab === 'integration' && (
            <div className="space-y-6 max-w-lg animate-pop">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-textMuted">Town Square Channel ID</label>
                    <input 
                        type="text" 
                        value={localConfig.integration.channelId}
                        onChange={(e) => updateConfig('integration', { channelId: e.target.value })}
                        className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain bg-background focus:border-secondary outline-none"
                        placeholder="e.g. town-square"
                    />
                </div>
                
                <div className="p-4 bg-background rounded-theme border-theme border-borderMain">
                    <div className="font-bold text-xs text-textMuted uppercase mb-2">Mattermost Connection</div>
                    <div className="text-sm font-mono text-textMain truncate">
                        Plugin ID: com.mattermost.eos-shoutout<br/>
                        Version: 1.0.0<br/>
                        DB Type: SQLite
                    </div>
                </div>
            </div>
        )}

        {/* AI & BRAIN */}
        {activeTab === 'ai' && (
            <div className="space-y-6 max-w-lg animate-pop">
                 <div className="border-b-theme border-borderMain pb-4 mb-4">
                    <h3 className="text-xl font-black text-textMain">AI Integration</h3>
                    <p className="text-textMuted text-sm">Configure the "Radical Candor" coaching engine.</p>
                 </div>

                 <div className="flex items-center justify-between p-4 border-theme border-borderMain rounded-theme bg-background mb-4">
                    <div>
                        <div className="font-bold text-textMain">Enable AI Features</div>
                        <div className="text-xs text-textMuted">Turn off to disable coaching</div>
                    </div>
                    <input 
                        type="checkbox" 
                        checked={localConfig.ai.enabled}
                        onChange={(e) => updateConfig('ai', { enabled: e.target.checked })}
                        className="w-6 h-6 accent-primary"
                    />
                </div>

                <div className={`space-y-6 transition-opacity ${!localConfig.ai.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-textMuted">AI Provider</label>
                        <select 
                            value={localConfig.ai.provider}
                            onChange={(e) => updateConfig('ai', { provider: e.target.value as AIProvider })}
                            className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain bg-background focus:border-secondary outline-none"
                        >
                            <option value="Gemini">Google Gemini</option>
                            <option value="OpenAI">OpenAI (GPT)</option>
                            <option value="Claude">Anthropic Claude</option>
                            <option value="Groq">Groq (Llama)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-textMuted">API Key (Token)</label>
                        <input 
                            type="password" 
                            value={localConfig.ai.apiKey}
                            onChange={(e) => updateConfig('ai', { apiKey: e.target.value })}
                            className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain bg-background focus:border-secondary outline-none"
                            placeholder="sk-..."
                        />
                        <p className="text-[10px] text-textMuted">Your key is stored locally in the plugin config.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-textMuted">Model ID</label>
                        <input 
                            type="text" 
                            value={localConfig.ai.model}
                            onChange={(e) => updateConfig('ai', { model: e.target.value })}
                            className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain bg-background focus:border-secondary outline-none"
                            placeholder={localConfig.ai.provider === 'Gemini' ? 'gemini-1.5-flash' : 'gpt-4o'}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-textMuted">Custom Endpoint (Optional)</label>
                        <input 
                            type="text" 
                            value={localConfig.ai.endpoint || ''}
                            onChange={(e) => updateConfig('ai', { endpoint: e.target.value })}
                            className="w-full p-3 rounded-theme border-theme border-borderMain font-bold text-textMain bg-background focus:border-secondary outline-none"
                            placeholder="https://api.example.com/v1"
                        />
                         <p className="text-[10px] text-textMuted">Leave empty for default provider endpoints.</p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

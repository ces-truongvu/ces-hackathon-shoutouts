
import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { User, Shoutout, CoreValue } from '../types';
import DuoButton from './DuoButton';
import { useTheme } from '../context/ThemeContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ReportsDashboardProps {
  users: readonly User[];
  realShoutouts: readonly Shoutout[]; // Passed from App state
}

type TimeRange = 'Weekly' | 'Monthly' | 'Annual';

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ users, realShoutouts }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('Monthly');
  const [customFilter, setCustomFilter] = useState('');
  const { currentTheme } = useTheme();

  // --- Mock Data Generator (Simulating Historical Data for Demo) ---
  // Since the actual app state is transient in this demo, we generate "Sticky" data
  // to make the charts look populated and valuable.
  const chartData = useMemo(() => {
    // Generate ~100 shoutouts over the last 12 months
    const mockData: { date: Date; value: CoreValue; userId: string }[] = [];
    const today = new Date();
    const values = Object.values(CoreValue);
    
    // Add real data
    realShoutouts.forEach(s => {
        mockData.push({ date: new Date(s.timestamp), value: s.coreValues[0], userId: s.recipientIds[0] });
    });

    // Add simulated historical data if real data is sparse
    if (mockData.length < 20) {
        for (let i = 0; i < 80; i++) {
            const daysAgo = Math.floor(Math.random() * 365);
            const date = new Date(today);
            date.setDate(date.getDate() - daysAgo);
            
            // Weighted random for values to show interesting distribution
            const valueIndex = Math.random() > 0.3 ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 4);
            // Random user
            const userIndex = Math.floor(Math.random() * users.length);
            
            mockData.push({
                date,
                value: values[valueIndex],
                userId: users[userIndex].id
            });
        }
    }
    
    return mockData.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [realShoutouts, users]);

  // --- Aggregation Logic ---

  // 1. Line Chart: Volume over time
  const lineChartData = useMemo(() => {
    const labels: string[] = [];
    const dataPoints: number[] = [];
    
    if (timeRange === 'Annual') {
        // Group by Month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        // Show last 12 months
        for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(currentMonth - i);
            const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
            labels.push(key);
            
            const count = chartData.filter(item => 
                item.date.getMonth() === d.getMonth() && 
                item.date.getFullYear() === d.getFullYear()
            ).length;
            dataPoints.push(count);
        }
    } else if (timeRange === 'Monthly') {
        // Group by Week (Last 4 weeks)
        for(let i=3; i>=0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - (i * 7));
            labels.push(`Week -${i}`);
            // Rough approximation for demo
            dataPoints.push(Math.floor(Math.random() * 10) + 5); 
        }
    } else {
         // Weekly (Daily)
         const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
         for(let i=6; i>=0; i--) {
             const d = new Date();
             d.setDate(d.getDate() - i);
             labels.push(days[d.getDay()]);
             const count = chartData.filter(item => item.date.toDateString() === d.toDateString()).length;
             dataPoints.push(count);
         }
    }

    return {
        labels,
        datasets: [{
            label: 'Shout-outs',
            data: dataPoints,
            borderColor: currentTheme.colors.secondary,
            backgroundColor: 'rgba(28, 176, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: currentTheme.colors.secondary,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };
  }, [timeRange, chartData, currentTheme]);

  // 2. Doughnut: Value Distribution
  const doughnutData = useMemo(() => {
    const counts = {
        [CoreValue.BRAVELY_SPEAK]: 0,
        [CoreValue.WE_BEFORE_ME]: 0,
        [CoreValue.HUNGRY_TO_LEARN]: 0,
        [CoreValue.PURSUIT_OF_EXCELLENCE]: 0
    };
    
    chartData.forEach(d => {
        if (counts[d.value] !== undefined) counts[d.value]++;
    });

    return {
        labels: Object.values(CoreValue),
        datasets: [{
            data: Object.values(counts),
            backgroundColor: [
                currentTheme.colors.value1, // Purple
                currentTheme.colors.value2, // Blue
                currentTheme.colors.value3, // Green
                currentTheme.colors.value4  // Red
            ],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };
  }, [chartData, currentTheme]);

  // 3. Bar: Top Receivers
  const barData = useMemo(() => {
    const counts: Record<string, number> = {};
    chartData.forEach(d => {
        counts[d.userId] = (counts[d.userId] || 0) + 1;
    });
    
    const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
        
    return {
        labels: sorted.map(([uid]) => users.find(u => u.id === uid)?.name || 'Unknown'),
        datasets: [{
            label: 'Received',
            data: sorted.map(([, count]) => count),
            backgroundColor: currentTheme.colors.accent,
            borderRadius: 8,
            borderSkipped: false as const
        }]
    };
  }, [chartData, users, currentTheme]);

  // Export Mock
  const handleExport = (format: 'CSV' | 'PDF') => {
      const btn = document.getElementById(`btn-${format}`);
      if(btn) {
          btn.classList.add('animate-bounce');
          setTimeout(() => btn.classList.remove('animate-bounce'), 1000);
      }
      setTimeout(() => {
          alert(`Report generated! \nDownloading ${format} for ${timeRange} period...`);
      }, 500);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
       
       {/* Controls Header */}
       <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-background p-4 rounded-theme border-theme border-borderMain">
           <div className="flex bg-surface rounded-theme-sm p-1 border-theme border-borderMain shadow-sm">
               {(['Weekly', 'Monthly', 'Annual'] as TimeRange[]).map(t => (
                   <button
                        key={t}
                        onClick={() => setTimeRange(t)}
                        className={`px-4 py-2 rounded-theme-sm text-xs font-black uppercase tracking-wider transition-all ${timeRange === t ? 'bg-secondary text-white shadow-md' : 'text-textMuted hover:bg-background'}`}
                   >
                       {t}
                   </button>
               ))}
           </div>

           <div className="flex gap-2">
               <DuoButton id="btn-CSV" variant="ghost" onClick={() => handleExport('CSV')} className="!py-2 !px-4 text-xs">
                   📥 Export CSV
               </DuoButton>
               <DuoButton id="btn-PDF" variant="secondary" onClick={() => handleExport('PDF')} className="!py-2 !px-4 text-xs">
                   📄 Export PDF
               </DuoButton>
           </div>
       </div>

       {/* KPIs */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-surface p-4 rounded-theme border-theme border-borderMain shadow-sm">
               <div className="text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Total Shout-outs</div>
               <div className="text-3xl font-black text-secondary">{chartData.length}</div>
               <div className="text-xs font-bold text-primary">↑ 12% vs last period</div>
           </div>
           <div className="bg-surface p-4 rounded-theme border-theme border-borderMain shadow-sm">
               <div className="text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Participation</div>
               <div className="text-3xl font-black text-primary">87%</div>
               <div className="text-xs font-bold text-textMuted">of active staff</div>
           </div>
           <div className="bg-surface p-4 rounded-theme border-theme border-borderMain shadow-sm">
               <div className="text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">Top Value</div>
               <div className="text-xl font-black text-textMain truncate">{CoreValue.BRAVELY_SPEAK}</div>
               <div className="text-xs font-bold text-textMuted">Most frequent</div>
           </div>
           <div className="bg-surface p-4 rounded-theme border-theme border-borderMain shadow-sm">
               <div className="text-textMuted text-[10px] font-black uppercase tracking-widest mb-1">New Givers</div>
               <div className="text-3xl font-black text-accent">3</div>
               <div className="text-xs font-bold text-textMuted">First time this month</div>
           </div>
       </div>

       {/* Charts Grid */}
       <div className="grid md:grid-cols-3 gap-6 flex-1 overflow-y-auto min-h-0 pb-4">
           {/* Main Trend */}
           <div className="md:col-span-2 bg-surface p-6 rounded-theme border-theme border-borderMain shadow-sm flex flex-col">
               <h3 className="text-lg font-black text-textMain mb-4">Recognition Trends</h3>
               <div className="flex-1 min-h-[250px] relative">
                    <Line 
                        data={lineChartData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { beginAtZero: true, grid: { color: currentTheme.colors.border }, border: { display: false }, ticks: { color: currentTheme.colors.textMuted } },
                                x: { grid: { display: false }, border: { display: false }, ticks: { color: currentTheme.colors.textMuted } }
                            }
                        }} 
                    />
               </div>
           </div>

           {/* Value Distribution */}
           <div className="bg-surface p-6 rounded-theme border-theme border-borderMain shadow-sm flex flex-col">
               <h3 className="text-lg font-black text-textMain mb-4">Culture Mix</h3>
               <div className="flex-1 min-h-[200px] relative flex justify-center">
                    <Doughnut 
                        data={doughnutData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { 
                                legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10, weight: 'bold' }, color: currentTheme.colors.text } } 
                            },
                            cutout: '70%'
                        }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <div className="text-xs font-bold text-textMuted uppercase">Values</div>
                            <div className="text-2xl font-black text-textMain">4</div>
                        </div>
                    </div>
               </div>
           </div>

            {/* Leaderboard Chart */}
           <div className="md:col-span-3 bg-surface p-6 rounded-theme border-theme border-borderMain shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-black text-textMain">Top Recognized Staff</h3>
                    <div className="text-xs font-bold text-textMuted bg-background border border-borderMain px-2 py-1 rounded">Ranked by volume</div>
                </div>
                <div className="h-64">
                    <Bar 
                        data={barData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            indexAxis: 'y',
                            plugins: { legend: { display: false } },
                            scales: {
                                x: { display: false, grid: { display: false } },
                                y: { grid: { display: false }, border: { display: false }, ticks: { font: { weight: 'bold' }, color: currentTheme.colors.text } }
                            }
                        }}
                    />
                </div>
           </div>
       </div>
    </div>
  );
};

export default ReportsDashboard;

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { LoanSummary, AmortizationRow } from '../types';
import { formatCurrencyCompact } from '../utils/loanMath';
import { PieChart as PieIcon, TrendingUp } from 'lucide-react';

interface DashboardChartsProps {
  summary: LoanSummary;
  schedule: AmortizationRow[];
  comparisonSchedule?: AmortizationRow[];
  isComparisonActive?: boolean;
  comparisonLabel?: string;
}

const COLORS = ['#4f46e5', '#06b6d4']; // Indigo, Cyan
const GRADIENTS = ['url(#colorPrincipal)', 'url(#colorInterest)'];

const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
    summary, 
    schedule, 
    comparisonSchedule, 
    isComparisonActive,
    comparisonLabel = "Optimized Plan"
}) => {
  const pieData = [
    { name: 'Principal', value: summary.totalPayment - summary.totalInterest },
    { name: 'Interest', value: summary.totalInterest },
  ];

  const maxLen = isComparisonActive && comparisonSchedule ? Math.max(schedule.length, comparisonSchedule.length) : schedule.length;
  const step = Math.ceil(maxLen / 30); 
  
  const chartData = [];
  for (let i = 0; i < maxLen; i += step) {
      const dataPoint: any = {
          name: `Mo ${i+1}`,
          StandardBalance: i < schedule.length ? schedule[i].closingBalance : 0,
      };

      if (isComparisonActive && comparisonSchedule) {
          dataPoint.SmartBalance = i < comparisonSchedule.length ? comparisonSchedule[i].closingBalance : 0;
      } else if (isComparisonActive) {
          dataPoint.SmartBalance = 0;
      }

      chartData.push(dataPoint);
  }
  // Ensure we hit zero
  if (chartData.length > 0 && (chartData[chartData.length-1].StandardBalance > 0 || chartData[chartData.length-1].SmartBalance > 0)) {
     chartData.push({ name: 'End', StandardBalance: 0, SmartBalance: 0 });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* --- Pie Chart Card --- */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-100 dark:border-slate-700 flex flex-col relative overflow-hidden group shadow-[0_20px_40px_-12px_rgba(79,70,229,0.1)] dark:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)]">
        
        {/* PLEO HEADER: Sky/Cyan Geometry */}
        <div className="relative h-24 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] p-6 flex items-center justify-between z-10">
             {/* Decor */}
             <div className="absolute -left-4 -top-4 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
             <svg className="absolute top-0 right-0 h-full w-32 text-white/10" viewBox="0 0 100 100" fill="currentColor">
                 <path d="M50 0 L100 0 L100 100 Z" />
                 <circle cx="80" cy="20" r="10" className="text-white/20" />
             </svg>
             
             <div className="flex items-center gap-3 relative z-10">
                 <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl shadow-inner border border-white/10">
                     <PieIcon className="w-5 h-5 text-white" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-white tracking-tight leading-none">Repayment</h3>
                    <p className="text-[10px] text-cyan-100 font-medium uppercase tracking-widest mt-1 opacity-90">Composition</p>
                 </div>
             </div>
        </div>

        <div className="flex-1 min-h-[300px] relative z-10 p-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                 <filter id="shadow" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.2)" />
                 </filter>
              </defs>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={105}
                paddingAngle={6}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                cornerRadius={12}
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    style={{ filter: 'url(#shadow)', transition: 'all 0.3s ease' }}
                    className="hover:opacity-90 cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)}
                contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(8px)',
                    borderRadius: '16px', 
                    border: '1px solid rgba(0,0,0,0.05)', 
                    color: '#1e293b', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                }}
                itemStyle={{ color: '#475569', fontSize: '12px', fontWeight: 600 }}
                cursor={false}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                formatter={(value, entry: any) => (
                    <span className="text-slate-600 dark:text-slate-300 font-bold text-xs ml-2">
                        {value} <span className="opacity-60 ml-1 font-normal">({((entry.payload.value / summary.totalPayment) * 100).toFixed(1)}%)</span>
                    </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Center Text */}
        <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-[40%] text-center pointer-events-none z-0">
             <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total</div>
             <div className="text-xl font-extrabold text-slate-900 dark:text-white">{formatCurrencyCompact(summary.totalPayment)}</div>
        </div>
      </div>

      {/* --- Area Chart Card --- */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-100 dark:border-slate-700 flex flex-col relative overflow-hidden shadow-[0_20px_40px_-12px_rgba(6,182,212,0.1)] dark:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)]">
        
        {/* PLEO HEADER: Emerald/Teal Geometry */}
        <div className="relative h-24 bg-gradient-to-r from-[#10b981] to-[#14b8a6] p-6 flex items-center justify-between z-10">
             {/* Decor */}
             <div className="absolute top-0 right-0 w-40 h-full overflow-hidden">
                <svg className="w-full h-full text-white/10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 Q 50 20 100 100 Z" fill="currentColor" />
                </svg>
             </div>
             <div className="absolute top-6 left-32 w-2 h-2 bg-yellow-300 rounded-full opacity-60"></div>

             <div className="flex items-center gap-3 relative z-10">
                 <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl shadow-inner border border-white/10">
                     <TrendingUp className="w-5 h-5 text-white" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-white tracking-tight leading-none">{isComparisonActive ? "Trajectory" : "Reduction"}</h3>
                    <p className="text-[10px] text-emerald-100 font-medium uppercase tracking-widest mt-1 opacity-90">Balance Timeline</p>
                 </div>
             </div>
             
             {/* Legend Inside Header */}
             {isComparisonActive && (
                <div className="flex flex-col gap-1.5 z-10 bg-white/10 p-2 rounded-lg border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></span>
                        <span className="text-[9px] font-bold text-emerald-100 uppercase">Base</span>
                    </div>
                     <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]"></span>
                        <span className="text-[9px] font-bold text-white uppercase">Smart</span>
                    </div>
                </div>
            )}
        </div>

        <div className="flex-1 min-h-[300px] relative z-10 p-6 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSmart" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{fontSize: 10, fill: '#94a3b8'}} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
              />
              <YAxis 
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} 
                stroke="transparent" 
                tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}}
                width={50}
              />
              <Tooltip 
                formatter={(value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)}
                contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(8px)',
                    borderRadius: '16px', 
                    border: '1px solid rgba(0,0,0,0.05)', 
                    color: '#1e293b', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                }}
                itemStyle={{ color: '#475569', fontSize: '12px', fontWeight: 600 }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              
              <Area 
                type="monotone" 
                dataKey="StandardBalance" 
                name="Baseline"
                stroke="#4f46e5" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorStandard)" 
                animationDuration={1500}
              />
              
              {isComparisonActive && (
                  <Area 
                    type="monotone" 
                    dataKey="SmartBalance" 
                    name={comparisonLabel}
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSmart)" 
                    animationDuration={1500}
                  />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
import React from 'react';
import { LoanSummary } from '../types';
import { formatCurrency, formatCurrencyDecimal } from '../utils/loanMath';
import { Wallet, TrendingUp, CalendarCheck, PiggyBank, ArrowUp, Zap, ArrowDown } from 'lucide-react';

interface SummaryCardsProps {
  summary: LoanSummary;
  comparisonSummary?: LoanSummary; 
  isComparisonActive?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, comparisonSummary, isComparisonActive }) => {
  const activeSummary = isComparisonActive && comparisonSummary ? comparisonSummary : summary;
  
  const totalSaved = isComparisonActive && comparisonSummary 
    ? summary.totalPayment - comparisonSummary.totalPayment 
    : 0;
  
  const monthsSaved = isComparisonActive && comparisonSummary
    ? summary.totalMonths - comparisonSummary.totalMonths
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* 1. EMI CARD - Deep Blue/Indigo with Abstract Leaves */}
      {/* Shadow: Blue/Indigo Glow */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-bl from-[#4c36f5] to-[#2b5ae6] p-6 text-white group hover:-translate-y-2 transition-transform duration-500 shadow-[0_20px_50px_-12px_rgba(76,54,245,0.5)] dark:shadow-[0_20px_50px_-12px_rgba(76,54,245,0.3)]">
        {/* Background Shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <svg className="absolute top-[-20px] left-[-20px] w-32 h-32 text-white/10 rotate-12" viewBox="0 0 100 100" fill="currentColor">
           <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zM50 80C33.4 80 20 66.6 20 50s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z"/>
        </svg>
        <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-[#00c6ff]/20" viewBox="0 0 100 100" fill="currentColor">
           <path d="M30 10 Q 50 50 80 30 T 90 90 T 30 90 Z" />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
                 <span className="text-blue-100/80 text-[11px] font-bold uppercase tracking-widest">Monthly EMI</span>
                 <div className="h-1 w-8 bg-blue-300/50 rounded-full mt-1"></div>
            </div>
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-2xl shadow-inner border border-white/10">
               <Wallet className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">
                {formatCurrencyDecimal(activeSummary.monthlyEMI)}
            </h3>
            {isComparisonActive && comparisonSummary && comparisonSummary.monthlyEMI > summary.monthlyEMI && (
                 <div className="inline-flex items-center gap-1 mt-2 bg-white/20 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
                    <ArrowUp className="w-3 h-3 text-red-200" />
                    <span className="text-xs font-bold text-red-100">
                        +{formatCurrencyDecimal(comparisonSummary.monthlyEMI - summary.monthlyEMI)}
                    </span>
                 </div>
            )}
            <p className="text-[10px] text-blue-100 mt-2 opacity-80 font-medium tracking-wide">Auto-debited monthly</p>
          </div>
        </div>
      </div>

      {/* 2. INTEREST CARD - Vibrant Purple/Pink with Waves */}
      {/* Shadow: Pink/Purple Glow */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-tr from-[#ec4899] to-[#8b5cf6] p-6 text-white group hover:-translate-y-2 transition-transform duration-500 shadow-[0_20px_50px_-12px_rgba(236,72,153,0.5)] dark:shadow-[0_20px_50px_-12px_rgba(236,72,153,0.3)]">
         {/* Background Shapes */}
         <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
         <svg className="absolute bottom-0 left-0 w-full h-32 text-white/10" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
         </svg>
         
         <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex flex-col">
                    <span className="text-purple-100/80 text-[11px] font-bold uppercase tracking-widest">Total Interest</span>
                    <div className="h-1 w-8 bg-purple-200/50 rounded-full mt-1"></div>
                 </div>
                 <div className="p-2 bg-white/20 backdrop-blur-sm rounded-2xl shadow-inner border border-white/10">
                    <TrendingUp className="w-5 h-5 text-white" />
                 </div>
            </div>
            
            <div>
                <h3 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">
                    {formatCurrency(activeSummary.totalInterest)}
                </h3>
                {isComparisonActive && (
                    <div className="mt-2 text-xs font-medium text-pink-100 opacity-80 flex items-center gap-2">
                        <span className="line-through decoration-white/50">{formatCurrency(summary.totalInterest)}</span>
                        <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">Old</span>
                    </div>
                )}
                 <p className="text-[10px] text-purple-100 mt-2 opacity-80 font-medium tracking-wide">Cost of borrowing</p>
            </div>
         </div>
      </div>

      {/* 3. SAVINGS/TOTAL CARD - Cyan/Teal Fluid Blobs */}
      {/* Shadow: Cyan/Teal Glow */}
      {isComparisonActive && totalSaved > 0 ? (
          // Savings Mode
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#06b6d4] to-[#10b981] p-6 text-white group hover:-translate-y-2 transition-transform duration-500 shadow-[0_20px_50px_-12px_rgba(6,182,212,0.5)] dark:shadow-[0_20px_50px_-12px_rgba(6,182,212,0.3)]">
             {/* Blobs */}
             <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-yellow-300/30 rounded-full blur-2xl"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-cyan-900/10 rounded-full blur-xl"></div>
             <svg className="absolute top-10 left-[-20px] w-20 h-20 text-white/10 animate-pulse-slow" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
             </svg>

             <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-cyan-50 text-[11px] font-bold uppercase tracking-widest">Total Savings</span>
                        <div className="h-1 w-8 bg-cyan-100/50 rounded-full mt-1"></div>
                    </div>
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/20 shadow-inner">
                        <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                    </div>
                </div>
                
                <div>
                    <h3 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">
                        {formatCurrency(totalSaved)}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/10 text-[11px] font-bold text-white shadow-sm">
                        <ArrowDown className="w-3.5 h-3.5" />
                        {(totalSaved / summary.totalInterest * 100).toFixed(1)}% Saved
                    </div>
                </div>
             </div>
          </div>
      ) : (
          // Standard Total Payment
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0891b2] to-[#0d9488] p-6 text-white group hover:-translate-y-2 transition-transform duration-500 shadow-[0_20px_50px_-12px_rgba(8,145,178,0.5)] dark:shadow-[0_20px_50px_-12px_rgba(8,145,178,0.3)]">
             {/* Fluid Shapes */}
             <svg className="absolute top-0 right-0 w-48 h-48 text-white/5 transform translate-x-10 -translate-y-10" viewBox="0 0 200 200" fill="currentColor">
                <path d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.5,-41.2C83.9,-26.8,88.5,-11.7,85.8,2.2C83.1,16.1,73.1,28.8,63.3,40.4C53.5,52,43.9,62.5,32.3,69.5C20.7,76.5,7.1,80,-5.4,78.8C-17.9,77.6,-31.6,71.7,-43.3,63.1C-55,54.5,-64.7,43.2,-71.4,30.3C-78.1,17.4,-81.8,2.9,-78.6,-10.3C-75.4,-23.5,-65.3,-35.4,-54.2,-44.6C-43.1,-53.8,-31,-60.3,-18.8,-62.8C-6.6,-65.3,5.7,-63.8,18.8,-62.8L45.7,-76.3Z" transform="translate(100 100)" />
             </svg>
             
             <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-cyan-100/80 text-[11px] font-bold uppercase tracking-widest">Total Payment</span>
                        <div className="h-1 w-8 bg-cyan-200/50 rounded-full mt-1"></div>
                    </div>
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-2xl shadow-inner border border-white/10">
                        <PiggyBank className="w-5 h-5 text-white" />
                    </div>
                </div>
                
                <div>
                     <h3 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">
                        {formatCurrency(activeSummary.totalPayment)}
                     </h3>
                     <p className="text-[10px] text-cyan-100 mt-2 opacity-80 font-medium tracking-wide">Principal + Interest</p>
                </div>
             </div>
          </div>
      )}

      {/* 4. DATE CARD - White/Clean with Colorful Dots */}
      {/* Shadow: Soft Multicolor Glow (White Card Style) */}
      <div className="relative overflow-hidden rounded-[32px] bg-white dark:bg-[#1e293b] p-6 border border-slate-100 dark:border-slate-700 group hover:-translate-y-2 transition-transform duration-500 shadow-[0_20px_50px_-12px_rgba(99,102,241,0.2)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
         {/* Confetti Dots Background */}
         <div className="absolute top-4 right-8 w-3 h-3 bg-purple-500 rounded-full opacity-20 group-hover:scale-125 transition-transform"></div>
         <div className="absolute bottom-8 left-6 w-2 h-2 bg-cyan-500 rounded-full opacity-30 group-hover:scale-125 transition-transform delay-75"></div>
         <div className="absolute top-1/2 left-4 w-4 h-4 bg-orange-400 rounded-full opacity-20 group-hover:scale-125 transition-transform delay-100"></div>
         <div className="absolute bottom-4 right-4 w-6 h-6 bg-pink-500 rounded-full opacity-10 group-hover:scale-125 transition-transform delay-150"></div>
         <div className="absolute top-6 left-1/2 w-2 h-2 bg-emerald-500 rounded-full opacity-40"></div>
         
         {/* Gradient glow at bottom */}
         <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl rounded-full"></div>

         <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex flex-col">
                    <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Payoff Date</span>
                    <div className="h-1 w-8 bg-slate-200 dark:bg-slate-600 rounded-full mt-1"></div>
                 </div>
                 <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                    <CalendarCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                 </div>
            </div>
            
            <div>
                 <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                    {activeSummary.payoffDate}
                 </h3>
                 {isComparisonActive && monthsSaved > 0 ? (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                        <Zap className="w-3 h-3 fill-current" />
                        {Math.floor(monthsSaved / 12)}y {monthsSaved % 12}m earlier
                    </div>
                ) : (
                    <p className="text-[10px] text-slate-400 mt-2 font-medium tracking-wide">Loan Tenure End</p>
                )}
            </div>
         </div>
      </div>

    </div>
  );
};

export default SummaryCards;
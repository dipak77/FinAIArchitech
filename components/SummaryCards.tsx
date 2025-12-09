import React from 'react';
import { LoanSummary, AmortizationRow } from '../types';
import { formatCurrency, formatCurrencyDecimal, formatCurrencyCompact } from '../utils/loanMath';
import { Wallet, TrendingUp, CalendarCheck, PiggyBank, ArrowUp, Zap, ArrowDown, Info } from 'lucide-react';

interface SummaryCardsProps {
  summary: LoanSummary;
  comparisonSummary?: LoanSummary; 
  isComparisonActive?: boolean;
  schedule: AmortizationRow[];
}

// Helper Types for the new "Fund" Card Layout
interface DetailStat {
  label: string;
  value: string;
  subValue?: string;
  highlight?: boolean;
}

interface ComparisonRowData {
  label: string;
  value: string;
  change?: string;
  isPositiveChange?: boolean;
}

interface FundCardProps {
  title: string;
  idTag: string;
  mainLabel: string;
  mainValue: string;
  mainDate: string;
  stats: DetailStat[];
  comparisonRows: ComparisonRowData[];
  gradientClass: string;
  shadowClass: string;
  icon: React.ReactNode;
  shapes: React.ReactNode;
}

// Reuseable "Fund Detail" Style Card Component
const FundCard: React.FC<FundCardProps> = ({
  title,
  idTag,
  mainLabel,
  mainValue,
  mainDate,
  stats,
  comparisonRows,
  gradientClass,
  shadowClass,
  icon,
  shapes
}) => {
  return (
    <div className={`relative overflow-hidden rounded-[32px] ${gradientClass} p-0 text-white group hover:-translate-y-2 transition-transform duration-500 ${shadowClass}`}>
      {/* Background Shapes */}
      {shapes}
      
      <div className="relative z-10 flex flex-col h-full">
        
        {/* HEADER: Title & ID */}
        <div className="px-6 pt-6 pb-2 flex items-start justify-between">
           <div>
               <div className="flex items-center gap-2 mb-1">
                   <div className="w-1 h-8 bg-white/40 rounded-full"></div>
                   <h3 className="text-xl font-bold tracking-tight">{title}</h3>
               </div>
               <p className="text-[10px] text-white/60 font-medium uppercase tracking-widest pl-3">{idTag}</p>
           </div>
           <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
               {icon}
           </div>
        </div>

        {/* BODY: Main Value & Stats */}
        <div className="px-6 py-4 flex flex-col sm:flex-row gap-6">
            {/* Left: Big NAV Value */}
            <div className="flex-1">
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">{mainLabel}</p>
                <h2 className="text-3xl font-extrabold tracking-tight">{mainValue}</h2>
                <p className="text-[10px] text-white/50 font-medium mt-1">{mainDate}</p>
            </div>

            {/* Right: High/Low Stats */}
            <div className="flex flex-col justify-center gap-3 min-w-[100px]">
                {stats.map((stat, idx) => (
                    <div key={idx} className="text-right">
                        <p className="text-[9px] font-bold text-white/60 uppercase tracking-wider">{stat.label}</p>
                        <p className={`text-sm font-bold ${stat.highlight ? 'text-emerald-300' : 'text-white'}`}>{stat.value}</p>
                        {stat.subValue && <p className="text-[9px] text-white/40">{stat.subValue}</p>}
                    </div>
                ))}
            </div>
        </div>

        {/* DIVIDER */}
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        {/* FOOTER: Comparison Table */}
        <div className="px-6 py-4 flex-1">
            <div className="space-y-3">
                {comparisonRows.map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>}
                             {idx === 1 && <Info className="w-3 h-3 text-white/40" />}
                             <span className="text-[10px] font-bold text-white/80 w-24 truncate">{row.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                             <span className="text-sm font-mono font-bold text-white">{row.value}</span>
                             {row.change && (
                                 <span className={`text-[10px] font-bold ${row.isPositiveChange ? 'text-emerald-300' : 'text-red-300'}`}>
                                     {row.change}
                                 </span>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        {/* BOTTOM TABS: Visual Strip */}
        <div className="bg-black/10 backdrop-blur-sm border-t border-white/5 px-6 py-3 flex items-center justify-between text-[10px] font-bold text-white/60 tracking-wider uppercase">
             <div className="flex gap-4">
                 <span className="text-white border-b-2 border-white pb-0.5">1 Month</span>
                 <span className="hover:text-white cursor-pointer transition-colors">1 Year</span>
                 <span className="hover:text-white cursor-pointer transition-colors">3 Years</span>
                 <span className="hover:text-white cursor-pointer transition-colors">5 Years</span>
             </div>
        </div>

      </div>
    </div>
  );
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, comparisonSummary, isComparisonActive, schedule }) => {
  const activeSummary = isComparisonActive && comparisonSummary ? comparisonSummary : summary;
  
  // Data Extraction for "Fund" Style Details
  const firstMonth = schedule[0] || { principalComponent: 0, interestComponent: 0 };
  const currentEMI = activeSummary.monthlyEMI;
  const emiPrincipalPart = firstMonth.principalComponent;
  const emiInterestPart = firstMonth.interestComponent;

  const totalSaved = isComparisonActive && comparisonSummary 
    ? summary.totalPayment - comparisonSummary.totalPayment 
    : 0;

  const interestSaved = isComparisonActive && comparisonSummary
    ? summary.totalInterest - comparisonSummary.totalInterest
    : 0;
  
  const monthsSaved = isComparisonActive && comparisonSummary
    ? summary.totalMonths - comparisonSummary.totalMonths
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* 1. EMI CARD */}
      <FundCard 
        title="Monthly Payment"
        idTag="EMI/REGULAR/2024"
        gradientClass="bg-gradient-to-bl from-[#4c36f5] to-[#2b5ae6]"
        shadowClass="shadow-[0_20px_50px_-12px_rgba(76,54,245,0.4)]"
        mainLabel="Current Installment"
        mainValue={formatCurrencyDecimal(activeSummary.monthlyEMI)}
        mainDate={`Due: ${new Date().toLocaleDateString('en-IN', {month:'short', day:'numeric'})}`}
        icon={<Wallet className="w-5 h-5 text-white" />}
        shapes={
            <>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
             <svg className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-[#00c6ff]/20" viewBox="0 0 100 100" fill="currentColor">
                <path d="M30 10 Q 50 50 80 30 T 90 90 T 30 90 Z" />
             </svg>
            </>
        }
        stats={[
            { label: "Principal Part", value: formatCurrencyCompact(emiPrincipalPart) },
            { label: "Interest Part", value: formatCurrencyCompact(emiInterestPart) }
        ]}
        comparisonRows={[
            { 
                label: "*Baseline EMI", 
                value: formatCurrencyCompact(summary.monthlyEMI),
                change: isComparisonActive && comparisonSummary ? `${((comparisonSummary.monthlyEMI - summary.monthlyEMI)/summary.monthlyEMI * 100).toFixed(1)}%` : undefined,
                isPositiveChange: false
            },
            { label: "*Optimized EMI", value: formatCurrencyCompact(activeSummary.monthlyEMI) }
        ]}
      />

      {/* 2. INTEREST CARD */}
      <FundCard 
        title="Total Interest"
        idTag="INT/ACCCRUAL/FIXED"
        gradientClass="bg-gradient-to-tr from-[#ec4899] to-[#8b5cf6]"
        shadowClass="shadow-[0_20px_50px_-12px_rgba(236,72,153,0.4)]"
        mainLabel="Cost of Borrowing"
        mainValue={formatCurrencyCompact(activeSummary.totalInterest)}
        mainDate="Lifetime Interest"
        icon={<TrendingUp className="w-5 h-5 text-white" />}
        shapes={
             <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        }
        stats={[
            { label: "Avg Monthly", value: formatCurrencyCompact(activeSummary.totalInterest / activeSummary.totalMonths) },
            { label: "Saved", value: formatCurrencyCompact(interestSaved), highlight: true }
        ]}
        comparisonRows={[
            { 
                label: "*Standard Plan", 
                value: formatCurrencyCompact(summary.totalInterest),
            },
            { 
                label: "*Smart Plan", 
                value: formatCurrencyCompact(activeSummary.totalInterest),
                change: isComparisonActive ? `-${((interestSaved)/summary.totalInterest * 100).toFixed(1)}%` : undefined,
                isPositiveChange: true
            }
        ]}
      />

      {/* 3. TOTAL PAYMENT CARD */}
      <FundCard 
        title="Total Payment"
        idTag="GROSS/OUTFLOW/NET"
        gradientClass="bg-gradient-to-br from-[#06b6d4] to-[#10b981]"
        shadowClass="shadow-[0_20px_50px_-12px_rgba(6,182,212,0.4)]"
        mainLabel="Principal + Interest"
        mainValue={formatCurrencyCompact(activeSummary.totalPayment)}
        mainDate="Total Repayment"
        icon={<PiggyBank className="w-5 h-5 text-white" />}
        shapes={
             <svg className="absolute top-10 left-[-20px] w-20 h-20 text-white/10 animate-pulse-slow" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
             </svg>
        }
        stats={[
            { label: "Loan Amount", value: formatCurrencyCompact(activeSummary.totalPayment - activeSummary.totalInterest) },
            { label: "Efficiency", value: `${((activeSummary.totalPayment - activeSummary.totalInterest)/activeSummary.totalPayment * 100).toFixed(0)}%` }
        ]}
        comparisonRows={[
            { 
                label: "*Total Base", 
                value: formatCurrencyCompact(summary.totalPayment),
            },
            { 
                label: "*Total Smart", 
                value: formatCurrencyCompact(activeSummary.totalPayment),
                change: isComparisonActive ? `-${((totalSaved)/summary.totalPayment * 100).toFixed(1)}%` : undefined,
                isPositiveChange: true
            }
        ]}
      />

      {/* 4. DATE CARD */}
      <FundCard 
        title="Payoff Schedule"
        idTag="DATE/MATURITY/20XX"
        gradientClass="bg-gradient-to-br from-[#3b82f6] to-[#6366f1]"
        shadowClass="shadow-[0_20px_50px_-12px_rgba(59,130,246,0.4)]"
        mainLabel="Debt Free Date"
        mainValue={activeSummary.payoffDate.split(' ')[1]}
        mainDate={activeSummary.payoffDate.split(' ')[0]}
        icon={<CalendarCheck className="w-5 h-5 text-white" />}
        shapes={
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        }
        stats={[
            { label: "Tenure", value: `${activeSummary.totalMonths} M` },
            { label: "Time Saved", value: `${monthsSaved} M`, highlight: true }
        ]}
        comparisonRows={[
            { 
                label: "*Standard End", 
                value: summary.payoffDate.split(' ')[1],
            },
            { 
                label: "*Smart End", 
                value: activeSummary.payoffDate.split(' ')[1],
                change: isComparisonActive && monthsSaved > 0 ? `${(monthsSaved/12).toFixed(1)} Yr Earlier` : undefined,
                isPositiveChange: true
            }
        ]}
      />

    </div>
  );
};

export default SummaryCards;
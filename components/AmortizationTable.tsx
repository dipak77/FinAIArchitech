import React, { useState } from 'react';
import { AmortizationRow } from '../types';
import { formatCurrencyDecimal, formatCurrencyCompact } from '../utils/loanMath';
import { TrendingDown, CheckCircle, Eye, EyeOff, Table as TableIcon } from 'lucide-react';

interface AmortizationTableProps {
  schedule: AmortizationRow[];
  comparisonSchedule?: AmortizationRow[]; 
  isComparisonActive?: boolean;
  comparisonLabel?: string;
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ 
    schedule, 
    comparisonSchedule, 
    isComparisonActive,
    comparisonLabel = "Smart Plan"
}) => {
  const [viewMode, setViewMode] = useState<'standard' | 'comparison'>('comparison');
  
  const primarySchedule = isComparisonActive && comparisonSchedule ? comparisonSchedule : schedule;
  
  const getOriginal = (month: number, field: keyof AmortizationRow): number => {
    if (!comparisonSchedule || !schedule[month - 1]) return 0;
    const val = schedule[month - 1][field];
    return typeof val === 'number' ? val : 0;
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col h-[750px] relative transition-colors duration-300 shadow-[0_20px_40px_-12px_rgba(16,185,129,0.1)] dark:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)]">
      
      {/* PLEO HEADER: Blue/Indigo Geometry */}
      <div className="relative h-28 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center z-20 shrink-0">
          {/* Decor */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-4 relative z-10">
             <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner border border-white/10">
                 <TableIcon className="w-6 h-6 text-white" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Amortization</h3>
                <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[11px] text-blue-100 font-medium uppercase tracking-widest opacity-90">Schedule Breakdown</p>
                    {isComparisonActive && (
                        <span className="bg-white/20 backdrop-blur-sm border border-white/10 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                            {comparisonLabel}
                        </span>
                    )}
                </div>
             </div>
          </div>
          
          <div className="mt-4 sm:mt-0 relative z-10">
             {isComparisonActive && (
                <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl flex border border-white/10">
                    <button 
                        onClick={() => setViewMode('comparison')}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide ${viewMode === 'comparison' ? 'bg-white text-indigo-600 shadow-md' : 'text-blue-100 hover:text-white hover:bg-white/5'}`}
                    >
                        <Eye className="w-3 h-3" />
                        Diff
                    </button>
                    <button 
                         onClick={() => setViewMode('standard')}
                         className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide ${viewMode === 'standard' ? 'bg-white text-indigo-600 shadow-md' : 'text-blue-100 hover:text-white hover:bg-white/5'}`}
                    >
                        <EyeOff className="w-3 h-3" />
                        Base
                    </button>
                </div>
            )}
          </div>
      </div>
      
      <div className="overflow-auto flex-1 custom-scrollbar bg-white dark:bg-[#1e293b]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/90 dark:bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-10 shadow-sm border-b border-slate-100 dark:border-slate-700/50">
            <tr>
              <th className="py-4 px-6 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest w-28 whitespace-nowrap bg-slate-50/90 dark:bg-[#0f172a]/90 sticky left-0 z-20">Date</th>
              <th className="py-4 px-6 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Payment</th>
              <th className="py-4 px-6 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Principal</th>
              <th className="py-4 px-6 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right whitespace-nowrap border-r border-slate-100 dark:border-slate-700/50">Interest</th>
              <th className="py-4 px-6 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">Balance</th>
              {isComparisonActive && viewMode === 'comparison' && (
                  <th className="py-4 px-6 text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest text-right bg-cyan-50/50 dark:bg-cyan-900/10 whitespace-nowrap sticky right-0 z-20 backdrop-blur-md">
                    Saved
                  </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {primarySchedule.map((row) => {
                const isSmartRow = isComparisonActive && row.extraPayment > 0;
                const originalInterest = isComparisonActive ? getOriginal(row.month, 'interestComponent') : 0;
                const interestSaved = Math.max(0, originalInterest - row.interestComponent);
                const isPaid = row.isPast;

                return (
                  <tr key={row.month} className={`group transition-colors duration-150 ${isSmartRow ? 'bg-purple-50/50 dark:bg-purple-900/5 hover:bg-purple-100/50 dark:hover:bg-purple-900/10' : 'hover:bg-slate-50 dark:hover:bg-white/[0.03]'} ${isPaid ? 'opacity-60' : ''}`}>
                    <td className="py-4 px-6 bg-inherit sticky left-0 z-10 backdrop-blur-[2px] align-top">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                                #{row.month}
                            </span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                {row.paymentDate}
                            </span>
                            {isPaid && <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold flex items-center gap-1 mt-1"><CheckCircle className="w-3 h-3"/> Paid</span>}
                        </div>
                    </td>
                    
                    <td className="py-4 px-6 text-right align-top">
                        <div className="font-bold text-slate-900 dark:text-white font-mono tracking-tight text-sm">
                          {formatCurrencyDecimal(row.emi + row.extraPayment)}
                        </div>
                        {row.extraPayment > 0 && (
                            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold mt-1 inline-block px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded border border-purple-200 dark:border-purple-500/20 whitespace-nowrap">
                                +{formatCurrencyCompact(row.extraPayment)}
                            </div>
                        )}
                        <div className="mt-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                           <span className="opacity-70 font-medium uppercase text-[9px] mr-1">Paid:</span>
                           {formatCurrencyCompact(row.totalAmountPaid)}
                        </div>
                    </td>

                    <td className="py-4 px-6 text-right align-top">
                        <div className="font-mono text-sm font-medium text-cyan-700 dark:text-cyan-400">
                            {formatCurrencyDecimal(row.principalComponent)}
                        </div>
                        <div className="mt-1.5 text-[10px] font-semibold text-cyan-600/60 dark:text-cyan-400/50">
                            <span className="opacity-70 font-medium uppercase text-[9px] mr-1">Paid:</span>
                            {formatCurrencyCompact(row.totalPrincipalPaid)}
                        </div>
                    </td>
                    
                    <td className="py-4 px-6 text-right border-r border-slate-100 dark:border-slate-700/50 align-top">
                        <div className="font-mono text-sm font-medium text-rose-600 dark:text-rose-400">
                            {formatCurrencyDecimal(row.interestComponent)}
                        </div>
                        <div className="mt-1.5 text-[10px] font-semibold text-rose-600/60 dark:text-rose-400/50">
                            <span className="opacity-70 font-medium uppercase text-[9px] mr-1">Paid:</span>
                            {formatCurrencyCompact(row.totalInterestToDate)}
                        </div>
                    </td>
                    
                    <td className="py-4 px-6 text-right font-mono text-sm font-bold text-slate-700 dark:text-slate-300 align-top">
                        {formatCurrencyDecimal(row.closingBalance)}
                    </td>

                    {isComparisonActive && viewMode === 'comparison' && (
                        <td className="py-4 px-6 text-right bg-cyan-50/30 dark:bg-cyan-900/5 sticky right-0 z-10 backdrop-blur-[2px] align-top">
                            {!isPaid && interestSaved > 5 ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-end gap-1 whitespace-nowrap">
                                    <TrendingDown className="w-3 h-3" />
                                    {formatCurrencyCompact(interestSaved)}
                                </span>
                            ) : (
                                <span className="text-slate-300 dark:text-slate-700">-</span>
                            )}
                        </td>
                    )}
                  </tr>
                );
            })}
            
            {isComparisonActive && schedule.length > primarySchedule.length && (
                <tr>
                    <td colSpan={6} className="py-12 text-center bg-gradient-to-b from-cyan-50/50 to-transparent dark:from-cyan-900/20 dark:to-transparent border-t border-cyan-100 dark:border-cyan-500/20">
                        <div className="flex flex-col items-center justify-center text-cyan-700 dark:text-cyan-300 animate-pulse-slow">
                            <span className="text-2xl mb-2">🎉</span>
                            <span className="font-bold text-lg">Debt Free!</span>
                            <span className="text-xs opacity-70 mt-1 uppercase tracking-widest font-bold">
                                You skipped {schedule.length - primarySchedule.length} months of payments
                            </span>
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AmortizationTable;
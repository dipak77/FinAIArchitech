import React, { useState, useMemo, useEffect } from 'react';
import { LoanInput } from './types';
import { calculateLoanDetails } from './utils/loanMath';
import InputSection from './components/InputSection';
import SummaryCards from './components/SummaryCards';
import DashboardCharts from './components/DashboardCharts';
import AmortizationTable from './components/AmortizationTable';
import AIAdvisor from './components/AIAdvisor';
import { LayoutDashboard, FileText, Calculator, X, Command, Sun, Moon, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const today = new Date();
  const currentMonthStr = today.toISOString().split('T')[0];
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const nextMonthStr = nextMonth.toISOString().split('T')[0];

  const [loanInput, setLoanInput] = useState<LoanInput>({
    amount: 5000000, 
    interestRate: 8.5,
    tenure: 20,
    tenureType: 'years',
    startDate: currentMonthStr,
    loanType: 'Home Loan',
    prepaymentAmount: 0,
    prepaymentFrequency: 'monthly',
    prepaymentStartDate: nextMonthStr
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule'>('dashboard');
  const [isAiPlanApplied, setIsAiPlanApplied] = useState(false);

  // Calculations
  const baselineInput = useMemo(() => ({
      ...loanInput,
      prepaymentAmount: 0
  }), [loanInput]);
  
  const baselineDetails = useMemo(() => calculateLoanDetails(baselineInput), [baselineInput]);
  const actualDetails = useMemo(() => calculateLoanDetails(loanInput), [loanInput]);

  const handleLoanInputChange = (newInput: LoanInput) => {
      setLoanInput(newInput);
      setIsAiPlanApplied(false);
  };

  const handleApplySmartPlan = (amount: number) => {
      setLoanInput(prev => ({
          ...prev,
          prepaymentAmount: amount,
          prepaymentFrequency: 'monthly',
          prepaymentStartDate: nextMonthStr
      }));
      setIsAiPlanApplied(true);
  };

  const clearSmartPlan = () => {
      setLoanInput(prev => ({
          ...prev,
          prepaymentAmount: 0
      }));
      setIsAiPlanApplied(false);
  };

  // View Logic
  const isComparisonActive = loanInput.prepaymentAmount > 0;
  
  let displaySummary, displaySchedule, comparisonSummary, comparisonSchedule, comparisonLabel;

  if (isComparisonActive) {
      displaySummary = baselineDetails.summary;
      displaySchedule = baselineDetails.schedule;
      comparisonSummary = actualDetails.summary;
      comparisonSchedule = actualDetails.schedule;
      comparisonLabel = isAiPlanApplied ? "Smart Plan" : "Manual Strategy";
  } else {
      displaySummary = actualDetails.summary;
      displaySchedule = actualDetails.schedule;
      comparisonSummary = undefined;
      comparisonSchedule = undefined;
      comparisonLabel = "";
  }

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500">
      
      {/* --- AMBIENT BACKGROUNDS --- */}
      {/* Dark Mode Ambience */}
      <div className="fixed inset-0 z-0 opacity-0 dark:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px] animate-float"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[900px] h-[900px] bg-indigo-950/30 rounded-full blur-[150px]"></div>
          {/* Grain Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light"></div>
      </div>

      {/* Light Mode Ambience */}
      <div className="fixed inset-0 z-0 opacity-100 dark:opacity-0 transition-opacity duration-700 pointer-events-none bg-[#f8fafc]">
           <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-100/60 rounded-full blur-[80px] animate-float"></div>
           <div className="absolute top-[40%] right-[-5%] w-[500px] h-[500px] bg-cyan-50/80 rounded-full blur-[100px] animate-pulse-slow"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 border-b border-light-border dark:border-white/5 glass shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-cyan-500 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-light-border dark:border-white/10 shadow-sm">
                  <Command className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                Fin<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">Architect</span>
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-[0.2em] uppercase mt-0.5 opacity-80">Pro Loan Analytics</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme}
               className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95 overflow-hidden group/theme"
               aria-label="Toggle Theme"
             >
                <div className="relative z-10">
                   {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-indigo-500" />}
                </div>
             </button>

            {/* Nav Pills */}
            <nav className="flex bg-slate-100/50 dark:bg-black/20 p-1.5 rounded-2xl border border-light-border dark:border-white/5 backdrop-blur-sm">
                <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2 ${
                    activeTab === 'dashboard' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/10' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5'
                }`}
                >
                <LayoutDashboard className="w-4 h-4 mb-0.5" />
                Overview
                </button>
                <button
                onClick={() => setActiveTab('schedule')}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2 ${
                    activeTab === 'schedule' 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/10' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5'
                }`}
                >
                <FileText className="w-4 h-4 mb-0.5" />
                Schedule
                </button>
            </nav>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Comparison Alert Banner */}
        {isComparisonActive && (
            <div className={`mb-8 p-1 rounded-2xl bg-gradient-to-r animate-slide-up shadow-2xl ${isAiPlanApplied ? 'from-purple-500/20 to-cyan-500/20' : 'from-cyan-500/20 to-emerald-500/20'}`}>
                <div className="bg-white/60 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl p-4 flex items-center justify-between border border-white/20 dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${isAiPlanApplied ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300' : 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300'}`}>
                            {isAiPlanApplied ? <Sparkles className="w-5 h-5" /> : <Calculator className="w-5 h-5" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                {isAiPlanApplied ? "AI Strategy Active" : "Manual Simulation Active"}
                                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2 py-0.5 rounded-full opacity-80">Beta</span>
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                                {isAiPlanApplied 
                                  ? "Comparing AI-optimized prepayment strategy against your baseline." 
                                  : `Simulating extra ₹${loanInput.prepaymentAmount.toLocaleString('en-IN')} payments ${loanInput.prepaymentFrequency}.`
                                }
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={clearSmartPlan}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors group"
                        title="Clear Simulation"
                    >
                        <X className="w-5 h-5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input (Expanded to be standalone since AI moved) */}
          <div className="xl:col-span-3 xl:sticky xl:top-28 space-y-6">
             <div className="animate-slide-up [animation-delay:0ms]">
                <InputSection input={loanInput} onChange={handleLoanInputChange} />
             </div>
          </div>

          {/* Right Column: Data Visualization */}
          <div className="xl:col-span-9 space-y-8">
            
            {/* KPI Cards */}
            <div className="animate-slide-up [animation-delay:300ms]">
               <SummaryCards 
                    summary={displaySummary} 
                    comparisonSummary={comparisonSummary}
                    isComparisonActive={isComparisonActive}
                />
            </div>

            {activeTab === 'dashboard' ? (
              <div className="animate-fade-in space-y-8">
                <DashboardCharts 
                    summary={displaySummary} 
                    schedule={displaySchedule}
                    comparisonSchedule={comparisonSchedule}
                    isComparisonActive={isComparisonActive}
                    comparisonLabel={comparisonLabel}
                />
                
                {/* Mini Schedule Preview */}
                <div className="glass dark:bg-dark-card rounded-[32px] p-8 shadow-xl border border-light-border dark:border-dark-border relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 dark:bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/10 transition-colors duration-500"></div>
                  
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Schedule Preview</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">First 5 months breakdown</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('schedule')}
                      className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 px-5 py-2.5 rounded-xl transition-all bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                      View Full Schedule
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left">
                      <thead className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500 border-b border-light-border dark:border-white/5">
                        <tr>
                           <th className="px-6 py-4">Month</th>
                           <th className="px-6 py-4">Date</th>
                           <th className="px-6 py-4 text-right">EMI</th>
                           <th className="px-6 py-4 text-right">Principal</th>
                           <th className="px-6 py-4 text-right">Interest</th>
                           <th className="px-6 py-4 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-light-border dark:divide-white/5 text-sm font-medium">
                        {(comparisonSchedule || displaySchedule).slice(0, 5).map(row => (
                           <tr key={row.month} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 text-slate-900 dark:text-slate-200">{row.month}</td>
                              <td className="px-6 py-4 text-slate-500">{row.paymentDate}</td>
                              <td className="px-6 py-4 text-right font-mono text-slate-900 dark:text-white">{(row.emi + row.extraPayment).toFixed(0)}</td>
                              <td className="px-6 py-4 text-right font-mono text-cyan-600 dark:text-cyan-400">{row.principalComponent.toFixed(0)}</td>
                              <td className="px-6 py-4 text-right font-mono text-purple-600 dark:text-purple-400">{row.interestComponent.toFixed(0)}</td>
                              <td className="px-6 py-4 text-right font-mono text-slate-500">{row.closingBalance.toFixed(0)}</td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                 <AmortizationTable 
                    schedule={displaySchedule}
                    comparisonSchedule={comparisonSchedule}
                    isComparisonActive={isComparisonActive}
                    comparisonLabel={comparisonLabel}
                 />
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-light-border dark:border-white/5 text-center text-slate-400 dark:text-slate-600 text-xs font-semibold tracking-widest uppercase bg-light-bg dark:bg-dark-bg">
         <p>Smart Loan Architect • AI Powered • 2024</p>
      </footer>
      
      {/* Global AI Chat Widget */}
      <AIAdvisor input={loanInput} summary={baselineDetails.summary} />
    </div>
  );
};

export default App;
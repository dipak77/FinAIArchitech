import React from 'react';
import { LoanInput } from '../types';
import { IndianRupee, Percent, Clock, Settings2, PlusCircle, CalendarDays, Layers } from 'lucide-react';

interface InputSectionProps {
  input: LoanInput;
  onChange: (input: LoanInput) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ input, onChange }) => {
  const handleChange = (field: keyof LoanInput, value: number | string) => {
    onChange({ ...input, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-100 dark:border-slate-700 relative overflow-hidden transition-all duration-300 shadow-[0_20px_40px_-12px_rgba(79,70,229,0.1)] dark:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)] group">
      
      {/* --- PLEO STYLE TITLE HEADER: Indigo/Violet Geometry --- */}
      <div className="relative h-28 bg-gradient-to-r from-[#6366f1] to-[#a855f7] overflow-hidden p-6 flex items-center justify-between z-10">
          {/* Decorative Shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <svg className="absolute bottom-[-10px] left-[-10px] w-24 h-24 text-white/10" viewBox="0 0 100 100" fill="currentColor">
               <circle cx="50" cy="50" r="40" />
          </svg>
          <div className="absolute top-4 right-20 w-3 h-3 bg-cyan-300 rounded-full opacity-60"></div>
          <div className="absolute bottom-8 right-10 w-2 h-2 bg-pink-300 rounded-full opacity-60"></div>

          {/* Content */}
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner border border-white/10">
               <Settings2 className="w-6 h-6 text-white" />
            </div>
            <div>
               <h2 className="text-xl font-bold text-white tracking-tight">Configuration</h2>
               <p className="text-[11px] text-indigo-100 font-medium uppercase tracking-widest opacity-90">Loan Parameters</p>
            </div>
          </div>
      </div>

      <div className="p-8 space-y-8 relative z-10">
        
        {/* Loan Amount */}
        <div className="group/input">
          <div className="flex justify-between items-center mb-3 px-1">
            <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Loan Amount</label>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 rounded-lg">
              ₹ {input.amount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <IndianRupee className="h-5 w-5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" />
            </div>
            <input
              type="number"
              min="1000"
              step="5000"
              value={input.amount}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
              className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-bold text-lg relative z-0 placeholder-slate-400"
            />
          </div>
          <div className="px-1">
            <input
              type="range"
              min="10000"
              max="10000000"
              step="10000"
              value={input.amount}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
              style={{ 
                  '--range-progress': `${(input.amount - 10000) * 100 / (10000000 - 10000)}%`,
                  '--range-color': '#6366f1'
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Interest Rate */}
        <div className="group/input">
           <div className="flex justify-between items-center mb-3 px-1">
            <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Interest Rate</label>
             <span className="text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 px-2.5 py-1 rounded-lg">
              {input.interestRate}%
            </span>
          </div>
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Percent className="h-5 w-5 text-slate-400 group-focus-within/input:text-purple-500 transition-colors" />
            </div>
            <input
              type="number"
              min="0.1"
              max="30"
              step="0.1"
              value={input.interestRate}
              onChange={(e) => handleChange('interestRate', parseFloat(e.target.value) || 0)}
               className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 dark:text-white font-bold text-lg relative z-0"
            />
          </div>
          <div className="px-1">
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={input.interestRate}
              onChange={(e) => handleChange('interestRate', parseFloat(e.target.value))}
               style={{ 
                   '--range-progress': `${(input.interestRate - 1) * 100 / (20 - 1)}%`,
                   '--range-color': '#a855f7'
               } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Tenure & Unit */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 group/input">
            <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">Tenure</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Clock className="h-5 w-5 text-slate-400 group-focus-within/input:text-cyan-500 transition-colors" />
              </div>
              <input
                type="number"
                min="1"
                max={input.tenureType === 'years' ? 40 : 480}
                value={input.tenure}
                onChange={(e) => handleChange('tenure', parseFloat(e.target.value) || 0)}
                 className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-900 dark:text-white font-bold text-lg"
              />
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">Unit</label>
            <div className="relative h-full">
              <select
                value={input.tenureType}
                onChange={(e) => handleChange('tenureType', e.target.value as 'years' | 'months')}
                 className="block w-full h-[60px] pl-3 pr-8 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 transition-all text-slate-700 dark:text-white font-bold text-sm appearance-none cursor-pointer"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Settings */}
        <div className="pt-6 border-t border-dashed border-slate-100 dark:border-slate-700/50 space-y-4">
            {/* Loan Type */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Layers className="h-4 w-4 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-200" />
                </div>
                <select
                    value={input.loanType}
                    onChange={(e) => handleChange('loanType', e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 transition-all text-slate-600 dark:text-slate-300 font-semibold text-xs appearance-none cursor-pointer"
                >
                    <option value="Home Loan">Home Loan</option>
                    <option value="Car Loan">Car Loan</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Education Loan">Education Loan</option>
                    <option value="Business Loan">Business Loan</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            {/* Start Date */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <CalendarDays className="h-4 w-4 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-slate-200" />
                </div>
                <input
                    type="date"
                    value={input.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 transition-all text-slate-600 dark:text-slate-300 font-semibold text-xs cursor-pointer uppercase dark:color-scheme-dark"
                />
            </div>
        </div>

        {/* Manual Prepayment Configuration */}
        <div className="pt-6 border-t border-dashed border-slate-100 dark:border-slate-700/50">
             <div className="flex items-center gap-2 mb-4">
                 <div className="p-1 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg shadow-lg shadow-emerald-500/20">
                    <PlusCircle className="w-3.5 h-3.5 text-white" />
                 </div>
                 <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Extra Prepayment</label>
             </div>
             
             <div className="grid grid-cols-1 gap-3">
                 {/* Amount */}
                 <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <IndianRupee className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500" />
                    </div>
                    <input 
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="Ex. 5000"
                        value={input.prepaymentAmount || ''}
                        onChange={(e) => handleChange('prepaymentAmount', parseFloat(e.target.value) || 0)}
                        className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 dark:text-white text-sm font-bold placeholder-slate-400/70"
                    />
                 </div>

                 {/* Frequency & Start Date */}
                 <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <select
                            value={input.prepaymentFrequency}
                            onChange={(e) => handleChange('prepaymentFrequency', e.target.value as any)}
                            className="block w-full pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-semibold appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <div className="relative">
                        <input
                            type="date"
                            value={input.prepaymentStartDate}
                            onChange={(e) => handleChange('prepaymentStartDate', e.target.value)}
                            className="block w-full pl-3 pr-2 py-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer dark:color-scheme-dark focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default InputSection;
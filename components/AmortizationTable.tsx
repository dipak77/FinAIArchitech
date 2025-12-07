import React, { useState } from 'react';
import { AmortizationRow } from '../types';
import { formatCurrency, formatCurrencyCompact } from '../utils/loanMath';
import { Download, FileSpreadsheet, Grid3X3, ArrowDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  comparisonLabel = "Optimized"
}) => {
  const [viewMode, setViewMode] = useState<'standard' | 'comparison'>('standard');
  const primarySchedule = isComparisonActive && viewMode === 'comparison' && comparisonSchedule ? comparisonSchedule : schedule;

  // Helper to find original value for comparison
  const getOriginal = (month: number, field: keyof AmortizationRow) => {
      if (!schedule || !isComparisonActive) return 0;
      const row = schedule.find(r => r.month === month);
      return row ? (row[field] as number) : 0;
  };

  const handleExportCSV = () => {
    const headers = ["Month", "Date", "EMI", "Extra Payment", "Principal", "Interest", "Balance"];
    const rows = primarySchedule.map(row => [
      row.month,
      row.paymentDate,
      (row.emi).toFixed(0),
      (row.extraPayment).toFixed(0),
      (row.principalComponent).toFixed(0),
      (row.interestComponent).toFixed(0),
      (row.closingBalance).toFixed(0)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `amortization_schedule_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
  
      const pageWidth = doc.internal.pageSize.getWidth();      // 210
      const marginX = 4;                                       // Minimized margin
  
      // ---------- BRAND HEADER ----------
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(79, 70, 229);
      doc.text("FinArchitect", marginX, 10);
  
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Amortization Schedule", marginX, 14);
  
      const dateStr = new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  
      doc.setFontSize(7);
      doc.text(`Generated: ${dateStr}`, pageWidth - marginX, 10, { align: "right" });
  
      if (isComparisonActive) {
        doc.setTextColor(16, 185, 129);
        doc.text(
          `Active Plan: ${comparisonLabel}`,
          pageWidth - marginX,
          14,
          { align: "right" }
        );
      }
  
      // ---------- TABLE DATA ----------
      const head: string[] = ["Mo/Date", "Payment Breakdown", "Principal", "Interest", "Balance"];
      if (isComparisonActive && viewMode === "comparison") {
        head.push("Saved");
      }
  
      const body: any[] = [];
  
      // Helper for Integer Currency (No decimals)
      const fmt = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
      };
  
      primarySchedule.forEach((row) => {
        const emiTotal = row.emi + row.extraPayment;
  
        const dateCell = `#${row.month}\n${row.paymentDate}`;
  
        // Payment: Line 1 = Monthly, Line 2 = Cumulative
        // Raw string concatenation to ensure no "Paid:" label
        let paymentCell = fmt(emiTotal);
        if (row.extraPayment > 0) paymentCell += `\n+${fmt(row.extraPayment)}`;
        paymentCell += `\n${fmt(row.totalAmountPaid)}`;
  
        // Principal
        const principalCell = `${fmt(row.principalComponent)}\n${fmt(row.totalPrincipalPaid)}`;
  
        // Interest
        const interestCell = `${fmt(row.interestComponent)}\n${fmt(row.totalInterestToDate)}`;
  
        // Balance
        const balanceCell = fmt(row.closingBalance);
  
        const rowData: any[] = [
          dateCell,
          paymentCell,
          principalCell,
          interestCell,
          balanceCell,
        ];
  
        if (isComparisonActive && viewMode === "comparison") {
          const originalInterest = getOriginal(row.month, "interestComponent");
          const interestSaved = Math.max(0, originalInterest - row.interestComponent);
          rowData.push(interestSaved > 5 ? fmt(interestSaved) : "-");
        }
  
        body.push(rowData);
      });
  
      // ---------- COLUMN WIDTHS ----------
      // A4 Width ~210mm. Margins 4mm each => 202mm usable.
      
      const columnStyles: any = {
        0: { cellWidth: 22, halign: "left", textColor: [100, 116, 139] },
        1: { cellWidth: 40, halign: "left" },
        2: { cellWidth: 40, halign: "left" },
        3: { cellWidth: 40, halign: "left" },
        4: { cellWidth: 'auto', halign: "left", fontStyle: "bold" }, // Balance gets remaining
      };
  
      if (isComparisonActive && viewMode === "comparison") {
        columnStyles[4] = { cellWidth: 40, halign: "right", fontStyle: "bold" };
        columnStyles[5] = { cellWidth: 15, halign: "right", textColor: [16, 185, 129] };
      }
  
      // ---------- AUTOTABLE OPTIONS ----------
      autoTable(doc, {
        startY: 18,
        head: [head],
        body,
        theme: "grid",
        margin: { top: 18, left: marginX, right: marginX },
        styles: {
          font: "helvetica",
          fontSize: 6,               // MICRO FONT 6pt
          cellPadding: { top: 1, right: 1, bottom: 1, left: 1 },
          overflow: "linebreak",
          valign: "middle",
          lineWidth: 0.1,
          lineColor: [226, 232, 240],
        },
        headStyles: {
          fillColor: [67, 56, 202], // Indigo-700
          textColor: 255,
          fontStyle: "bold",
          fontSize: 7,
          halign: "center",
          valign: "middle",
        },
        columnStyles,
        didDrawPage: (data) => {
          doc.setFontSize(6);
          doc.setTextColor(148, 163, 184);
          doc.text(
            `Page ${doc.getNumberOfPages()}`,
            pageWidth - marginX,
            doc.internal.pageSize.getHeight() - 5,
            { align: "right" }
          );
        },
      });
  
      doc.save(`FinArchitect_Schedule.pdf`);
    } catch (e) {
      console.error("PDF Error", e);
      alert("PDF generation failed. Check console.");
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-100 dark:border-slate-700 relative overflow-hidden shadow-[0_20px_40px_-12px_rgba(79,70,229,0.1)] dark:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4)] flex flex-col h-[800px]">
      
      {/* PLEO HEADER: Blue/Indigo Geometry */}
      <div className="relative h-28 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] p-6 flex items-center justify-between z-10 shrink-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner border border-white/10">
               <Grid3X3 className="w-6 h-6 text-white" />
            </div>
            <div>
               <h2 className="text-xl font-bold text-white tracking-tight">Amortization</h2>
               <p className="text-[11px] text-blue-100 font-medium uppercase tracking-widest opacity-90">Detailed Schedule</p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            {isComparisonActive && (
                 <div className="flex bg-black/20 p-1 rounded-xl backdrop-blur-md border border-white/10 mr-2">
                    <button 
                        onClick={() => setViewMode('standard')}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${viewMode === 'standard' ? 'bg-white text-blue-600 shadow-sm' : 'text-white/70 hover:text-white'}`}
                    >
                        Standard
                    </button>
                    <button 
                        onClick={() => setViewMode('comparison')}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${viewMode === 'comparison' ? 'bg-emerald-400 text-emerald-950 shadow-sm' : 'text-white/70 hover:text-white'}`}
                    >
                        Compare
                    </button>
                 </div>
            )}

            <button 
                onClick={handleExportCSV}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition-colors border border-white/10"
                title="Download CSV"
            >
                <FileSpreadsheet className="w-5 h-5" />
            </button>
            <button 
                onClick={handleExportPDF}
                className="p-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl shadow-lg shadow-blue-900/20 transition-all border border-white/10"
                title="Download PDF"
            >
                <Download className="w-5 h-5" />
            </button>
          </div>
      </div>

      {/* TABLE HEADER (Sticky) */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-white/5 px-6 py-4 grid grid-cols-12 gap-4 sticky top-0 z-20 shrink-0 text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-slate-500">
        <div className="col-span-1">Month</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-2 text-right">Payment</div>
        <div className="col-span-2 text-right">Principal</div>
        <div className="col-span-2 text-right">Interest</div>
        <div className={`text-right ${isComparisonActive && viewMode === 'comparison' ? 'col-span-2' : 'col-span-3'}`}>Balance</div>
        {isComparisonActive && viewMode === 'comparison' && (
            <div className="col-span-1 text-right text-emerald-500">Saved</div>
        )}
      </div>

      {/* SCROLLABLE BODY */}
      <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
        {primarySchedule.map((row) => {
             const originalInterest = getOriginal(row.month, 'interestComponent');
             const interestSaved = Math.max(0, originalInterest - row.interestComponent);

             return (
                <div key={row.month} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] rounded-xl transition-colors border-b border-slate-50 dark:border-white/[0.02] last:border-0">
                    <div className="px-4 py-3 grid grid-cols-12 gap-4 items-center">
                        
                        {/* Month */}
                        <div className="col-span-1 text-xs font-bold text-slate-400">#{row.month}</div>
                        
                        {/* Date */}
                        <div className="col-span-2">
                            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{row.paymentDate}</div>
                            {row.isPast && <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Paid</div>}
                        </div>

                        {/* Payment */}
                        <div className="col-span-2 text-right">
                             <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(row.emi + row.extraPayment)}</div>
                             {row.extraPayment > 0 && (
                                <div className="text-[10px] text-emerald-500 font-bold">+ {formatCurrencyCompact(row.extraPayment)}</div>
                             )}
                             <div className="text-[10px] text-slate-400 font-medium mt-0.5">Total: {formatCurrencyCompact(row.totalAmountPaid)}</div>
                        </div>

                        {/* Principal */}
                        <div className="col-span-2 text-right">
                            <div className="text-sm font-medium text-cyan-600 dark:text-cyan-400 font-mono">{formatCurrency(row.principalComponent)}</div>
                            <div className="text-[10px] text-cyan-600/60 dark:text-cyan-400/60 font-medium mt-0.5">Total: {formatCurrencyCompact(row.totalPrincipalPaid)}</div>
                        </div>

                        {/* Interest */}
                        <div className="col-span-2 text-right">
                            <div className="text-sm font-medium text-purple-600 dark:text-purple-400 font-mono">{formatCurrency(row.interestComponent)}</div>
                             <div className="text-[10px] text-purple-600/60 dark:text-purple-400/60 font-medium mt-0.5">Total: {formatCurrencyCompact(row.totalInterestToDate)}</div>
                        </div>

                        {/* Balance */}
                        <div className={`text-right ${isComparisonActive && viewMode === 'comparison' ? 'col-span-2' : 'col-span-3'}`}>
                             <div className="text-sm font-bold text-slate-600 dark:text-slate-400 font-mono">{formatCurrency(row.closingBalance)}</div>
                             <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full mt-2 overflow-hidden">
                                <div 
                                    className="h-full bg-slate-300 dark:bg-slate-500" 
                                    style={{ width: `${(row.closingBalance / (row.closingBalance + row.totalPrincipalPaid)) * 100}%` }}
                                ></div>
                             </div>
                        </div>

                        {/* Saved (Comparison) */}
                        {isComparisonActive && viewMode === 'comparison' && (
                            <div className="col-span-1 text-right">
                                {interestSaved > 10 ? (
                                    <div className="text-xs font-bold text-emerald-500 flex items-center justify-end gap-1">
                                        <ArrowDown className="w-3 h-3" />
                                        {formatCurrencyCompact(interestSaved)}
                                    </div>
                                ) : (
                                    <span className="text-slate-300">-</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
             );
        })}
      </div>
    </div>
  );
};

export default AmortizationTable;
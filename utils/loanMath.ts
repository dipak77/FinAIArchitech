import { LoanInput, AmortizationRow, LoanSummary } from '../types';

export const calculateLoanDetails = (input: LoanInput): { summary: LoanSummary; schedule: AmortizationRow[] } => {
  const principal = input.amount;
  
  // Parse Dates
  const loanStartDateObj = new Date(input.startDate);
  // Default to today if invalid
  if (isNaN(loanStartDateObj.getTime())) {
     loanStartDateObj.setTime(Date.now());
  }

  const prepayStartDateObj = new Date(input.prepaymentStartDate);
  
  // Normalize prepay date to start of month for consistent diff calculation
  const effectivePrepayStart = new Date(prepayStartDateObj.getFullYear(), prepayStartDateObj.getMonth(), 1);

  const currentDate = new Date();
  
  // Handle edge case where rate is 0
  if (input.interestRate === 0) {
    const totalMonths = input.tenureType === 'years' ? input.tenure * 12 : input.tenure;
    const baseEmi = principal / totalMonths;
    const schedule: AmortizationRow[] = [];
    let balance = principal;
    
    let i = 1;
    while (balance > 0.1 && i <= totalMonths * 2) {
      // Calculate row date
      const rowDate = new Date(loanStartDateObj);
      rowDate.setMonth(loanStartDateObj.getMonth() + i - 1);
      
      // Determine Extra Payment
      let extraPay = 0;
      const rowDateStartOfMonth = new Date(rowDate.getFullYear(), rowDate.getMonth(), 1);
      
      if (input.prepaymentAmount > 0 && rowDateStartOfMonth >= effectivePrepayStart) {
          const diffMonths = (rowDate.getFullYear() - effectivePrepayStart.getFullYear()) * 12 + (rowDate.getMonth() - effectivePrepayStart.getMonth());
          
          let isDue = false;
          if (input.prepaymentFrequency === 'monthly') isDue = true;
          else if (input.prepaymentFrequency === 'quarterly') isDue = diffMonths % 3 === 0;
          else if (input.prepaymentFrequency === 'yearly') isDue = diffMonths % 12 === 0;
          
          if (isDue) extraPay = input.prepaymentAmount;
      }

      const totalPay = baseEmi + extraPay;
      const payment = Math.min(balance, totalPay);
      const closing = balance - payment;
      
      // Calculate cumulative
      const totalPrincipalPaid = principal - closing;
      const totalAmountPaid = totalPrincipalPaid; // Interest is 0

      schedule.push({
        month: i,
        paymentDate: rowDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        isPast: rowDate < currentDate,
        openingBalance: balance,
        emi: baseEmi,
        extraPayment: Math.max(0, payment - baseEmi),
        principalComponent: payment,
        interestComponent: 0,
        closingBalance: closing,
        totalInterestToDate: 0,
        totalPrincipalPaid: totalPrincipalPaid,
        totalAmountPaid: totalAmountPaid
      });
      balance = closing;
      if (balance <= 0.01) break;
      i++;
    }

    const lastRowDate = schedule.length > 0 
        ? schedule[schedule.length - 1].paymentDate 
        : loanStartDateObj.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    return {
      summary: {
        monthlyEMI: baseEmi,
        totalInterest: 0,
        totalPayment: principal,
        payoffDate: lastRowDate,
        totalMonths: schedule.length
      },
      schedule
    };
  }

  const annualRate = input.interestRate;
  const monthlyRate = annualRate / 12 / 100;
  const maxMonths = input.tenureType === 'years' ? input.tenure * 12 : input.tenure;

  // Standard EMI Formula
  const baseEmi = (principal * monthlyRate * Math.pow(1 + monthlyRate, maxMonths)) / (Math.pow(1 + monthlyRate, maxMonths) - 1);

  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  
  let currentMonth = 1;

  // We loop until balance is zero
  while (balance > 10 && currentMonth <= maxMonths * 3) {
    const interestForMonth = balance * monthlyRate;
    
    // Calculate row date
    const rowDate = new Date(loanStartDateObj);
    rowDate.setMonth(loanStartDateObj.getMonth() + currentMonth - 1);
    
    // Determine Extra Payment
    let extraPay = 0;
    const rowDateStartOfMonth = new Date(rowDate.getFullYear(), rowDate.getMonth(), 1);
    
    if (input.prepaymentAmount > 0 && rowDateStartOfMonth >= effectivePrepayStart) {
        const diffMonths = (rowDate.getFullYear() - effectivePrepayStart.getFullYear()) * 12 + (rowDate.getMonth() - effectivePrepayStart.getMonth());
        
        let isDue = false;
        if (input.prepaymentFrequency === 'monthly') isDue = true;
        else if (input.prepaymentFrequency === 'quarterly') isDue = diffMonths % 3 === 0;
        else if (input.prepaymentFrequency === 'yearly') isDue = diffMonths % 12 === 0;
        
        if (isDue) extraPay = input.prepaymentAmount;
    }

    let monthlyPayment = baseEmi + extraPay;
    let principalForMonth = monthlyPayment - interestForMonth;

    if (principalForMonth > balance) {
        principalForMonth = balance;
        monthlyPayment = principalForMonth + interestForMonth;
    }

    let closingBalance = balance - principalForMonth;
    if (closingBalance < 0.1) closingBalance = 0;

    totalInterest += interestForMonth;
    
    // Calculate cumulative
    const totalPrincipalPaid = principal - closingBalance;
    const totalAmountPaid = totalPrincipalPaid + totalInterest;

    schedule.push({
      month: currentMonth,
      paymentDate: rowDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      isPast: rowDate < currentDate,
      openingBalance: balance,
      emi: baseEmi,
      extraPayment: Math.max(0, monthlyPayment - baseEmi),
      principalComponent: principalForMonth,
      interestComponent: interestForMonth,
      closingBalance: closingBalance,
      totalInterestToDate: totalInterest,
      totalPrincipalPaid: totalPrincipalPaid,
      totalAmountPaid: totalAmountPaid
    });

    balance = closingBalance;
    currentMonth++;
  }

  const totalPayment = schedule.reduce((acc, row) => acc + row.principalComponent + row.interestComponent, 0);
  
  const payoffDateStr = schedule.length > 0 
    ? schedule[schedule.length - 1].paymentDate 
    : loanStartDateObj.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return {
    summary: {
      monthlyEMI: baseEmi,
      totalInterest: totalInterest,
      totalPayment: totalPayment,
      payoffDate: payoffDateStr,
      totalMonths: schedule.length
    },
    schedule
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCurrencyDecimal = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatCurrencyCompact = (value: number) => {
  if (!value || value === 0) return '₹0';
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};
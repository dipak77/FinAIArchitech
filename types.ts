export interface LoanInput {
  amount: number;
  interestRate: number;
  tenure: number;
  tenureType: 'years' | 'months';
  startDate: string; // Format YYYY-MM-DD
  loanType: 'Home Loan' | 'Personal Loan' | 'Car Loan' | 'Education Loan' | 'Business Loan';
  
  // Advanced Prepayment Config
  prepaymentAmount: number;
  prepaymentFrequency: 'monthly' | 'quarterly' | 'yearly';
  prepaymentStartDate: string; // Format YYYY-MM-DD
}

export interface AmortizationRow {
  month: number;
  paymentDate: string; // e.g. "Oct 2023"
  isPast: boolean;     // To highlight paid vs future
  openingBalance: number;
  emi: number;
  extraPayment: number;
  principalComponent: number;
  interestComponent: number;
  closingBalance: number;
  totalInterestToDate: number;
  totalPrincipalPaid: number; // New field for cumulative principal
  totalAmountPaid: number;    // New field for cumulative total (principal + interest)
}

export interface LoanSummary {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  payoffDate: string;
  totalMonths: number;
}

export interface AIAnalysisResponse {
  analysisText: string;
  suggestedPlan: {
    title: string;
    suggestedExtraEMI: number;
    projectedSavings: number;
    projectedTimeSavedStr: string;
    rationale: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}
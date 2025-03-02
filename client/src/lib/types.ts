export interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  date: Date;
  category: string;
}

export interface StockAsset {
  id: string;
  type: 'stock';
  ticker: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
}

export interface CommodityAsset {
  id: string;
  type: 'commodity';
  name: 'gold' | 'silver' | 'copper';
  quantity: number; // in grams
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
}

export type PortfolioAsset = StockAsset | CommodityAsset;


export interface DeductionsData {
  deduction80C: string;
  deduction80D: string;
  deduction80E: string;
  deduction80G: string;
  deduction80TTA: string;
  deduction80EEA: string;
  deduction80CCD: string;
}

export interface YearData {
  old_sd: number;
  new_sd: number;
  old_rebate_limit: number;
  new_rebate_limit: number;
  old_rebate: number;
  new_rebate: number;
  old: { start: number; end: number; percent: number }[];
  new: { start: number; end: number; percent: number }[];
}

export interface TaxResult {
  totalIncome: number;
  totalExemptions: number;
  totalDeductions: number;
  standardDeduction: number;
  taxableIncome: number;
  tax: number;
  rebate: number;
  cess: number;
  totalTax: number;
}

export interface ExemptionsData {
  hra: string;
  lta: string;
  food: string;
  other: string;
}

export interface IncomeData {
  incomeSalary: string;
  incomeInterest: string;
  incomeOtherSources: string;
  exemptions: ExemptionsData;
}

export interface RegimeTaxResult {
  old: TaxResult;
  new: TaxResult;
}
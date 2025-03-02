import { IncomeData, DeductionsData, YearData, TaxResult } from "./types";

export const calculateTax = (
  incomeData: IncomeData,
  deductionsData: DeductionsData,
  regime: "old" | "new",
  yearData: YearData
): TaxResult => {
  // Extract income and exemptions
  const incomeSalary = parseFloat(incomeData.incomeSalary) || 0;
  const incomeInterest = parseFloat(incomeData.incomeInterest) || 0;
  const incomeOtherSources = parseFloat(incomeData.incomeOtherSources) || 0;
  
  // Extract exemptions
  const hraExemption = parseFloat(incomeData.exemptions.hra) || 0;
  const ltaExemption = parseFloat(incomeData.exemptions.lta) || 0;
  const foodExemption = parseFloat(incomeData.exemptions.food) || 0;
  const otherExemption = parseFloat(incomeData.exemptions.other) || 0;
  
  // Calculate total exemptions
  const totalExemptions = regime === "old" ? 
    (hraExemption + ltaExemption + foodExemption + otherExemption) : 0;

  // Apply deductions from data
  const basicDeductions80C = parseFloat(deductionsData.deduction80C) || 0;
  const medicalInsurance80D = parseFloat(deductionsData.deduction80D) || 0;
  const interestOnLoan80E = parseFloat(deductionsData.deduction80E) || 0;
  const donations80G = parseFloat(deductionsData.deduction80G) || 0;
  const interestFromDeposits80TTA = parseFloat(deductionsData.deduction80TTA) || 0;
  const housingLoanInterest80EEA = parseFloat(deductionsData.deduction80EEA) || 0;
  const npsContribution80CCD = parseFloat(deductionsData.deduction80CCD) || 0;
//   const otherDeductions = parseFloat(deductionsData.deductionOther) || 0;

  // Calculate total income (after exemptions for old regime)
  const totalIncome = incomeSalary + incomeInterest + incomeOtherSources;
  const incomeAfterExemptions = totalIncome - totalExemptions;

  // Calculate total deductions
  const totalDeductions = regime === "old" ? 
    (basicDeductions80C + medicalInsurance80D + interestOnLoan80E + 
     donations80G + interestFromDeposits80TTA + housingLoanInterest80EEA + 
     npsContribution80CCD) : 0;

  // Calculate taxable income
  const standardDeduction = regime === "old" ? yearData.old_sd : yearData.new_sd;
  const taxableIncome = incomeAfterExemptions - totalDeductions - standardDeduction;

  // Determine the rebate eligibility
  const rebateLimit = regime === "old" ? yearData.old_rebate_limit : yearData.new_rebate_limit;
  const rebateAmount = regime === "old" ? yearData.old_rebate : yearData.new_rebate;
  const rebate = taxableIncome <= rebateLimit ? rebateAmount : 0;

  // Calculate tax based on regime and income slabs
  const taxSlabs = regime === "old" ? yearData.old : yearData.new;
  let tax = 0;
  const remainingIncome = taxableIncome;

  for (const slab of taxSlabs) {
    if (remainingIncome > slab.start) {
      const taxableAtThisSlab = Math.min(
        remainingIncome - slab.start,
        slab.end === Infinity ? remainingIncome : slab.end - slab.start
      );
      tax += (taxableAtThisSlab * slab.percent) / 100;
    }
  }

  // Apply rebate
  tax = Math.max(0, tax - rebate);

  // Calculate cess (4% of tax)
  const cess = (tax * 4) / 100;

  // Calculate total tax
  const totalTax = tax + cess;

  return {
    totalIncome,
    totalExemptions,
    totalDeductions,
    standardDeduction,
    taxableIncome,
    tax,
    rebate,
    cess,
    totalTax,
  };
};
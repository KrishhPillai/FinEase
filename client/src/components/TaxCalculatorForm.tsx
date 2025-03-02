"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { calculateTax } from "@/lib/functions";
import TaxResultComponent from "@/components/TaxResultComponent";
import { RegimeTaxResult } from "@/lib/types";

// Define the Zod schema for validation
// Update the form schema to include exemptions
const formSchema = z.object({
  incomeSalary: z
    .string()
    .min(1, { message: "Income from Salary is required." }),
  incomeInterest: z.string().optional(),
  incomeOtherSources: z.string().optional(),
  exemptions: z.object({
    hra: z.string().optional(),
    lta: z.string().optional(),
    food: z.string().optional(),
    other: z.string().optional(),
  }),
  deduction80C: z.string().optional(),
  deduction80D: z.string().optional(),
  deduction80E: z.string().optional(),
  deduction80G: z.string().optional(),
  deduction80TTA: z.string().optional(),
  deduction80CCD: z.string().optional(),
  deduction80EEA: z.string().optional(),
  deductionOther: z.string().optional(),
});

type TaxFormValues = z.infer<typeof formSchema>;

export default function TaxCalculatorForm() {
  const form = useForm<TaxFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incomeSalary: "",
      incomeInterest: "",
      incomeOtherSources: "",
      exemptions: {
        hra: "",
        lta: "",
        food: "",
        other: "",
      },
      deduction80C: "",
      deduction80D: "",
      deduction80E: "",
      deduction80G: "",
      deduction80TTA: "",
      deduction80CCD: "",
      deduction80EEA: "",
      deductionOther: "",
    },
  });

  const [taxResult, setTaxResult] = useState<RegimeTaxResult>({
    old: {
      totalIncome: 0,
      totalExemptions: 0,
      totalDeductions: 0,
      standardDeduction: 0,
      taxableIncome: 0,
      tax: 0,
      rebate: 0,
      cess: 0,
      totalTax: 0,
    },
    new: {
      totalIncome: 0,
      totalExemptions: 0,
      totalDeductions: 0,
      standardDeduction: 0,
      taxableIncome: 0,
      tax: 0,
      rebate: 0,
      cess: 0,
      totalTax: 0,
    },
  });

  const onSubmit = (data: TaxFormValues) => {
    const incomeData = {
      incomeSalary: data.incomeSalary || "0",
      incomeInterest: data.incomeInterest || "0",
      incomeOtherSources: data.incomeOtherSources || "0",
      exemptions: {
        hra: data.exemptions.hra || "0",
        lta: data.exemptions.lta || "0",
        food: data.exemptions.food || "0",
        other: data.exemptions.other || "0",
      },
    };

    const deductionsData = {
      deduction80C: data.deduction80C || "0",
      deduction80D: data.deduction80D || "0",
      deduction80E: data.deduction80E || "0",
      deduction80G: data.deduction80G || "0",
      deduction80TTA: data.deduction80TTA || "0",
      deduction80CCD: data.deduction80CCD || "0",
      deduction80EEA: data.deduction80EEA || "0",
      deductionOther: data.deductionOther || "0",
    };

    const yearData = {
      old_sd: 50000,
      new_sd: 75000,
      old_rebate_limit: 500000,
      new_rebate_limit: 700000,
      old_rebate: 12500,
      new_rebate: 25000,
      old: [
        { start: 0, end: 250000, percent: 0 },
        { start: 250001, end: 300000, percent: 5 },
        { start: 300001, end: 500000, percent: 5 },
        { start: 500001, end: 1000000, percent: 20 },
        { start: 1000001, end: Infinity, percent: 30 },
      ],
      new: [
        { start: 0, end: 300000, percent: 0 },
        { start: 300001, end: 700000, percent: 5 },
        { start: 700001, end: 1000000, percent: 10 },
        { start: 1000001, end: 1200000, percent: 15 },
        { start: 1200001, end: 1500000, percent: 20 },
        { start: 1500001, end: Infinity, percent: 30 },
      ],
    };

    const oldResult = calculateTax(incomeData, deductionsData, "old", yearData);
    const newResult = calculateTax(incomeData, deductionsData, "new", yearData);

    setTaxResult({ old: oldResult, new: newResult });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-2xl">Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-rows-2 grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="incomeSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Income from Salary</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormDescription>
                          Salary before reducing HRA, LTA, standard deductions &
                          professional tax. If applicable, reduce leave
                          encashment (max: 25L)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="incomeInterest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Income from Interest</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormDescription>
                          Includes interest from savings bank, deposits and
                          other interest
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="incomeOtherSources"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest From Other Sources</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormDescription>
                          Rental income, Digital Assets, capital gains, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-2xl">Exemptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="exemptions.hra"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>House Rent Allowance (HRA)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormDescription>
                          Exemption under section 10(13A) for house rent paid
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="exemptions.lta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leave Travel Allowance (LTA)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormDescription>
                          Travel concession/assistance received
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="exemptions.food"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food Allowance</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormDescription>
                          Food coupons/allowance received from employer
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="exemptions.other"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Exemptions</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormDescription>
                          Other salary exemptions and allowances
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-2xl">Deductions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="deduction80C"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Basic Deductions - 80C</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormDescription>
                        Amount invested/paid in tax saving instruments such as
                        PPF, ELSS mutual funds, LIC premium, etc. (max: 1.5L)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deduction80D"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Insurance - 80D</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormDescription>
                        Medical premium & preventive health checkup fees paid
                        for self & family including parents
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deduction80E"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest on Educational Loan - 80E</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormDescription>
                        Amount of interest paid on loan taken for higher
                        education
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deduction80G"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Donations to Charity - 80G</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormDescription>
                        Amount paid as donation to charitable insitutions or
                        certain recognized funds
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deduction80TTA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest from Deposits - 80TTA</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormDescription>
                        Amount of interest income on deposits in savings account
                        (includes fixed/recurring deposit interest in case of
                        senior citizen)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deduction80CCD"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Employees Contribution to NPS - 80CCD
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormDescription>
                        As per old tax regime, maximum deduction allowed is
                        ₹50,000. As per new tax regime, the maximum deduction
                        allowed is restricted to 14% of salary for central
                        government employees and 10% for any other employee.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deduction80EEA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest on Housing Loan - 80EEA</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormDescription>
                        Amount of interest paid on housing loan sanctioned
                        during FY (max: 2L)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deductionOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Others</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormDescription>
                        Other Deductions which are not mentioned
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Calculate Tax</Button>
            </CardContent>
          </Card>
          <div className="col-span-2">
            <TaxResultComponent old={taxResult.old} new={taxResult.new} />
          </div>
        </div>
      </form>
    </Form>
  );
}

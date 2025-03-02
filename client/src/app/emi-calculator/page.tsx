"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AmortizationRow {
  month: number;
  principalPayment: string;
  interestPayment: string;
  totalPayment: string;
  remainingPrincipal: string;
  cumulativeInterest: string;
  cumulativePrincipal: string;
  prepayment: number;
}

interface GraphData {
  month: number;
  Principal: number;
  Interest: number;
}

interface Prepayments {
  [key: number]: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <p className="font-medium">Month {label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: ₹{entry.value.toFixed(2)}
        </p>
      ))}
    </div>
  );
};

const EMICalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [tenure, setTenure] = useState<number>(12);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationRow[]>([]);
  const [monthlyEMI, setMonthlyEMI] = useState<number>(0);

  const calculateEMI = (principal: number, rate: number, time: number): number => {
    const r = rate / (12 * 100);
    const n = time;
    const emi = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return emi;
  };

  const generateAmortizationSchedule = useCallback((
    principal: number,
    rate: number,
    time: number,
    prepayments: Prepayments = {}
  ): AmortizationRow[] => {
    const monthlyRate = rate / (12 * 100);
    let remainingPrincipal = principal;
    const schedule: AmortizationRow[] = [];
    let totalInterest = 0;
    let totalPrincipal = 0;
    
    const baseEMI = calculateEMI(principal, rate, time);

    for (let month = 1; month <= time; month++) {
      if (remainingPrincipal <= 0) break;

      const interestPayment = remainingPrincipal * monthlyRate;
      let principalPayment = baseEMI - interestPayment;
      
      const prepayment = prepayments[month] || 0;
      principalPayment += Number(prepayment);

      if (principalPayment > remainingPrincipal) {
        principalPayment = remainingPrincipal;
      }

      totalInterest += interestPayment;
      totalPrincipal += principalPayment;
      remainingPrincipal -= principalPayment;

      schedule.push({
        month,
        principalPayment: principalPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        totalPayment: (principalPayment + interestPayment).toFixed(2),
        remainingPrincipal: remainingPrincipal.toFixed(2),
        cumulativeInterest: totalInterest.toFixed(2),
        cumulativePrincipal: totalPrincipal.toFixed(2),
        prepayment
      });
    }

    return schedule;
  }, [calculateEMI]);

  const handlePrepaymentChange = (month: number, value: string): void => {
    const prepayments: Prepayments = {};
    prepayments[month] = Number(value) || 0;
    
    const newSchedule = generateAmortizationSchedule(loanAmount, interestRate, tenure, prepayments);
    setAmortizationSchedule(newSchedule);
  };

  const getGraphData = (): GraphData[] => {
    return amortizationSchedule.map(row => ({
      month: row.month,
      Principal: parseFloat(row.principalPayment),
      Interest: parseFloat(row.interestPayment)
    }));
  };

  const getTotalAmount = (): number => {
    return amortizationSchedule.reduce((total, row) => 
      total + parseFloat(row.totalPayment), 0
  );
  };

  const getTotalInterest = (): number => {
    return amortizationSchedule.reduce((total, row) => 
      total + parseFloat(row.interestPayment), 0
  );
  };

  const getPrincipalPercentage = (): number => {
    const totalAmount = getTotalAmount();
    return totalAmount ? (loanAmount / totalAmount) * 100 : 0;
  };

  useEffect(() => {
    const emi = calculateEMI(loanAmount, interestRate, tenure);
    setMonthlyEMI(emi);
    const schedule = generateAmortizationSchedule(loanAmount, interestRate, tenure);
    setAmortizationSchedule(schedule);
  }, [loanAmount, interestRate, tenure, generateAmortizationSchedule]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number>>
  ): void => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setter(value);
    }
  };

  return (
    <div className="space-y-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>EMI Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount</Label>
              <Input
                id="amount"
                type="number"
                value={loanAmount}
                onChange={(e) => handleInputChange(e, setLoanAmount)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest">Interest Rate (%)</Label>
              <Input
                id="interest"
                type="number"
                value={interestRate}
                onChange={(e) => handleInputChange(e, setInterestRate)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenure">Tenure (months)</Label>
              <Input
                id="tenure"
                type="number"
                value={tenure}
                onChange={(e) => handleInputChange(e, setTenure)}
              />
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">Monthly EMI</p>
                <p className="text-2xl font-bold">₹{monthlyEMI.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">Total Amount Payable</p>
                <p className="text-2xl font-bold">₹{getTotalAmount().toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">Total Interest</p>
                <p className="text-2xl font-bold">₹{getTotalInterest().toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Principal Amount</span>
                <span>Interest Amount</span>
              </div>
              <div className="relative h-4 w-full">
                <div className="absolute inset-0 flex">
                  <div 
                    className="bg-indigo-500 h-full rounded-l"
                    style={{ width: `${getPrincipalPercentage()}%` }}
                  />
                  <div 
                    className="bg-green-500 h-full rounded-r"
                    style={{ width: `${100 - getPrincipalPercentage()}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>₹{loanAmount.toFixed(2)}</span>
                <span>₹{getTotalInterest().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Payment Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={getGraphData()}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'currentColor' }}
                  tickLine={{ stroke: 'currentColor' }}
                  axisLine={{ stroke: 'currentColor' }}
                />
                <YAxis
                  tick={{ fill: 'currentColor' }}
                  tickLine={{ stroke: 'currentColor' }}
                  axisLine={{ stroke: 'currentColor' }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value) => <span className="text-sm font-medium">{value}</span>}
                />
                <Area 
                  type="monotone" 
                  dataKey="Principal" 
                  name="Principal"
                  stroke="#6366f1"
                  fill="url(#principalGradient)"
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="Interest" 
                  name="Interest"
                  stroke="#22c55e"
                  fill="url(#interestGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Amortization Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Principal Payment</TableHead>
                  <TableHead>Interest Payment</TableHead>
                  <TableHead>Total Payment</TableHead>
                  <TableHead>Outstanding Principal</TableHead>
                  <TableHead>Cumulative Interest</TableHead>
                  <TableHead>Cumulative Principal</TableHead>
                  <TableHead>Prepayment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amortizationSchedule.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>₹{row.principalPayment}</TableCell>
                    <TableCell>₹{row.interestPayment}</TableCell>
                    <TableCell>₹{row.totalPayment}</TableCell>
                    <TableCell>₹{row.remainingPrincipal}</TableCell>
                    <TableCell>₹{row.cumulativeInterest}</TableCell>
                    <TableCell>₹{row.cumulativePrincipal}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="Enter prepayment"
                        value={row.prepayment || ''}
                        onChange={(e) => handlePrepaymentChange(row.month, e.target.value)}
                        className="w-32"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EMICalculator;
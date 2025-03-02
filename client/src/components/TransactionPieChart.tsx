"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Transaction } from "@/lib/types";

interface TransactionPieChartProps {
  transactions: Transaction[];
  formatAmount: (amount: number) => string;
}

const COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // yellow
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

export default function TransactionPieChart({
  transactions,
  formatAmount,
}: TransactionPieChartProps) {
  const data = transactions.reduce((acc, transaction) => {
    const existingCategory = acc.find(
      (item) => item.name === transaction.category
    );
    if (existingCategory) {
      existingCategory.value += transaction.amount;
    } else {
      acc.push({ name: transaction.category, value: transaction.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  data.sort((a, b) => b.value - a.value);

  return (
    <ChartContainer
      config={Object.fromEntries(
        data.map((entry, index) => [
          entry.name,
          { label: entry.name, color: COLORS[index % COLORS.length] },
        ])
      )}
      className="h-[400px] w-full" // Increased height to fit legend
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel={false} />}
          />
          <Pie
            data={data}
            cx="50%"
            cy="40%"
            outerRadius={90}
            innerRadius={50}
            dataKey="value"
            strokeWidth={5}
            label={(entry) => `${entry.name} (${formatAmount(entry.value)})`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatAmount(value)} />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={10}
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
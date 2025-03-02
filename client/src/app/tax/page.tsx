import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, PiggyBank, TrendingUp } from "lucide-react";

const Tax = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Tax Management</h1>
          {/* <p className="text-secondary-foreground">View and Optimize Tax</p> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/tax/income-tax" passHref>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PiggyBank className="mr-2" />
                  Income Tax
                </CardTitle>
                <CardDescription>
                  View and manage your income tax details
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col">
                <ul className="list-disc pl-5 mb-4">
                  <li>Maximize contributions to tax-advantaged accounts</li>
                  <li>Consider tax-efficient investment vehicles</li>
                  <li>Explore charitable giving strategies</li>
                  <li>Review timing of income and deductions</li>
                </ul>
                <div className="flex justify-between items-center">
                  <span>Click to view details</span>
                  <ArrowRight />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2" />
                Portfolio Tax
              </CardTitle>
              <CardDescription>
                Quick overview of tax harvesting opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Potential tax harvesting opportunities:</p>
              <ul className="list-disc pl-5 mb-4">
                <li>Consider selling underperforming stocks to offset gains</li>
                <li>Review long-term vs short-term capital gains</li>
                <li>Explore tax-loss harvesting strategies</li>
              </ul>
              <Link href="/tax/stock-tax" passHref>
                <Button variant="outline">Analyze Portfolio</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Tax;

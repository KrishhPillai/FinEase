"use client";

import React, { useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { PortfolioAsset } from "@/lib/types";
import { useAssets } from "@/context/AssetsContext";
import { useCurrency } from "@/context/CurrencyContext";

const LTCG_EXEMPTION_LIMIT = 125000; // ₹1.25L LTCG exemption

const TaxManagementDashboard = () => {
  const { assets } = useAssets();

  const { formatAmount } = useCurrency();

  const calculateHoldingPeriod = (purchaseDate: Date) => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - purchaseDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateProfit = (asset: PortfolioAsset) => {
    return (
      (asset.currentPrice - asset.purchasePrice) *
      (asset.type === "stock" ? asset.quantity : asset.quantity)
    );
  };

  const calculateTax = useCallback((asset: PortfolioAsset) => {
    const holdingPeriod = calculateHoldingPeriod(asset.purchaseDate);
    const profit = calculateProfit(asset);

    if (profit <= 0) return 0;

    // For stocks: STCG (20%) if held < 1 year, LTCG (12.5%) if > 1 year
    if (asset.type === "stock") {
      if (holdingPeriod <= 365) {
        return profit * 0.2; // STCG
      } else {
        // Apply LTCG exemption
        const taxableProfit = Math.max(0, profit);
        return taxableProfit * 0.125;
      }
    }

    // For commodities: STCG (30%) if held < 3 years, LTCG (20%) if > 3 years
    return holdingPeriod <= 3 * 365 ? profit * 0.3 : profit * 0.2;
  }, [calculateHoldingPeriod, calculateProfit]);

  const getLTCGProfitHarvestingOpportunities = (assets: PortfolioAsset[]) => {
    const longTermAssets = assets.filter((asset) => {
      const holdingPeriod = calculateHoldingPeriod(asset.purchaseDate);
      return (
        asset.type === "stock" &&
        holdingPeriod > 365 &&
        calculateProfit(asset) > 0
      );
    });

    const totalLTCG = longTermAssets.reduce(
      (acc, asset) => acc + calculateProfit(asset),
      0
    );
    const remainingExemption = LTCG_EXEMPTION_LIMIT - totalLTCG;

    return longTermAssets.map((asset) => ({
      ...asset,
      profit: calculateProfit(asset),
      suggestedAction:
        remainingExemption > 0
          ? `Consider booking profit up to ${formatAmount(Math.min(
              calculateProfit(asset),
              remainingExemption
            )).toLocaleString()}`
          : "Consider waiting for next financial year",
    }));
  };

  const getTaxHarvestingOpportunities = (asset: PortfolioAsset) => {
    const loss = calculateProfit(asset);
    return loss < 0;
  };

  const totalPortfolioValue = useMemo(() => {
    return assets.reduce((acc, asset) => {
      return (
        acc +
        asset.currentPrice *
          (asset.type === "stock" ? asset.quantity : asset.quantity)
      );
    }, 0);
  }, [assets]);

  const totalTaxLiability = useMemo(() => {
    return assets.reduce((acc, asset) => acc + calculateTax(asset), 0);
  }, [assets, calculateTax]);

  const profitHarvestingOpportunities = useMemo(() => {
    return getLTCGProfitHarvestingOpportunities(assets);
  }, [assets, getLTCGProfitHarvestingOpportunities]);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Portfolio Overview</CardTitle>
            <CardDescription>
              Current portfolio value and tax implications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Portfolio Value</span>
                <span className="text-2xl font-bold">
                  {formatAmount(totalPortfolioValue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Estimated Tax Liability</span>
                <span className="text-xl text-red-500">
                  {formatAmount(totalTaxLiability)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">LTCG Exemption Remaining</span>
                <span className="text-xl text-green-500">
                  {formatAmount(Math.max(
                    0,
                    LTCG_EXEMPTION_LIMIT -
                      profitHarvestingOpportunities.reduce(
                        (acc, asset) => acc + asset.profit,
                        0
                      )
                  )).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Tax Harvesting Opportunities
            </CardTitle>
            <CardDescription>
              Profit and loss harvesting opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Loss Harvesting Section */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Loss Harvesting</h3>
                <div className="space-y-2">
                  {assets.filter(getTaxHarvestingOpportunities).map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-2 bg-red-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={20} />
                        <span>
                          {asset.type === "stock" ? asset.ticker : asset.name}
                        </span>
                      </div>
                      <Badge variant="destructive">
                        Loss: 
                        {formatAmount(Math.abs(calculateProfit(asset))).toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profit Harvesting Section */}
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  Profit Harvesting
                </h3>
                <div className="space-y-2">
                  {profitHarvestingOpportunities.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="text-green-500" size={20} />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {asset.type === "stock" ? asset.ticker : asset.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            {asset.suggestedAction}
                          </span>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-500">
                        Profit: {asset.profit.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stocks" className="w-full">
        <TabsList>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="commodities">Commodities</TabsTrigger>
        </TabsList>

        <TabsContent value="stocks">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Stock Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticker</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Holding Period</TableHead>
                    <TableHead>Tax Liability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets
                    .filter((asset) => asset.type === "stock")
                    .map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">
                          {asset.ticker}
                        </TableCell>
                        <TableCell>{asset.quantity}</TableCell>
                        <TableCell>{formatAmount(asset.purchasePrice)}</TableCell>
                        <TableCell>{formatAmount(asset.currentPrice)}</TableCell>
                        <TableCell className="flex items-center gap-1">
                          {asset.currentPrice > asset.purchasePrice ? (
                            <TrendingUp className="text-green-500" size={16} />
                          ) : (
                            <TrendingDown className="text-red-500" size={16} />
                          )}
                          {formatAmount(Math.abs(calculateProfit(asset))).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {Math.floor(
                            calculateHoldingPeriod(asset.purchaseDate) / 365
                          )}
                          y {calculateHoldingPeriod(asset.purchaseDate) % 365}d
                        </TableCell>
                        <TableCell>
                          {formatAmount(calculateTax(asset)).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commodities">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Commodity Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity (g)</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Holding Period</TableHead>
                    <TableHead>Tax Liability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets
                    .filter((asset) => asset.type === "commodity")
                    .map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium capitalize">
                          {asset.name}
                        </TableCell>
                        <TableCell>{asset.quantity}</TableCell>
                        <TableCell>{formatAmount(asset.purchasePrice)}</TableCell>
                        <TableCell>{formatAmount(asset.currentPrice)}</TableCell>
                        <TableCell className="flex items-center gap-1">
                          {asset.currentPrice > asset.purchasePrice ? (
                            <TrendingUp className="text-green-500" size={16} />
                          ) : (
                            <TrendingDown className="text-red-500" size={16} />
                          )}
                          {formatAmount(Math.abs(calculateProfit(asset))).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {Math.floor(
                            calculateHoldingPeriod(asset.purchaseDate) / 365
                          )}
                          y {calculateHoldingPeriod(asset.purchaseDate) % 365}d
                        </TableCell>
                        <TableCell>
                          {formatAmount(calculateTax(asset)).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxManagementDashboard;

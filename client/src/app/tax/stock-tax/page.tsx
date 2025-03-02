import TaxEquityManagement from "@/components/TaxEquityManagement";

const StockTax = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Tax Management</h1>
          {/* <p className="text-secondary-foreground">View and Optimize Tax</p> */}
        </div>
        <TaxEquityManagement />
      </div>
    </main>
  );
};

export default StockTax

import TaxCalculatorForm from "@/components/TaxCalculatorForm";

const IncomeTax = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Tax Management</h1>
          {/* <p className="text-secondary-foreground">View and Optimize Tax</p> */}
        </div>
        <TaxCalculatorForm />
      </div>
    </main>
  );
};

export default IncomeTax

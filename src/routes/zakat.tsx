import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, Info } from "lucide-react";

export const Route = createFileRoute("/zakat")({
  head: () => ({
    meta: [{ title: "Zakat Calculator - Qasr Companion" }],
  }),
  component: ZakatPage,
});

function ZakatPage() {
  const [currency, setCurrency] = useState("$");
  const [nisab, setNisab] = useState<number>(4500); // Approximate value of 85g Gold
  
  const [assets, setAssets] = useState({
    cash: 0,
    gold: 0,
    silver: 0,
    investments: 0,
    business: 0,
  });
  
  const [liabilities, setLiabilities] = useState({
    debts: 0,
    expenses: 0,
  });

  const handleAssetChange = (key: keyof typeof assets, value: string) => {
    setAssets({ ...assets, [key]: Number(value) || 0 });
  };

  const handleLiabilityChange = (key: keyof typeof liabilities, value: string) => {
    setLiabilities({ ...liabilities, [key]: Number(value) || 0 });
  };

  const totalAssets = Object.values(assets).reduce((a, b) => a + b, 0);
  const totalLiabilities = Object.values(liabilities).reduce((a, b) => a + b, 0);
  const netWealth = totalAssets - totalLiabilities;
  const isEligible = netWealth >= nisab;
  const zakatOwed = isEligible ? netWealth * 0.025 : 0;

  return (
    <main className="flex-1 pattern-islamic pb-20">
      <div className="mx-auto max-w-4xl px-4 pt-12 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-gradient-primary shadow-card">
            <Calculator className="h-6 w-6 text-primary-foreground" />
          </span>
          <h1 className="font-display text-4xl sm:text-5xl">
            Zakat <span className="text-gradient-primary">Calculator</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Calculate your mandatory 2.5% Zakat on accumulated wealth.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Nisab & Currency */}
            <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-elegant backdrop-blur">
              <h2 className="mb-4 font-display text-xl text-foreground">Settings</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-muted-foreground">Currency Symbol</label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    Nisab Value (85g Gold) <Info className="h-3 w-3" title="The minimum amount of wealth one must have before Zakat is payable." />
                  </label>
                  <input
                    type="number"
                    value={nisab || ""}
                    onChange={(e) => setNisab(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Assets */}
            <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-elegant backdrop-blur">
              <h2 className="mb-4 font-display text-xl text-foreground">Zakatable Assets</h2>
              <div className="space-y-4">
                <AssetInput label="Cash & Bank Balances" value={assets.cash} onChange={(v) => handleAssetChange("cash", v)} currency={currency} />
                <AssetInput label="Gold Value" value={assets.gold} onChange={(v) => handleAssetChange("gold", v)} currency={currency} />
                <AssetInput label="Silver Value" value={assets.silver} onChange={(v) => handleAssetChange("silver", v)} currency={currency} />
                <AssetInput label="Investments / Shares" value={assets.investments} onChange={(v) => handleAssetChange("investments", v)} currency={currency} />
                <AssetInput label="Business Inventory" value={assets.business} onChange={(v) => handleAssetChange("business", v)} currency={currency} />
              </div>
            </div>

            {/* Liabilities */}
            <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-elegant backdrop-blur">
              <h2 className="mb-4 font-display text-xl text-foreground">Deductible Liabilities</h2>
              <div className="space-y-4">
                <AssetInput label="Outstanding Debts" value={liabilities.debts} onChange={(v) => handleLiabilityChange("debts", v)} currency={currency} />
                <AssetInput label="Immediate Expenses" value={liabilities.expenses} onChange={(v) => handleLiabilityChange("expenses", v)} currency={currency} />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-card backdrop-blur">
              <h2 className="mb-6 font-display text-2xl text-foreground text-center">Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Assets</span>
                  <span className="font-semibold text-foreground">{currency}{totalAssets.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Liabilities</span>
                  <span className="font-semibold text-destructive">-{currency}{totalLiabilities.toLocaleString()}</span>
                </div>
                <div className="border-t border-border/50 pt-4 flex justify-between font-medium">
                  <span className="text-foreground">Net Wealth</span>
                  <span className="text-foreground">{currency}{Math.max(0, netWealth).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Nisab Threshold</span>
                  <span className="text-muted-foreground">{currency}{nisab.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-gradient-primary p-6 text-center text-primary-foreground shadow-lg">
                <h3 className="mb-2 text-sm font-medium opacity-90">Total Zakat Owed (2.5%)</h3>
                <div className="font-display text-4xl tabular-nums">
                  {currency}{zakatOwed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {!isEligible && netWealth > 0 && (
                  <p className="mt-3 text-xs opacity-80">
                    Your net wealth is below the Nisab threshold. Zakat is not mandatory.
                  </p>
                )}
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function AssetInput({ label, value, onChange, currency }: { label: string, value: number, onChange: (v: string) => void, currency: string }) {
  return (
    <div className="flex items-center gap-4">
      <label className="flex-1 text-sm font-medium text-muted-foreground">{label}</label>
      <div className="relative w-1/2 max-w-[200px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{currency}</span>
        <input
          type="number"
          min="0"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 pl-8 text-right font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="0"
        />
      </div>
    </div>
  );
}

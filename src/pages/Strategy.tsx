import { MainLayout } from "@/components/layout/MainLayout";
import { useDebts } from "@/hooks/use-debts";
import { strategies } from "@/lib/strategies";
import { Info } from "lucide-react";
import { useState } from "react";
import { ExtraPaymentDialog } from "@/components/strategy/ExtraPaymentDialog";
import { useProfile } from "@/hooks/use-profile";
import { motion } from "framer-motion";
import { StrategySelector } from "@/components/StrategySelector";
import { PaymentOverviewSection } from "@/components/strategy/PaymentOverviewSection";
import { OneTimeFundingSection } from "@/components/strategy/OneTimeFundingSection";

export default function Strategy() {
  const { debts } = useDebts();
  const { profile, updateProfile } = useProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  
  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + debt.minimum_payment, 0) ?? 0;
  const extraPayment = profile?.monthly_payment 
    ? Math.max(0, profile.monthly_payment - totalMinimumPayments)
    : 0;

  const handleSaveExtra = async (amount: number) => {
    if (!profile) return;
    
    const totalPayment = totalMinimumPayments + amount;
    try {
      await updateProfile.mutateAsync({
        ...profile,
        monthly_payment: totalPayment
      });
    } catch (error) {
      console.error("Failed to update monthly payment:", error);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container max-w-7xl py-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Payment Strategy
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Tutorial
                </span>
              </h1>
              <p className="text-muted-foreground mt-1">Optimize your debt payoff plan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <PaymentOverviewSection
                totalMinimumPayments={totalMinimumPayments}
                extraPayment={extraPayment}
                onExtraPaymentChange={handleSaveExtra}
                onOpenExtraPaymentDialog={() => setIsDialogOpen(true)}
                currencySymbol={profile?.preferred_currency}
              />
              
              <OneTimeFundingSection />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Strategy Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StrategySelector
                    strategies={strategies}
                    selectedStrategy={selectedStrategy}
                    onSelectStrategy={setSelectedStrategy}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <ExtraPaymentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentPayment={totalMinimumPayments}
        onSave={handleSaveExtra}
        currencySymbol={profile?.preferred_currency || "£"}
      />
    </MainLayout>
  );
}
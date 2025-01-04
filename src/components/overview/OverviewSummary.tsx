import { motion } from "framer-motion";
import { SummaryCard } from "./SummaryCard";
import { useDebts } from "@/hooks/use-debts";
import { calculatePayoffTime } from "@/lib/paymentCalculator";

export const OverviewSummary = () => {
  const { debts, profile } = useDebts();
  
  const calculateDebtSummary = () => {
    if (!debts || !profile) return null;
    
    return debts.map(debt => ({
      title: debt.name,
      writtenOff: `${profile.preferred_currency}${debt.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      monthlyCost: `${profile.preferred_currency}${debt.minimum_payment.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      oneOffCost: `${debt.interest_rate.toFixed(1)}%`,
      months: calculatePayoffTime(debt, debt.minimum_payment) === Infinity ? 'N/A' : calculatePayoffTime(debt, debt.minimum_payment)
    }));
  };

  const summaryData = calculateDebtSummary();

  if (!summaryData || summaryData.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100 mb-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Debt Summary</h2>
        <p className="text-gray-600">No debts added yet. Add your first debt to see the summary.</p>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glassmorphism rounded-xl p-6 shadow-lg bg-white/95 backdrop-blur-sm border border-gray-100 mb-8"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Debt Summary</h2>
      
      {summaryData.map((data, index) => (
        <SummaryCard
          key={index}
          title={data.title}
          writtenOff={data.writtenOff}
          monthlyCost={data.monthlyCost}
          oneOffCost={data.oneOffCost}
          months={data.months}
        />
      ))}
    </motion.section>
  );
};
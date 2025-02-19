import { Debt } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { formatCurrency } from "../debt/chart/chartUtils";
import { chartConfig } from "../debt/chart/chartStyles";

interface DebtCategoryChartProps {
  debts: Debt[];
  currencySymbol: string;
}

export const DebtCategoryChart = ({ debts, currencySymbol }: DebtCategoryChartProps) => {
  // Group debts by category and calculate total for each category
  const categoryData = Object.entries(
    debts.reduce((acc, debt) => {
      const category = debt.category || 'Other';
      acc[category] = (acc[category] || 0) + debt.balance;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, value]) => ({
    name: category,
    value
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-[400px] p-4 rounded-xl bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-sm shadow-lg border border-gray-100"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={categoryData}
          margin={chartConfig.margin}
        >
          <CartesianGrid
            strokeDasharray={chartConfig.gridStyle.strokeDasharray}
            stroke={chartConfig.gridStyle.stroke}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={chartConfig.axisStyle}
            stroke={chartConfig.axisStyle.stroke}
          />
          <YAxis
            tickFormatter={(value) => formatCurrency(value, currencySymbol)}
            tick={chartConfig.axisStyle}
            stroke={chartConfig.axisStyle.stroke}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value, currencySymbol)}
            contentStyle={chartConfig.tooltipStyle}
          />
          <Bar
            dataKey="value"
            fill="#34D399"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
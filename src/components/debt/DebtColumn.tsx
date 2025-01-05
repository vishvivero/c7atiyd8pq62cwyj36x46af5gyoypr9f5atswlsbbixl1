import { Card } from "@/components/ui/card";
import { PaymentSchedule } from "./PaymentSchedule";
import { Debt } from "@/lib/types";
import { calculatePaymentSchedule } from "./utils/paymentSchedule";

interface DebtColumnProps {
  debt: Debt;
  payoffDetails: {
    months: number;
    totalInterest: number;
    payoffDate: Date;
  };
  monthlyAllocation: number;
}

export const DebtColumn = ({ debt, payoffDetails, monthlyAllocation }: DebtColumnProps) => {
  console.log('DebtColumn rendering for:', debt.name, {
    monthlyAllocation,
    payoffDetails,
    minimumPayment: debt.minimum_payment
  });

  const payments = calculatePaymentSchedule(
    debt,
    payoffDetails,
    monthlyAllocation,
    debt.interest_rate > 30 // High priority if interest rate > 30%
  );

  // Calculate the effective monthly payment including any redistributed amounts
  const effectiveMonthlyPayment = Math.max(
    debt.minimum_payment,
    monthlyAllocation
  );

  return (
    <Card className="min-w-[350px] p-4 bg-white/95 backdrop-blur-sm">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{debt.name}</h3>
          <p className="text-sm text-muted-foreground">{debt.banker_name}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current Balance:</span>
            <span className="font-medium">
              {debt.currency_symbol}{debt.balance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Interest Rate:</span>
            <span className="font-medium">{debt.interest_rate}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Monthly Payment:</span>
            <span className="font-medium">
              {debt.currency_symbol}{effectiveMonthlyPayment.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              {effectiveMonthlyPayment > debt.minimum_payment && (
                <span className="text-xs text-green-600 ml-1">
                  (includes redistributed amount)
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Payment Schedule</h4>
          <PaymentSchedule
            payments={payments}
            currencySymbol={debt.currency_symbol}
          />
        </div>
      </div>
    </Card>
  );
};
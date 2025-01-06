import { Debt } from "@/lib/types";
import { OneTimeFunding } from "@/hooks/use-one-time-funding";

export const formatMonthYear = (monthsFromNow: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsFromNow);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const formatCurrency = (value: number, currencySymbol: string) => {
  if (value >= 1000000) {
    return `${currencySymbol}${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${currencySymbol}${(value / 1000).toFixed(1)}k`;
  }
  return `${currencySymbol}${value.toFixed(0)}`;
};

export const generateChartData = (
  debts: Debt[], 
  monthlyPayment: number,
  oneTimeFundings: OneTimeFunding[] = []
) => {
  const data = [];
  let currentDebts = [...debts];
  let currentBalances = Object.fromEntries(
    debts.map(debt => [debt.id, debt.balance])
  );
  let allPaidOff = false;
  let month = 0;
  const startDate = new Date();

  while (!allPaidOff && month < 1200) {
    const currentDate = new Date(startDate);
    currentDate.setMonth(currentDate.getMonth() + month);
    
    const point: any = { 
      month,
      monthLabel: formatMonthYear(month)
    };
    
    let totalBalance = 0;

    if (currentDebts.length === 0) {
      point.total = 0;
      data.push(point);
      break;
    }

    // Calculate extra payment from one-time fundings for this month
    const extraPayment = oneTimeFundings
      .filter(funding => {
        const fundingDate = new Date(funding.payment_date);
        return fundingDate.getMonth() === currentDate.getMonth() &&
               fundingDate.getFullYear() === currentDate.getFullYear();
      })
      .reduce((sum, funding) => sum + funding.amount, 0);

    const totalMonthlyPayment = monthlyPayment + extraPayment;

    currentDebts = currentDebts.filter(debt => {
      const monthlyInterest = (debt.interest_rate / 1200) * currentBalances[debt.id];
      const payment = Math.min(
        currentBalances[debt.id] + monthlyInterest,
        debt.minimum_payment + (currentDebts[0].id === debt.id ? totalMonthlyPayment - debt.minimum_payment : 0)
      );

      currentBalances[debt.id] = Math.max(0, 
        currentBalances[debt.id] + monthlyInterest - payment
      );

      point[debt.name] = currentBalances[debt.id];
      totalBalance += currentBalances[debt.id];

      return currentBalances[debt.id] > 0.01;
    });

    point.total = totalBalance;
    
    if (month === 0 || currentDebts.length === 0 || 
        month % Math.max(1, Math.floor(data.length / 10)) === 0) {
      data.push(point);
    }

    allPaidOff = currentDebts.length === 0;
    month++;
  }

  return data;
};
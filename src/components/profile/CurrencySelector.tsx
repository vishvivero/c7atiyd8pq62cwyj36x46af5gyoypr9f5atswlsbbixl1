import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countryCurrencies } from "@/lib/utils/currency-data";

interface CurrencySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function CurrencySelector({ value, onValueChange, disabled }: CurrencySelectorProps) {
  console.log('CurrencySelector - Current value:', value);
  
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2">Preferred Currency</p>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[280px] bg-white border-gray-200">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-[300px]">
          {countryCurrencies.map((item) => (
            <SelectItem key={item.code} value={item.code}>
              {item.country} - {item.currency} ({item.symbol})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
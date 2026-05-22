import { formatCurrency } from "@/lib/utils/currency";
import { cn } from "@/lib/utils";

interface SavingsLabelProps {
  regularPrice: number;
  salePrice?: number;
  className?: string;
}

export function SavingsLabel({ regularPrice, salePrice, className }: SavingsLabelProps) {
  if (!salePrice || salePrice >= regularPrice) return null;
  
  const savings = regularPrice - salePrice;
  
  return (
    <p className={cn("text-xs font-medium text-savings mt-1", className)}>
      Save {formatCurrency(savings)} on online order
    </p>
  );
}

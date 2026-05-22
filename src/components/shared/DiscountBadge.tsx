import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DiscountBadgeProps {
  percent: number | undefined;
  className?: string;
}

export function DiscountBadge({ percent, className }: DiscountBadgeProps) {
  if (!percent || percent <= 0) return null;
  
  return (
    <Badge 
      className={cn("bg-discount-badge hover:bg-discount-badge text-white font-bold pointer-events-none", className)}
    >
      -{percent}%
    </Badge>
  );
}

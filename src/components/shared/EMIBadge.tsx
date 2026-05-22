import { cn } from "@/lib/utils";

export function EMIBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-block bg-warning/10 text-warning text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide", className)}>
      EMI Available
    </span>
  );
}

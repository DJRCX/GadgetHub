import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode | LucideIcon;
  description?: string;
  trend?: string | {
    value: number;
    label: string;
    isPositive: boolean;
  };
  trendLabel?: string;
  isLoading?: boolean;
}

export function MetricCard({ title, value, icon, description, trend, trendLabel, isLoading }: MetricCardProps) {
  const isLucideIcon = typeof icon === 'function' || typeof icon === 'object' && '$$typeof' in (icon as any) && !(icon as any).props;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {isLucideIcon ? <div className="w-4 h-4 text-muted-foreground">{(icon as any)({})}</div> : icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {typeof trend === 'string' ? (
              <p className="text-xs mt-1 font-medium text-muted-foreground">
                <span className={trend.startsWith('+') ? 'text-green-600' : trend.startsWith('-') ? 'text-red-600' : ''}>{trend}</span> {trendLabel}
              </p>
            ) : trend ? (
              <p className={`text-xs mt-1 font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}% {trend.label}
              </p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}

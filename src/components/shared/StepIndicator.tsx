import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto mb-8 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted z-0 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-in-out" 
          style={{ width: `${Math.max(0, (currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
      
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        
        return (
          <div key={step} className="relative z-10 flex flex-col items-center">
            <div 
              className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-2 transition-colors duration-300",
                isCompleted ? "bg-primary border-primary text-white" :
                isCurrent ? "bg-primary border-primary text-white" :
                "bg-card border-muted text-muted-foreground"
              )}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
            </div>
            <span 
              className={cn(
                "absolute top-full mt-2 text-xs md:text-sm font-medium whitespace-nowrap",
                isCurrent ? "text-primary" : "text-muted-foreground"
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

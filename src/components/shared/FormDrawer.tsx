"use client";

import { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

export function FormDrawer({ 
  open, 
  isOpen, 
  onOpenChange, 
  onClose, 
  title, 
  description, 
  children,
  onSubmit,
  isSubmitting
}: FormDrawerProps) {
  const isSheetOpen = open ?? isOpen ?? false;
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) onOpenChange(newOpen);
    if (!newOpen && onClose) onClose();
  };

  const content = (
    <>
      <SheetHeader className="mb-6">
        <SheetTitle>{title}</SheetTitle>
        {description && <SheetDescription>{description}</SheetDescription>}
      </SheetHeader>
      
      {onSubmit ? (
        <form onSubmit={onSubmit} className="flex flex-col h-full space-y-4">
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
          <div className="pt-4 border-t mt-auto mb-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      ) : (
        children
      )}
    </>
  );

  return (
      <Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-xl h-full flex flex-col">
        {content}
      </SheetContent>
    </Sheet>
  );
}

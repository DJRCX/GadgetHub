import { CartDrawer } from "@/components/shared/CartDrawer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { MobileMenuDrawer } from "@/components/store/MobileMenuDrawer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
      <CartDrawer />
      <MobileMenuDrawer />
      <WhatsAppButton />
    </div>
  );
}

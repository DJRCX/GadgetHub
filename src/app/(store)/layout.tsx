import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { StoreClientComponents } from "@/components/store/StoreClientComponents";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
      <WhatsAppButton />
      <StoreClientComponents />
    </div>
  );
}

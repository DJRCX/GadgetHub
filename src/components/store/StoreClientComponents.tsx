"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("@/components/shared/CartDrawer").then((m) => m.CartDrawer), { ssr: false });
const MobileMenuDrawer = dynamic(() => import("@/components/store/MobileMenuDrawer").then((m) => m.MobileMenuDrawer), { ssr: false });
const DealPopup = dynamic(() => import("@/components/store/DealPopup").then((m) => m.DealPopup), { ssr: false });

export function StoreClientComponents() {
  return (
    <>
      <CartDrawer />
      <MobileMenuDrawer />
      <DealPopup />
    </>
  );
}

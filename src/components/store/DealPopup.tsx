"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { bannerRepository } from "@/lib/services/repositories";
import { Banner } from "@/lib/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { safeStorage } from "@/lib/utils/safeStorage";

const SHOW_DELAY = 4000;
const ENTRY_PATH_KEY = "gadgethub_deal_popup_entry_path";
const NON_HOMEPAGE_SHOWN_KEY = "gadgethub_deal_popup_non_homepage_shown";

function pickBanner(banners: Banner[]): Banner | null {
  return banners.find((b) => b?.isActive) || null;
}

export function DealPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const homepageVisitShown = useRef(false);

  const { data: banners = [] } = useQuery({
    queryKey: ["banners"],
    queryFn: () => bannerRepository.getAll().catch(() => [] as Banner[]),
  });

  const dealBanner = pickBanner(banners);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!sessionStorage.getItem(ENTRY_PATH_KEY)) {
      sessionStorage.setItem(ENTRY_PATH_KEY, pathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (!dealBanner) return;

    if (pathname === "/") {
      if (homepageVisitShown.current) return;

      const timer = setTimeout(() => {
        homepageVisitShown.current = true;
        setOpen(true);
      }, SHOW_DELAY);
      return () => clearTimeout(timer);
    }

    homepageVisitShown.current = false;

    const entryPath = typeof window !== "undefined" ? sessionStorage.getItem(ENTRY_PATH_KEY) : null;
    if (entryPath && entryPath !== "/") {
      const shown = safeStorage.getItem<boolean>(NON_HOMEPAGE_SHOWN_KEY);
      if (!shown) {
        const timer = setTimeout(() => {
          setOpen(true);
          safeStorage.setItem(NON_HOMEPAGE_SHOWN_KEY, true);
        }, SHOW_DELAY);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, dealBanner]);

  const handleDismiss = () => {
    setOpen(false);
  };

  if (!dealBanner) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleDismiss();
        setOpen(isOpen);
      }}
      disablePointerDismissal
      modal
    >
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden rounded-2xl" showCloseButton={false}>
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-10 flex items-center justify-center size-8 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          aria-label="Close deal popup"
        >
          <XIcon className="size-4" />
        </button>

        <a href={dealBanner.linkUrl || "/products"} onClick={handleDismiss} className="relative block aspect-[16/7] w-full">
          <Image
            src={dealBanner.imageUrl}
            alt={dealBanner.title}
            fill
            className="object-cover"
            sizes="(max-width: 448px) 100vw, 448px"
            loading="lazy"
          />
        </a>
      </DialogContent>
    </Dialog>
  );
}

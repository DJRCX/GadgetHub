import Link from "next/link";
import { MessageCircle, Send, Camera, Video, MapPin, Phone, Mail } from "lucide-react";

export function StoreFooter() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-tighter">GADGET<span className="text-primary">HUB</span></span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              Your trusted destination for premium gadgets, smart devices, and mobile accessories.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 border border-zinc-700 hover:border-primary hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-zinc-700 hover:border-primary hover:text-primary transition-colors">
                <Send className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-zinc-700 hover:border-primary hover:text-primary transition-colors">
                <Camera className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-zinc-700 hover:border-primary hover:text-primary transition-colors">
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-6 uppercase tracking-wider text-xs">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-sm text-zinc-400 hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/about" className="text-sm text-zinc-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-zinc-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-sm text-zinc-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold mb-6 uppercase tracking-wider text-xs">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link href="/track-order" className="text-sm text-zinc-400 hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/returns" className="text-sm text-zinc-400 hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/terms" className="text-sm text-zinc-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-sm text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-6 uppercase tracking-wider text-xs">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-400">House 12, Road 7, Dhanmondi, Dhaka-1205, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-zinc-400">+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-zinc-400">support@gadgethub.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            &copy; 2026 GadgetHub. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-8 w-14 border border-zinc-700 flex items-center justify-center text-[10px] font-bold">bKash</div>
            <div className="h-8 w-14 border border-zinc-700 flex items-center justify-center text-[10px] font-bold">Nagad</div>
            <div className="h-8 w-14 border border-zinc-700 flex items-center justify-center text-[10px] font-bold">VISA</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

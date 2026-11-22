import { MessageCircle } from "lucide-react";
import { generalWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={generalWhatsAppLink("Hi KFLORÉ, I'd like to order flowers.")}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-[hsl(var(--k-brand))] px-4 py-3.5 text-sm text-[hsl(var(--k-on-brand))] shadow-lg transition-transform hover:scale-105"
      aria-label="Order via WhatsApp"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
      <span className="hidden sm:inline">Order via WhatsApp</span>
    </a>
  );
}

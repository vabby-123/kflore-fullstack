import { categories } from "@/data/products";
import { generalWhatsAppLink, STORE_EMAIL, STORE_PHONE_DISPLAY } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="border-t k-hairline bg-[hsl(var(--k-bg-alt))]">
      <div className="k-container grid gap-10 py-16 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="font-display text-xl tracking-[0.08em]">
            KFLOR<span className="text-[hsl(var(--k-gold))]">É</span>
          </p>
          <p className="mt-3 max-w-[20ch] text-sm text-muted-foreground">Each petal tells a story.</p>
        </div>

        <div>
          <p className="eyebrow text-muted-foreground">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <a href="#shop" className="text-muted-foreground hover:text-foreground">{c.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-muted-foreground">Studio</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#about" className="text-muted-foreground hover:text-foreground">Our story</a></li>
            <li><a href="#delivery" className="text-muted-foreground hover:text-foreground">Delivery &amp; care</a></li>
            <li><a href="#contact" className="text-muted-foreground hover:text-foreground">Contact</a></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-muted-foreground">Reach us</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={generalWhatsAppLink("Hi KFLORÉ!")} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                WhatsApp
              </a>
            </li>
            <li><a href={`tel:${STORE_PHONE_DISPLAY.replace(/\s/g, "")}`} className="text-muted-foreground hover:text-foreground">{STORE_PHONE_DISPLAY}</a></li>
            <li><a href={`mailto:${STORE_EMAIL}`} className="text-muted-foreground hover:text-foreground">{STORE_EMAIL}</a></li>
          </ul>
        </div>
      </div>

      <div className="k-container flex flex-col gap-2 border-t k-hairline py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} KFLORÉ Floral Studio. All rights reserved.</p>
        <p>Kuala Lumpur &amp; Selangor, Malaysia</p>
      </div>
    </footer>
  );
}

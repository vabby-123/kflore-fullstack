import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { categories } from "@/data/products";

const NAV_LINKS = [
  { label: "Shop", href: "#shop" },
  { label: "Collections", href: "#collections" },
  { label: "Our Story", href: "#about" },
  { label: "Delivery", href: "#delivery" },
  { label: "Contact", href: "#contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, open } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        scrolled ? "bg-background/92 backdrop-blur-md k-hairline border-b" : "bg-transparent"
      }`}
    >
      <div className="k-container flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="font-display text-xl tracking-[0.08em] md:text-2xl">
          KFLOR<span className="text-[hsl(var(--k-gold))]">É</span>
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="eyebrow text-foreground/75 transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 md:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={open}
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(var(--k-brand))] text-[9px] font-medium text-[hsl(var(--k-on-brand))]">
                {count}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="k-hairline border-t bg-background/98 backdrop-blur-md md:hidden">
          <nav className="k-container flex flex-col gap-1 py-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="eyebrow py-2.5 text-foreground/80"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 border-t k-hairline pt-3">
              {categories.slice(0, 4).map((c) => (
                <a
                  key={c.slug}
                  href={`#shop`}
                  className="text-xs text-muted-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {c.name}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

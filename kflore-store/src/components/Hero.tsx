import { Hero3D } from "@/components/Hero3D";
import { Button } from "@/components/ui/button";
import { generalWhatsAppLink } from "@/lib/whatsapp";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden bg-[hsl(var(--k-bg))]">
      <div className="absolute inset-0">
        <Hero3D className="h-full w-full [&>div]:h-full [&>canvas]:h-full [&>canvas]:w-full" />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, transparent 0%, hsl(var(--k-bg)) 78%), linear-gradient(to top, hsl(var(--k-bg)) 0%, transparent 30%)",
        }}
      />

      <div className="k-container relative z-10 py-32 text-center">
        <p className="eyebrow mb-5 text-[hsl(var(--k-brand))]">Kuala Lumpur &amp; Selangor · Est. by a family of florists</p>
        <h1 className="mx-auto max-w-3xl font-display text-[13vw] font-light italic leading-[0.98] text-foreground sm:text-6xl md:text-7xl">
          Each petal tells <span className="text-[hsl(var(--k-brand))]">a story.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-balance text-sm text-muted-foreground md:text-base">
          Hand-tied bouquets, floral boxes and ceremonial arrangements — cut, styled and delivered the same day
          across Kuala Lumpur &amp; Selangor.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-none bg-[hsl(var(--k-brand))] px-8 text-[hsl(var(--k-on-brand))] hover:bg-[hsl(var(--k-brand-strong))]">
            <a href="#shop">Shop Flowers</a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-none border-[hsl(var(--k-ink)/0.25)] px-8"
          >
            <a href={generalWhatsAppLink("Hi KFLORÉ, I'd like to ask about an order.")} target="_blank" rel="noreferrer">
              Order via WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <a
        href="#collections"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground/70 transition-colors hover:text-foreground"
        aria-label="Scroll to collections"
      >
        <ArrowDown className="h-5 w-5 animate-bounce" strokeWidth={1.25} />
      </a>
    </section>
  );
}

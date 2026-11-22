import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STORE_ADDRESS, STORE_EMAIL, STORE_HOURS, STORE_PHONE_DISPLAY, generalWhatsAppLink } from "@/lib/whatsapp";

const ROWS = [
  { icon: Phone, label: "Phone", value: STORE_PHONE_DISPLAY, href: `tel:${STORE_PHONE_DISPLAY.replace(/\s/g, "")}` },
  { icon: Mail, label: "Email", value: STORE_EMAIL, href: `mailto:${STORE_EMAIL}` },
  {
    icon: MapPin,
    label: "Studio",
    value: STORE_ADDRESS,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`,
  },
  { icon: Clock, label: "Hours", value: STORE_HOURS },
];

export function ContactSection() {
  return (
    <section id="contact" className="k-container py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <p className="eyebrow text-[hsl(var(--k-brand))]">Get in touch</p>
          <h2 className="mt-3 font-display text-4xl font-light md:text-5xl">Visit or message us</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            The fastest way to reach us is WhatsApp — send a photo for inspiration, ask about same-day availability,
            or confirm delivery charges before you check out.
          </p>

          <Button
            asChild
            size="lg"
            className="mt-7 gap-2 rounded-none bg-[hsl(var(--k-brand))] px-7 text-[hsl(var(--k-on-brand))] hover:bg-[hsl(var(--k-brand-strong))]"
          >
            <a href={generalWhatsAppLink("Hi KFLORÉ, I have a question about an order.")} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              Chat on WhatsApp
            </a>
          </Button>

          <dl className="mt-12 space-y-5 border-t k-hairline pt-8">
            {ROWS.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--k-brand))]" strokeWidth={1.25} />
                <div>
                  <dt className="eyebrow text-muted-foreground">{label}</dt>
                  {href ? (
                    <dd>
                      <a href={href} target="_blank" rel="noreferrer" className="text-sm hover:text-[hsl(var(--k-brand))]">
                        {value}
                      </a>
                    </dd>
                  ) : (
                    <dd className="text-sm">{value}</dd>
                  )}
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div
          className="relative flex min-h-[22rem] flex-col justify-end overflow-hidden border k-hairline p-8"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, hsl(var(--k-bg-alt)) 0px, hsl(var(--k-bg-alt)) 22px, hsl(var(--k-surface)) 22px, hsl(var(--k-surface)) 44px)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="h-9 w-9 text-[hsl(var(--k-brand))]" strokeWidth={1} />
          </div>
          <div className="relative border-t k-hairline bg-[hsl(var(--k-surface)/0.9)] p-4 backdrop-blur-sm">
            <p className="font-display text-sm">KFLORÉ Studio, Bangsar</p>
            <p className="mt-1 text-xs text-muted-foreground">{STORE_ADDRESS}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { PetalMotif } from "@/components/PetalMotif";

export function AboutSection() {
  return (
    <section id="about" className="k-container py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative order-2 aspect-[4/5] overflow-hidden border k-hairline bg-[hsl(var(--k-bg-alt))] md:order-1">
          <PetalMotif palette={["#5A1725", "#B89A62", "#F5F0E8"]} variant={2} className="h-full w-full" />
          <div className="absolute bottom-6 left-6 right-6 border-t k-hairline pt-4">
            <p className="font-display text-sm italic text-muted-foreground">
              &ldquo;We still cut, condition and tie every stem ourselves.&rdquo;
            </p>
          </div>
        </div>

        <div className="order-1 flex flex-col justify-center md:order-2">
          <p className="eyebrow text-[hsl(var(--k-brand))]">Our story</p>
          <h2 className="mt-3 font-display text-4xl font-light md:text-5xl">A family florist, still.</h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            <p>
              KFLORÉ began as a single flower stall and grew, one order at a time, into a studio trusted for the
              moments that matter — proposals, homecomings, condolences and grand openings across Kuala Lumpur and
              Selangor.
            </p>
            <p>
              Three generations of a florist&rsquo;s eye go into every arrangement: sourced fresh each morning,
              conditioned by hand, and styled without formula. We keep our palette deliberately restrained —
              burgundy, champagne and soft ivory — because we&rsquo;d rather an arrangement feel considered than
              crowded.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t k-hairline pt-8">
            <div>
              <dt className="eyebrow text-muted-foreground">Founded</dt>
              <dd className="mt-1 font-display text-2xl">2011</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Arrangements</dt>
              <dd className="mt-1 font-display text-2xl">40k+</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Same-day</dt>
              <dd className="mt-1 font-display text-2xl">KL &amp; Sel.</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

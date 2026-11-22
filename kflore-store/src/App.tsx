import { useState } from "react";
import { CartProvider } from "@/context/CartContext";
import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/Hero";
import { CollectionsGrid } from "@/components/CollectionsGrid";
import { ShopSection } from "@/components/ShopSection";
import { AboutSection } from "@/components/AboutSection";
import { DeliverySection } from "@/components/DeliverySection";
import { ContactSection } from "@/components/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { CartDrawer } from "@/components/CartDrawer";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSelectCollection = (slug: string) => {
    setActiveCategory(slug);
    requestAnimationFrame(() => {
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-[hsl(var(--k-bg))] text-foreground">
        <SiteNav />
        <main>
          <Hero />
          <CollectionsGrid onSelect={handleSelectCollection} />
          <ShopSection activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          <AboutSection />
          <DeliverySection />
          <ContactSection />
        </main>
        <SiteFooter />
        <WhatsAppFab />
        <CartDrawer />
        <Toaster position="bottom-left" />
      </div>
    </CartProvider>
  );
}

export default App;

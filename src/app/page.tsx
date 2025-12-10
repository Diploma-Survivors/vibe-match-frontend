import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { FooterCTA } from '@/components/landing/FooterCTA';
import { HeroSection } from '@/components/landing/HeroSection';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Background Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20">
        <Image
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop"
          alt="Background Texture"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-background/90 via-background/70 to-background" />

      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <FooterCTA />
      </div>
    </main>
  );
}

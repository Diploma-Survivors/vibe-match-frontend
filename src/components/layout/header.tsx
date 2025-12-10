'use client';

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const connectWallet = () => {
    setWalletConnected(!walletConnected);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Problems', href: '/problems' },
    { name: 'Contests', href: '/contests' },
  ];

  // SSR Safe Return (Clean layout without motion first if needed, but here we just render null or simple to prevent hydration mismatch if logic is complex)
  // For this optimized header, we'll align the SSR fallback content
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-md border-b border-border/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Vibe Match Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Vibe Match
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {/* SSR Placeholder */}
          </div>
          <Button className="flex items-center gap-2 neu-btn">
            <Wallet size={18} />
            Connect Wallet
          </Button>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? 'bg-background/70 backdrop-blur-xl border-border/10 shadow-lg'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.img
            src="/logo.svg"
            alt="Vibe Match Logo"
            className="w-8 h-8"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            Vibe Match
          </span>
        </Link>

        {/* Magnetic Navigation */}
        <div className="hidden md:flex items-center gap-2 bg-background/40 p-1 rounded-full border border-white/5 backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
                onMouseEnter={() => setHoveredPath(item.href)}
                onMouseLeave={() => setHoveredPath(null)}
              >
                {/* Active Indicator (Dot) */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Hover Background Pill */}
                <AnimatePresence>
                  {hoveredPath === item.href && (
                    <motion.div
                      layoutId="navbar-hover"
                      className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={connectWallet}
            className="flex items-center gap-2 neu-btn relative overflow-hidden group"
          >
            <motion.div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Wallet size={18} className="relative z-10" />
            <span className="relative z-10">
              {walletConnected ? 'Vũ Thế Vỹ' : 'Connect Wallet'}
            </span>
          </Button>
        </motion.div>
      </div>
    </motion.nav>
  );
}

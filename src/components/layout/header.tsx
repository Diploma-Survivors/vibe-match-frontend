'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/app-context';
import { ChevronDown, LogIn, LogOut, User, Wallet } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user, clearUserData } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    if (pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page first, then scroll
      window.location.href = `/#${id}`;
    }
  };

  const navItems = [
    { name: 'Home', href: '/', onClick: undefined },
    { name: 'Problems', href: '/problems', onClick: undefined },
    // { name: 'Contests', href: '/contests', onClick: undefined },
  ];

  const handleLogout = async () => {
    clearUserData();
    await signOut({
      callbackUrl: '/login', // Where to go after logout
      redirect: true,
    });
  };

  // Prevent hydration mismatch by not rendering until mounted
  // if (!mounted) {
  //   return (
  //     <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
  //       <div className="container mx-auto px-6 py-4 flex justify-between items-center">
  //         <Link href="/" className="flex items-center gap-3">
  //           <img src="/logo.svg" alt="SolVibe Logo" className="w-8 h-8" />
  //           <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
  //             SolVibe
  //           </span>
  //         </Link>
  //         <div className="hidden md:flex items-center space-x-8">
  //           {/* Placeholder for nav items during SSR */}
  //         </div>
  //         <Button className="flex items-center gap-2 bg-black hover:bg-black/90 text-white">
  //           <Wallet size={18} />
  //           Connect Wallet
  //         </Button>
  //       </div>
  //     </nav>
  //   );
  // }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Vibe Match Logo" className="w-8 h-8" />
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Vibe Match
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.href.startsWith('/#') ? (
                pathname === '/' ? (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="text-black hover:text-green-600 transition-colors"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="text-black hover:text-green-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                )
              ) : (
                <Link
                  href={item.href}
                  className={`transition-colors ${
                    pathname === item.href
                      ? 'text-green-600 font-semibold'
                      : 'text-black hover:text-green-600'
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-none shadow-none">
                <User size={18} />
                {user.fullName || `${user.firstName} ${user.lastName}`}
                <ChevronDown size={16} className="ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
              <LogIn size={18} />
              Go to login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

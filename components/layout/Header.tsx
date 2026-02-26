'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

// =============================================================================
// Header Component
// =============================================================================

const NAV_LINKS = [
  { href: '/mission', label: 'Our Mission' },
  { href: '/dogs', label: 'Our Dogs' },
  { href: '/stories', label: 'Stories' },
  { href: '/projects', label: 'Projects' },
  { href: '/adoption', label: 'Adopt' },
  { href: '/sponsorship', label: 'Sponsor' },
  { href: '/appeals', label: 'Appeals', highlight: true },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-white/95 backdrop-blur-sm'
      )}
    >
      <nav className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/logo.png"
            alt="Baan Maa Dog Rescue"
            width={140}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors font-medium',
                link.highlight
                  ? 'text-red-600 hover:text-red-700'
                  : 'text-sand-700 hover:text-blue-700',
                pathname === link.href && (link.highlight ? 'text-red-700' : 'text-blue-700')
              )}
            >
              {link.highlight && <span className="mr-1">❤️</span>}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link href="/donate">
            <Button size="sm">
              Donate
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 -m-2 text-sand-700 hover:text-blue-700 transition-colors"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[4.5rem] bg-white z-40 overflow-y-auto">
          <nav className="flex flex-col p-6 gap-4">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-lg font-medium py-2 border-b border-sand-200',
                  link.highlight
                    ? pathname === link.href ? 'text-red-700 font-bold' : 'text-red-600 hover:text-red-700'
                    : pathname === link.href ? 'text-blue-800 font-bold' : 'text-sand-900 hover:text-blue-700'
                )}
              >
                {link.highlight && <span className="mr-1">❤️</span>}
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link href="/donate">
                <Button fullWidth>
                  Donate Now
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

// =============================================================================
// Button with Link support
// =============================================================================

// Extend Button to support link
declare module '@/components/ui/Button' {
  interface ButtonProps {
    href?: string;
    as?: 'button' | 'a';
  }
}

// =============================================================================
// Icons
// =============================================================================

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

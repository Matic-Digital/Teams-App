'use client';
// Next.js and icon imports
import Link from 'next/link';
// import { usePathname } from 'next/navigation';

import { Box } from '@/components/global/matic-ds';


import { Logo } from '@/components/global/Logo';

import { Button } from '../ui/button';

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from 'react';

/**
 * Navigation menu items configuration
 * Each item has a URL and display label
 */
// const menuItems = [
//   { href: '/talent', label: 'Talent' },
// ];

/**
 * Header component with responsive navigation
 * Features:
 * - Desktop: Full navigation menu
 * - Mobile: Hamburger menu with slide-out sheet
 * - Sticky positioning with blur effect
 * - Consistent branding across breakpoints
 */
export function Header() {
  // const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Helper function to check if a path is active
  // const isActive = (href: string) => {
  //   if (href === '/') {
  //     return pathname === href;
  //   }
  //   return pathname?.startsWith(href);
  // };

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="bg-foreground fixed w-full top-0 z-50 px-8 py-4"
    >
      <Box className="items-center justify-between">
        {/* Desktop Navigation */}
        <Box className="flex items-center">
          <Logo />
          <Box direction="col" gap={0} className="text-background gap-0 -ml-2">
            <h3 className="leading-none">Matic</h3>
            <h3 className="leading-none">Teams</h3>
          </Box>
        </Box>

        <div className="hidden md:flex">
          {/* Desktop Menu Items */}
          <Link href="/" className="mr-6">
            <Button>Build your team</Button>
          </Link>
        </div>
      </Box>
    </motion.header>
  );
}

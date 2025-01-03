// Next.js imports
import Link from 'next/link';

import { Container, Box } from '@/components/global/matic-ds';

import { Button } from '../ui/button';
import { Logo } from './Logo';
import { LinkedInIcon } from '../icons/LinkedInIcon';
import { InstagramIcon } from '../icons/InstagramIcon';
import { FacebookIcon } from '../icons/FacebookIcon';
import { TwitterIcon } from '../icons/TwitterIcon';

/**
 * Footer component
 * Responsive footer with multiple columns of links and company information
 * Features:
 * - Responsive grid layout (2 columns on mobile, 4 on desktop)
 * - Company branding and description
 * - Organized link sections
 * - Copyright notice
 */
export function Footer() {
  return (
    <footer className="mt-24 border-t bg-[#000227] py-12">
      <Container width="full">
        <Box className="justify-between">
          <Box gap={0}>
            <Logo />
            <div className="text-white text-2xl font-bold -ml-2">Teams</div>
          </Box>
        </Box>
      </Container>
      <Container width="full">
        <Box wrap={true} gap={8} className="mt-12">
          <Box direction="col" gap={4} className="items-start md:w-1/3 md:flex-grow">
            <div className="text-maticgreen text-[10px] md:text-[12px] uppercase font-bold">Who we are</div>
            <p className="text-white w-3/4">We are a business transformation agency solving the toughest brand, digital and talent challenges next generation business faces.</p>
            <p className="text-white">See our full capabilities at <Link href="https://maticdigital.com" className="text-white font-bold">MaticDigital.com</Link></p>
            <Box gap={8}>
              <Link href=''>
                <LinkedInIcon />
              </Link>
              <Link href=''>
                <InstagramIcon />
              </Link>
              <Link href=''>
                <FacebookIcon />
              </Link>
              <Link href=''>
                <TwitterIcon />
              </Link>
            </Box>
          </Box>
          <Box direction="col" gap={4} className="items-start w-fit flex-grow">
            <div className="text-maticgreen text-[10px] md:text-[12px] uppercase font-bold">Resources</div>
            <Link href="#" className='text-white'>Services</Link>
            <Link href="#" className='text-white'>About</Link>
            <Link href="#" className='text-white'>Blog</Link>
            <Link href="#" className='text-white'>Contact</Link>
          </Box>
          <Box direction="col" gap={4} className="items-start max-w-[45vw]">
            <div className="text-maticgreen text-[10px] md:text-[12px] uppercase font-bold">Contact</div>
            <div className="text-white">(303) 248-6385</div>
            <div className="font-bold text-white">hello@maticteams.com</div>
            <div className="text-white">3456 Ringsby Court, 205 Denver, CO 80216</div>
            <Link href="#" className=''>
              <Button>Build your team</Button>
            </Link>
          </Box>

        </Box>
      </Container>
      {/* Copyright section */}
      <div className="mt-8 pt-8">
        <Container width="full" className='flex justify-between'>
          <Box gap={4} className='items-center'>
            <p className=" text-sm text-white">
              &copy; Matic Digital, {new Date().getFullYear()}
            </p>
            <Link href='#' className="text-white">Privacy Policy</Link>
          </Box>
        </Container>
      </div>
    </footer>
  );
}

'use client';

import { Box, Container } from '@/components/global/matic-ds';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as Portal from '@radix-ui/react-portal';
import Image from 'next/image';
import Link from 'next/link';
import { OverviewItem } from '@/components/shared/items/OverviewItem';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Profile {
  name: string;
  slug: string;
  profileType: string;
  headshot: string;
  rate: number | undefined;
  role: string;
  focus: string;
  level: string;
  experience: number;
  hasSamples: boolean;
  hasEval: boolean;
}

export default function ProfileNav({ profile }: { profile: Profile }) {
  const [hidden, setHidden] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const { scrollY } = useScroll();

  useEffect(() => {
    const sections = ['overview', 'samples', 'evaluation', 'experience'] as const;
    let timeoutId: NodeJS.Timeout | null = null;

    const determineActiveSection = () => {
      const scrollPosition = window.scrollY + 200; // Add offset for better detection

      interface SectionPosition {
        id: string;
        top: number;
        bottom: number;
      }

      // Get all sections and their positions
      const sectionPositions: SectionPosition[] = sections.map((sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return { id: sectionId, top: 0, bottom: 0 };
        const rect = element.getBoundingClientRect();
        return {
          id: sectionId,
          top: window.scrollY + rect.top,
          bottom: window.scrollY + rect.bottom
        };
      });

      // Find the section we're currently in
      const currentSection = sectionPositions.find(
        (section) => scrollPosition >= section.top && scrollPosition < section.bottom
      );

      if (currentSection) {
        setActiveSection(currentSection.id);
      } else if (
        sectionPositions?.[0]?.top !== undefined &&
        scrollPosition < sectionPositions[0].top
      ) {
        setActiveSection('overview');
      }
    };

    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(determineActiveSection, 50);
    };

    window.addEventListener('scroll', handleScroll);
    determineActiveSection(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (isDialogOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDialogOpen]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <Container className="sticky top-[5rem] z-[50]">
      <motion.div
        variants={{
          visible: { y: 0 },
          hidden: { y: '-5rem' }
        }}
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <Box direction="col" className="rounded-lg bg-white px-4 pt-4 shadow-lg md:hidden">
          <Box className="items-center justify-between">
            <Link href={`/talent/${profile.slug}`} className="mr-6 flex items-center gap-4">
              <Image
                src={profile.headshot}
                alt={profile.name}
                width={200}
                height={200}
                className="h-12 w-12 rounded-full object-cover"
              />
              <h2>{profile.name.split(' ')[0]}</h2>
            </Link>
            <Box gap={4} className="items-center">
              <Dialog onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className={`relative flex aspect-square items-center justify-center rounded-full border 
                        ${profile.profileType === 'Design' ? 'border-designpurpleborder bg-designpurplebg text-designpurple hover:bg-designpurple hover:opacity-80' 
                        : ''} 
                        ${profile.profileType === 'Engineering' ? 'border-engblueborder bg-engbluebg text-engblue' 
                        : ''} 
                        ${profile.profileType === 'Management' ? 'border-manpinkborder bg-manpinkbg text-manpink' 
                        : ''} 
                        ${profile.profileType === 'Strategy' ? 'border-strategygreenborder bg-strategygreenbg text-strategygreen' 
                        : ''} `}
                  >
                    <div className="absolute">$</div>
                  </Button>
                </DialogTrigger>
                <Portal.Root>
                  <DialogContent className="fixed inset-0 z-[9999] flex h-[100vh] w-[100vw] items-center justify-center bg-[#101828]/60 backdrop-blur-sm data-[state=open]:animate-in">
                    <DialogTitle asChild>
                      <VisuallyHidden>{profile.name}&apos;s Rate Information</VisuallyHidden>
                    </DialogTitle>
                    <div className="relative w-[95vw] rounded-lg bg-background p-6">
                      <Box direction="col" gap={4} className="">
                        <DialogClose asChild>
                          <Button variant="ghost" className="absolute right-4 top-4">
                            ✕
                          </Button>
                        </DialogClose>
                        <Box direction="col" gap={2} className="">
                          <h1>
                            {profile.name.split(' ')[0]}&apos;s{' '}
                            <span
                              className={` 
                                ${profile.profileType === 'Design' ? 'text-designpurple' 
                                : profile.profileType === 'Engineering' ? 'text-engblue' 
                                : profile.profileType === 'Management' ? 'text-manpink' 
                                : profile.profileType === 'Strategy' ? 'text-strategypurple' : ''} `}
                            >
                              Rate
                            </span>
                          </h1>
                          <p className="">
                            Matic Teams pays people well to do what they love. Some adjustment is
                            possible based on factors like duration, team scale, and individual
                            considerations.
                          </p>
                        </Box>
                        <Box
                          cols={3}
                          className={`flex rounded-lg border 
                            ${profile.profileType === 'Design' ? 'border-designpurpleborder bg-designpurplebg' : ''} 
                            ${profile.profileType === 'Engineering' ? 'border-engblueborder bg-engbluebg' : ''} 
                            ${profile.profileType === 'Management' ? 'border-manpinkborder bg-manpinkbg' : ''} 
                            ${profile.profileType === 'Strategy' ? 'border-strategypurpleborder bg-strategypurplebg' : ''} `}
                        >
                          <OverviewItem
                            label="Individual Hourly"
                            value={`$${profile.rate}/hr`}
                            color={profile.profileType}
                          />
                          <OverviewItem
                            label="Team Hourly"
                            value={'Contact Us'}
                            color={profile.profileType}
                          />
                          <OverviewItem
                            label="Full-Time"
                            value={'Contact Us'}
                            color={profile.profileType}
                          />
                        </Box>
                        <Box className="flex-wrap items-center justify-between gap-2">
                          <Button
                            className={`rounded-lg ${profile.profileType === 'Design' ? 'bg-design-purple' : ''} ${profile.profileType === 'Engineering' ? 'bg-engineering-blue' : ''} ${profile.profileType === 'Management' ? 'bg-manpink' : ''} ${profile.profileType === 'Strategy' ? 'bg-strategygreen' : ''} `}
                          >
                            Request Introduction
                          </Button>
                          <Box gap={2} className="">
                            <p className="">Ready to discuss?</p>
                            <Link href="#" className="">
                              <p className="">Get in Touch</p>
                            </Link>
                          </Box>
                        </Box>
                      </Box>
                    </div>
                  </DialogContent>
                </Portal.Root>
              </Dialog>
              <Button
                className={`rounded-lg 
                    ${profile.profileType === 'Design' ? 'bg-design-purple hover:bg-designpurple hover:opacity-80' : ''} 
                    ${profile.profileType === 'Engineering' ? 'bg-engineering-blue hover:bg-engblue hover:opacity-80' : ''} 
                    ${profile.profileType === 'Management' ? 'bg-manpink hover:bg-manpink hover:opacity-80' : ''} 
                    ${profile.profileType === 'Strategy' ? 'bg-strategygreen hover:bg-strategygreen hover:opacity-80' : ''} `}
              >
                Inquire
              </Button>
            </Box>
          </Box>
          <Box className="">
            <Link
              href="#overview"
              className={`flex flex-grow items-center justify-center p-4 text-sm ${
                activeSection === 'overview'
                  ? profile.profileType === 'Design'
                    ? 'border-b-4 border-designpurple font-semibold'
                    : profile.profileType === 'Engineering'
                      ? 'border-b-4 border-engblue font-semibold'
                      : 'font-semibold'
                  : 'border-b-4 border-transparent'
              }`}
            >
              Overview
            </Link>
            {profile.hasSamples && (
              <Link
                href="#samples"
                className={`flex flex-grow items-center justify-center p-4 text-sm ${
                  activeSection === 'samples'
                    ? profile.profileType === 'Design'
                      ? 'border-b-4 border-designpurple font-semibold'
                      : profile.profileType === 'Engineering'
                        ? 'border-b-4 border-engblue font-semibold'
                        : profile.profileType === 'Strategy'
                          ? 'border-b-4 border-strategygreen font-semibold'
                          : profile.profileType === 'Management'
                            ? 'border-b-4 border-manpink font-semibold'
                            : 'font-semibold'
                    : 'border-b-4 border-transparent'
                }`}
              >
                Samples
              </Link>
            )}
            {profile.hasEval && (
              <Link
                href="#evaluation"
                className={`flex flex-grow items-center justify-center p-4 text-sm ${activeSection === 'evaluation' ? 'font-semibold text-blue-600' : ''}`}
              >
                Evaluation
              </Link>
            )}
            <Link
              href="#experience"
              className={`flex flex-grow items-center justify-center border-b-4 p-4 text-sm ${
                activeSection === 'experience'
                  ? profile.profileType === 'Design'
                    ? 'border-designpurple font-semibold'
                    : profile.profileType === 'Engineering'
                      ? 'border-engblue font-semibold'
                      : profile.profileType === 'Strategy'
                        ? 'border-strategygreen font-semibold'
                        : profile.profileType === 'Management'
                          ? 'border-manpink font-semibold'
                          : 'font-semibold'
                  : 'border-transparent'
              }`}
            >
              Experience
            </Link>
          </Box>
        </Box>
        <Box direction="col" className="hidden rounded-lg bg-white px-4 pt-1 shadow-lg md:flex">
          <Box className="justify-between">
            <Box gap={4} className="items-center">
              <Link href={`/talent/${profile.slug}`} className="mr-6 flex items-center gap-4">
                <Image
                  src={profile.headshot}
                  alt={profile.name}
                  width={200}
                  height={200}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <h2>{profile.name.split(' ')[0]}</h2>
              </Link>
            </Box>
            <Box>
              <Link
                href="#overview"
                className={`flex items-center justify-center p-4 text-sm ${
                  activeSection === 'overview'
                    ? profile.profileType === 'Design'
                      ? 'border-b-4 border-designpurple font-semibold'
                      : profile.profileType === 'Engineering'
                        ? 'border-b-4 border-engblue font-semibold'
                        : profile.profileType === 'Strategy'
                          ? 'border-b-4 border-strategygreen font-semibold'
                          : profile.profileType === 'Management'
                            ? 'border-b-4 border-manpink font-semibold'
                            : 'font-semibold'
                    : 'border-b-4 border-transparent'
                }`}
              >
                Overview
              </Link>
              {profile.hasSamples && (
                <Link
                  href="#samples"
                  className={`flex items-center justify-center p-4 text-sm ${
                    activeSection === 'samples'
                      ? profile.profileType === 'Design'
                        ? 'border-b-4 border-designpurple font-semibold'
                        : profile.profileType === 'Engineering'
                          ? 'border-b-4 border-engblue font-semibold'
                          : profile.profileType === 'Strategy'
                            ? 'border-b-4 border-strategygreen font-semibold'
                            : profile.profileType === 'Management'
                              ? 'border-b-4 border-manpink font-semibold'
                          : 'font-semibold'
                      : 'border-b-4 border-transparent'
                  }`}
                >
                  Samples
                </Link>
              )}
              {profile.hasEval && (
                <Link
                  href="#evaluation"
                  className={`flex items-center justify-center p-4 text-sm ${
                    activeSection === 'evaluation'
                      ? profile.profileType === 'Design'
                        ? 'border-b-4 border-designpurple font-semibold'
                        : profile.profileType === 'Engineering'
                          ? 'border-b-4 border-engblue font-semibold'
                          : profile.profileType === 'Strategy'
                            ? 'border-b-4 border-strategygreen font-semibold'
                            : profile.profileType === 'Management'
                              ? 'border-b-4 border-manpink font-semibold'
                          : 'font-semibold'
                      : 'border-b-4 border-transparent'
                  }`}
                >
                  Evaluation
                </Link>
              )}
              <Link
                href="#experience"
                className={`flex items-center justify-center border-b-4 p-4 text-sm ${
                  activeSection === 'experience'
                    ? profile.profileType === 'Design'
                      ? 'border-designpurple font-semibold'
                      : profile.profileType === 'Engineering'
                        ? 'border-engblue font-semibold'
                        : profile.profileType === 'Strategy'
                          ? 'border-strategygreen font-semibold'
                          : profile.profileType === 'Management'
                            ? 'border-manpink font-semibold'
                        : 'font-semibold'
                    : 'border-transparent'
                }`}
              >
                Experience
              </Link>
            </Box>
            <Box gap={4} className="items-center">
              <Dialog onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className={`relative flex aspect-square items-center justify-center rounded-full border 
                        ${profile.profileType === 'Design' ? 'border-designpurpleborder bg-designpurplebg text-designpurple' : ''} 
                        ${profile.profileType === 'Engineering' ? 'border-engblueborder bg-engbluebg text-engblue' : ''} 
                        ${profile.profileType === 'Management' ? 'border-manpinkborder bg-manpinkbg text-manpink' : ''} 
                        ${profile.profileType === 'Strategy' ? 'border-strategygreenborder bg-strategygreenbg text-strategygreen' : ''} `}
                  >
                    <div className="absolute">$</div>
                  </Button>
                </DialogTrigger>
                <Portal.Root>
                  <DialogContent className="fixed inset-0 z-[9999] flex h-[100vh] w-[100vw] items-center justify-center bg-[#101828]/60 backdrop-blur-sm data-[state=open]:animate-in">
                    <DialogTitle asChild>
                      <VisuallyHidden>{profile.name}&apos;s Rate Information</VisuallyHidden>
                    </DialogTitle>
                    <div className="relative w-[39.333rem] rounded-lg bg-background p-8">
                      <Box direction="col" gap={4} className="items-center">
                        <DialogClose asChild>
                          <Button variant="ghost" className="absolute right-4 top-4">
                            ✕
                          </Button>
                        </DialogClose>
                        <Box direction="col" gap={2} className="">
                          <h1>
                            {profile.name.split(' ')[0]}&apos;s{' '}
                            <span
                              className={` 
                                ${profile.profileType === 'Design' ? 'text-design-purple' 
                                : profile.profileType === 'Engineering' ? 'text-engineering-blue' 
                                : profile.profileType === 'Management' ? 'text-manpink' 
                                : profile.profileType === 'Strategy' ? 'text-strategygreen' : ''} `}
                            >
                              Rate
                            </span>
                          </h1>
                          <p className="">
                            Matic Teams pays people well to do what they love. Some adjustment is
                            possible based on factors like duration, team scale, and individual
                            considerations.
                          </p>
                        </Box>
                        <Box
                          cols={3}
                          className={`flex w-full rounded-lg border 
                            ${profile.profileType === 'Design' ? 'border-designpurpleborder bg-designpurplebg' 
                            : profile.profileType === 'Engineering' ? 'border-engblueborder bg-engbluebg' 
                            : profile.profileType === 'Management' ? 'border-manpinkborder bg-manpinkbg' 
                            : profile.profileType === 'Strategy' ? 'border-strategygreenborder bg-strategygreenbg' : ''} `}
                        >
                          <OverviewItem
                            label="Individual Hourly"
                            value={`$${profile.rate}`}
                            color={profile.profileType}
                          />
                          <OverviewItem
                            label="Team Hourly"
                            value={'Contact Us'}
                            color={profile.profileType}
                          />
                          <OverviewItem
                            label="Full-Time"
                            value={'Contact Us'}
                            color={profile.profileType}
                          />
                        </Box>
                        <Box className="w-full items-center justify-between">
                          <Button
                            className={` 
                                ${profile.profileType === 'Design' ? 'bg-designpurple' 
                                : profile.profileType === 'Engineering' ? 'bg-engblue' 
                                : profile.profileType === 'Management' ? 'bg-manpink' 
                                : profile.profileType === 'Strategy' ? 'bg-strategygreen' : ''} `}
                          >
                            Request Introduction
                          </Button>
                          <Box gap={2} className="">
                            <p className="">Ready to discuss?</p>
                            <Link href="#" className="">
                              <p className="font-semibold hover:text-maticgreen">Get in Touch</p>
                            </Link>
                          </Box>
                        </Box>
                      </Box>
                    </div>
                  </DialogContent>
                </Portal.Root>
              </Dialog>
              <Button
                className={` 
                    ${profile.profileType === 'Design' ? 'bg-design-purple' 
                    : profile.profileType === 'Engineering' ? 'bg-engineering-blue' 
                    : profile.profileType === 'Management' ? 'bg-manpink' 
                    : profile.profileType === 'Strategy' ? 'bg-strategygreen' : ''} rounded-lg`}
              >
                Inquire
              </Button>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
}

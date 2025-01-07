'use client';

import { useState, useEffect, type TouchEvent } from 'react';
import { Box, Container } from '@/components/global/matic-ds';
import { Prose } from '@/components/global/matic-ds';
import { Button } from '@/components/ui/button';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import type { WorkSample } from '@/types/contentful';

interface ProfileWorkSamplesProps {
  type: string;
  samples: WorkSample[];
}

const options = {
  renderText: (text: string) => {
    return text.split('\n').reduce(
      (children: (string | JSX.Element)[], textSegment: string, index: number) => {
        const elements: (string | JSX.Element)[] = [];
        if (index > 0) elements.push(<br key={index} />);
        elements.push(textSegment);
        return [...children, ...elements];
      },
      [] as (string | JSX.Element)[]
    );
  }
};

export default function ProfileWorkSamples({ type, samples }: ProfileWorkSamplesProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const touchThreshold = 50;

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchStart(touch.clientX);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchEnd(touch.clientX);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > touchThreshold;
    const isRightSwipe = distance < -touchThreshold;

    if (isLeftSwipe || isRightSwipe) {
      const currentSample = samples[currentSampleIndex];
      const totalImages = currentSample?.sampleGalleryCollection?.items?.length ?? 0;
      if (totalImages > 1) {
        setCurrentImageIndex((prev) => {
          if (isLeftSwipe) {
            return (prev + 1) % totalImages;
          } else {
            return (prev - 1 + totalImages) % totalImages;
          }
        });
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleImageNavigation = (direction: 'left' | 'right') => {
    const currentSample = samples[currentSampleIndex];
    const totalImages = currentSample?.sampleGalleryCollection?.items?.length ?? 0;
    if (totalImages > 1) {
      if (direction === 'right') {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
      } else {
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
      }
    }
  };

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

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDialogOpen) {
        setIsDialogOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isDialogOpen]);

  if (!samples.length) {
    return null;
  }

  const currentSample = samples[currentSampleIndex];
  if (!currentSample) {
    return null;
  }

  const handlePreviousSample = () => {
    setCurrentSampleIndex((prev) => (prev > 0 ? prev - 1 : samples.length - 1));
    setCurrentImageIndex(0); // Reset image index for new sample
  };

  const handleNextSample = () => {
    setCurrentSampleIndex((prev) => (prev < samples.length - 1 ? prev + 1 : 0));
    setCurrentImageIndex(0); // Reset image index for new sample
  };

  return (
    <Container id="samples" className="scroll-mt-16">
      <Box direction="col" className="rounded-lg bg-white p-4 shadow-lg md:p-8">
        <Box className="mb-8">
          <h1 className="">
            Work{' '}
            <span
              className={` ${type === 'Design' ? 'text-design-purple' : type === 'Engineering' ? 'text-engineering-blue' : ''} `}
            >
              Samples
            </span>
          </h1>
        </Box>

        <Box gap={{ base: 2, md: 8 }} cols={{ base: 1, md: 2 }}>
          {[...samples].reverse().map((workSample, index) => (
            <Box key={workSample.sys.id ?? index} className="">
              <Dialog onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="relative aspect-[4/3] h-full w-full overflow-hidden rounded-lg p-0 transition-all">
                    {workSample.featuredImage?.url && (
                      <Image
                        src={workSample.featuredImage.url}
                        alt={`${workSample.sampleName} - Featured Image`}
                        width={450}
                        height={400}
                        className="absolute h-full w-full rounded-md object-cover"
                        priority={false}
                      />
                    )}
                    <Box
                      direction="col"
                      gap={{ base: 2, md: 4 }}
                      className="absolute z-20 h-full w-full items-start justify-end bg-gradient-to-b from-[#000227]/0 via-[#000227]/50 to-[#000227]/100 p-4 md:p-8"
                    >
                      <h1 className="text-[1rem] font-semibold md:text-[1.67rem]">
                        {workSample.sampleName}
                      </h1>
                      <h3 className="text-[0.8rem] font-medium md:text-[1.2rem]">
                        {workSample.sampleType} • {workSample.title}
                      </h3>
                    </Box>
                  </Button>
                </DialogTrigger>
                <DialogContent className="fixed inset-0 z-[90] flex items-center justify-center bg-[#101828]/60 backdrop-blur-md">
                  <DialogTitle asChild>
                    <VisuallyHidden>{currentSample.sampleName}</VisuallyHidden>
                  </DialogTitle>
                  <div className="h-screen w-screen md:h-[90vh] md:w-[90vw]">
                    <Container
                      width="full"
                      className="relative flex h-full w-full flex-col border bg-white p-4 md:rounded-lg md:p-6"
                    >
                      <div className="absolute right-6 top-8 z-10 flex items-center md:right-4 md:top-4">
                        <div className="mr-8 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviousSample();
                            }}
                            className="z-50 flex items-center justify-center p-2 text-sm"
                            aria-label="Previous work sample"
                          >
                            <ChevronLeftIcon className="h-4 w-4" /> Prev
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNextSample();
                            }}
                            className="z-50 flex items-center justify-center p-2 text-sm"
                            aria-label="Next work sample"
                          >
                            Next <ChevronRightIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <DialogClose className="mr-4 text-gray-500 hover:text-gray-700">
                          <span className="sr-only">Close</span>✕
                        </DialogClose>
                      </div>

                      <Box direction="col" className="flex h-full flex-col pt-16 md:pt-0">
                        <Box direction="col" gap={2} className="mb-4 flex-shrink-0">
                          <h1 className="text-2xl font-bold">{currentSample.sampleName}</h1>
                          <h3 className="text-xl font-semibold">{currentSample.title}</h3>
                        </Box>

                        <Box
                          direction={{ base: 'col', md: 'row' }}
                          gap={8}
                          className="mb-6 flex-shrink-0"
                        >
                          <Box direction="col" className="md:w-2/3">
                            <h5 className="text-[10px] font-bold uppercase text-[#a4a7ae] md:text-[12px]">
                              Summary
                            </h5>
                            <div className="mt-2">
                              {currentSample.briefDescription?.json && (
                                <Prose className="matic spaced prose max-w-prose text-base leading-7 prose-headings:font-semibold">
                                  {documentToReactComponents(
                                    currentSample.briefDescription.json,
                                    options
                                  )}
                                </Prose>
                              )}
                            </div>
                          </Box>

                          {currentSample.roleTags && currentSample.roleTags.length > 0 && (
                            <Box direction="col" className="hidden md:flex md:w-1/3">
                              <h5 className="text-[10px] font-bold uppercase text-[#a4a7ae] md:text-[12px]">
                                Tactics
                              </h5>
                              <Box direction="col" className="mt-2 gap-2">
                                {currentSample.roleTags.map((tag: string, tagIndex: number) => (
                                  <div
                                    key={tagIndex}
                                    className="text-[10px] font-bold md:text-[12px]"
                                  >
                                    {tag}
                                  </div>
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Box>

                        <Box
                          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-[#f5f5f5]"
                          direction="col"
                        >
                          {(() => {
                            const currentSample = samples[currentSampleIndex];
                            const galleryItems = currentSample?.sampleGalleryCollection?.items;
                            const currentImage = galleryItems?.[currentImageIndex];

                            if (!currentSample || !galleryItems || galleryItems.length === 0) {
                              if (!currentSample?.featuredImage?.url) {
                                return null;
                              }

                              return (
                                <div className="relative min-h-0 flex-1">
                                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                                    <Image
                                      src={currentSample.featuredImage.url}
                                      alt={`${currentSample.sampleName} - Featured Image`}
                                      fill
                                      className="object-contain"
                                      priority={true}
                                    />
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <>
                                {galleryItems.length > 1 && (
                                  <div className="flex items-center justify-between px-4 py-2">
                                    <div className="flex justify-center gap-2">
                                      {galleryItems.map((_, index) => (
                                        <div
                                          key={index}
                                          className={`h-2 w-2 rounded-full ${
                                            index === currentImageIndex
                                              ? 'bg-gray-900'
                                              : 'bg-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleImageNavigation('left');
                                        }}
                                        className="rounded-full bg-white p-2 hover:bg-gray-50"
                                        aria-label="Previous image"
                                      >
                                        <ChevronLeftIcon className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleImageNavigation('right');
                                        }}
                                        className="rounded-full bg-white p-2 hover:bg-gray-50"
                                        aria-label="Next image"
                                      >
                                        <ChevronRightIcon className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                                <div className="relative min-h-0 flex-1">
                                  <div
                                    className="absolute inset-0 overflow-hidden rounded-lg"
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                  >
                                    {currentImage?.url && (
                                      <Image
                                        src={currentImage.url}
                                        alt={`${currentSample.sampleName} - Image ${currentImageIndex + 1}`}
                                        fill
                                        className="object-contain"
                                        priority={true}
                                      />
                                    )}
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </Box>
                      </Box>
                    </Container>
                  </div>
                </DialogContent>
              </Dialog>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

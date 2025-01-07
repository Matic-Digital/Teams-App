'use client';

import { useState, useEffect } from 'react';
import { Box, Container } from '@/components/global/matic-ds';
import { Prose } from '@/components/global/matic-ds';
import { Button } from '@/components/ui/button';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from "next/image";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import type { WorkSample } from '@/types/contentful';

interface ProfileWorkSamplesProps {
    type: string;
    samples: WorkSample[];
}

const options = {
    renderText: (text: string) => {
        return text.split('\n').reduce((children: (string | JSX.Element)[], textSegment: string, index: number) => {
            const elements: (string | JSX.Element)[] = [];
            if (index > 0) elements.push(<br key={index} />);
            elements.push(textSegment);
            return [...children, ...elements];
        }, [] as (string | JSX.Element)[]);
    },
};

export default function ProfileWorkSamples({ type, samples }: ProfileWorkSamplesProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentSampleIndex, setCurrentSampleIndex] = useState(0);

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
        <Container id="samples">
            <Box direction="col" className="p-4 md:p-8 shadow-lg rounded-lg bg-white">
                <Box className="mb-8">
                    <h1 className="">Work <span className={` ${type === 'Design' ? 'text-design-purple' : type === 'Engineering' ? 'text-engineering-blue' : ''} `}>Samples</span></h1>
                </Box>

                <Box gap={{ base: 2, md: 8 }} cols={{ base: 1, md: 2 }}>
                    {[...samples].reverse().map((workSample, index) => (
                        <Box key={workSample.sys.id ?? index} className="">
                            <Dialog onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full h-full aspect-[4/3] p-0 relative rounded-lg overflow-hidden transition-all">
                                        {workSample.featuredImage?.url && (
                                            <Image
                                                src={workSample.featuredImage.url}
                                                alt={`${workSample.sampleName} - Featured Image`}
                                                width={450}
                                                height={400}
                                                className="w-full h-full rounded-md object-cover absolute"
                                                priority={false}
                                            />
                                        )}
                                        <Box direction="col" gap={{ base: 2, md: 4 }} className="z-20 bg-gradient-to-b from-[#000227]/0 via-[#000227]/50 to-[#000227]/100 absolute w-full h-full justify-end items-start p-4 md:p-8">
                                            <h1 className="font-semibold text-[1rem] md:text-[1.67rem]">{workSample.sampleName}</h1>
                                            <h3 className="font-medium text-[0.8rem] md:text-[1.2rem]">{workSample.sampleType} • {workSample.title}</h3>
                                        </Box>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="backdrop-blur-md bg-[#101828]/60 fixed inset-0 flex items-center justify-center z-[90]">
                                    <DialogTitle asChild>
                                        <VisuallyHidden>{currentSample.sampleName}</VisuallyHidden>
                                    </DialogTitle>
                                    <div className="w-[90vw] h-[90vh]">
                                        <Container className="bg-white relative p-4 md:p-6 md:rounded-lg w-full h-full flex flex-col">
                                            <div className="absolute right-4 top-4 flex items-center z-10">
                                                <div className="flex items-center gap-2 mr-8">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePreviousSample();
                                                        }}
                                                        className="bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-50"
                                                        aria-label="Previous work sample"
                                                    >
                                                        <ChevronLeftIcon className="w-6 h-6" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleNextSample();
                                                        }}
                                                        className="bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-50"
                                                        aria-label="Next work sample"
                                                    >
                                                        <ChevronRightIcon className="w-6 h-6" />
                                                    </button>
                                                </div>
                                                <DialogClose className="text-gray-500 hover:text-gray-700 mr-4">
                                                    <span className="sr-only">Close</span>
                                                    ✕
                                                </DialogClose>
                                            </div>

                                            <Box direction="col" className="h-full flex flex-col">
                                                <Box direction="col" gap={2} className="flex-shrink-0 mb-4">
                                                    <h1 className="text-2xl font-bold">{currentSample.sampleName}</h1>
                                                    <h3 className="text-xl font-semibold">{currentSample.title}</h3>
                                                </Box>

                                                <Box direction={{ base: 'col', md: 'row' }} gap={8} className="flex-shrink-0 mb-6">
                                                    <Box direction="col" className="md:w-2/3">
                                                        <h5 className="text-[10px] md:text-[12px] uppercase font-bold text-[#a4a7ae]">Summary</h5>
                                                        <div className="mt-2">
                                                            {currentSample.briefDescription?.json && (
                                                                <Prose className="matic spaced prose max-w-prose text-base leading-7 prose-headings:font-semibold">
                                                                    {documentToReactComponents(currentSample.briefDescription.json, options)}
                                                                </Prose>
                                                            )}
                                                        </div>
                                                    </Box>

                                                    {currentSample.roleTags && currentSample.roleTags.length > 0 && (
                                                        <Box direction="col" className="md:w-1/3">
                                                            <h5 className="text-[10px] md:text-[12px] uppercase font-bold text-[#a4a7ae]">Tactics</h5>
                                                            <Box direction="col" className="mt-2 gap-2">
                                                                {currentSample.roleTags.map((tag: string, tagIndex: number) => (
                                                                    <div key={tagIndex} className="font-bold text-[10px] md:text-[12px]">{tag}</div>
                                                                ))}
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </Box>

                                                <Box className="flex-1 min-h-0 flex flex-col" direction="col">
                                                    <div className="relative flex-1 min-h-0">
                                                        {currentSample.sampleGalleryCollection?.items && currentSample.sampleGalleryCollection.items.length > 0 ? (
                                                            <div className="absolute inset-0 rounded-lg overflow-hidden">
                                                                <Image
                                                                    src={currentSample.sampleGalleryCollection.items[currentImageIndex]?.url ?? ''}
                                                                    alt={`${currentSample.sampleName} - Image ${currentImageIndex + 1}`}
                                                                    fill
                                                                    className="object-contain"
                                                                    priority={true}
                                                                />
                                                            </div>
                                                        ) : currentSample.featuredImage?.url ? (
                                                            <div className="absolute inset-0 rounded-lg overflow-hidden">
                                                                <Image
                                                                    src={currentSample.featuredImage.url}
                                                                    alt={`${currentSample.sampleName} - Featured Image`}
                                                                    fill
                                                                    className="object-contain"
                                                                    priority={true}
                                                                />
                                                            </div>
                                                        ) : null}
                                                    </div>

                                                    {(currentSample.sampleGalleryCollection?.items?.length ?? 0) > 1 && (
                                                        <div className="mt-4 overflow-x-auto flex-shrink-0">
                                                            <div className="flex gap-4 justify-start min-w-0 pb-2">
                                                                {currentSample.sampleGalleryCollection?.items?.map((image, thumbIndex) => (
                                                                    <button
                                                                        key={thumbIndex}
                                                                        onClick={() => setCurrentImageIndex(thumbIndex)}
                                                                        className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all ${
                                                                            thumbIndex === currentImageIndex
                                                                                ? 'ring-2 ring-blue-600 ring-offset-2'
                                                                                : 'opacity-70 hover:opacity-100'
                                                                        }`}
                                                                        aria-label={`Go to image ${thumbIndex + 1}`}
                                                                    >
                                                                        {image?.url && (
                                                                            <Image
                                                                                src={image.url}
                                                                                alt={`${currentSample.sampleName} - Thumbnail ${thumbIndex + 1}`}
                                                                                width={64}
                                                                                height={64}
                                                                                className="object-cover w-full h-full"
                                                                            />
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
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
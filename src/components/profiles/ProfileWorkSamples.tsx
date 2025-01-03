'use client';

import { useState } from 'react';
import { Box, Container } from '@/components/global/matic-ds';
import { Prose } from '@/components/global/matic-ds';
import { Button } from "../ui/button";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
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

    return (
        <Container id="samples">
            <Box direction="col" className="p-4 md:p-8 shadow-lg rounded-lg bg-white">
                <Box className="mb-8">
                    <h1 className="">Work <span className={` ${type === 'Design' ? 'text-design-purple' : type === 'Engineering' ? 'text-engineering-blue' : ''} `}>Samples</span></h1>
                </Box>

                <Box gap={{ base: 2, md: 8 }} cols={{ base: 1, md: 2 }}>
                    {[...samples].reverse().map((workSample, index) => (
                        <Box key={workSample.sys.id ?? index} className="">
                            <Dialog>
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
                                <DialogContent className="backdrop-blur-md bg-[#101828]/60 fixed h-screen w-screen top-0 flex left-0 z-50">
                                    <DialogTitle asChild>
                                        <VisuallyHidden>{workSample.sampleName}</VisuallyHidden>
                                    </DialogTitle>
                                    <Container className="bg-white m-auto relative p-6 rounded-lg max-w-4xl w-[90vw] max-h-[80vh] overflow-auto">
                                        <DialogClose className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
                                            <span className="sr-only">Close</span>
                                            ✕
                                        </DialogClose>

                                        <h1 className="text-2xl font-bold mb-4">{workSample.sampleName}</h1>

                                        <Box direction={{ base: 'col', md: 'row' }} gap={8} className="">
                                            <Box direction="col" gap={2}>
                                                <h5 className="text-[10px] md:text-[12px] uppercase font-bold text-[#a4a7ae]">Summary</h5>
                                                <h3 className="text-xl font-semibold">{workSample.title}</h3>
                                                <div className="mt-2">
                                                    {workSample.briefDescription?.json && (
                                                        <Prose className="matic spaced prose max-w-prose text-base leading-7 prose-headings:font-semibold">
                                                            {documentToReactComponents(workSample.briefDescription.json, options)}
                                                        </Prose>
                                                    )}
                                                </div>
                                            </Box>

                                            {workSample.roleTags && workSample.roleTags.length > 0 && (
                                                <Box direction="col" className="">
                                                    <h5 className="text-[10px] md:text-[12px] uppercase font-bold text-[#a4a7ae]">Tactics</h5>
                                                    <Box direction="col" className="mt-4 gap-2">
                                                        {workSample.roleTags.map((tag: string, tagIndex: number) => (
                                                            <div key={tagIndex} className="">{tag}</div>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>

                                        <Box className="relative rounded-lg" direction="col">
                                            {workSample.sampleGalleryCollection?.items?.map((image, imageIndex) => {
                                                if (!image?.url || imageIndex !== currentImageIndex) return null;
                                                return (
                                                    <Image
                                                        key={`${workSample.sys.id}-${imageIndex}`}
                                                        src={image.url}
                                                        alt={`${workSample.sampleName} - Image ${imageIndex + 1}`}
                                                        width={800}
                                                        height={600}
                                                        className="w-full aspect-[4/3] object-contain rounded-lg"
                                                    />
                                                );
                                            })}

                                            {(workSample.sampleGalleryCollection?.items?.length ?? 0) > 1 && (
                                                <div className=" overflow-x-auto">
                                                    <div className="flex gap-2 justify-center min-w-0">
                                                        {workSample.sampleGalleryCollection?.items?.map((image, thumbIndex) => (
                                                            <button
                                                                key={thumbIndex}
                                                                onClick={() => setCurrentImageIndex(thumbIndex)}
                                                                className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition-all ${thumbIndex === currentImageIndex
                                                                    ? 'ring-2 ring-blue-600 ring-offset-2'
                                                                    : 'opacity-70 hover:opacity-100'
                                                                    }`}
                                                                aria-label={`Go to image ${thumbIndex + 1}`}
                                                            >
                                                                {image?.url && (
                                                                    <Image
                                                                        src={image.url}
                                                                        alt={`${workSample.sampleName} - Thumbnail ${thumbIndex + 1}`}
                                                                        width={80}
                                                                        height={80}
                                                                        className="object-cover w-full h-full"
                                                                    />
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </Box>
                                    </Container>
                                </DialogContent>
                            </Dialog>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}
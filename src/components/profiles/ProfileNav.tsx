'use client';

import { Box, Container } from '@/components/global/matic-ds';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import Image from 'next/image';
import Link from 'next/link';
import OverviewItem from './OverviewItem';

interface Profile {
    name: string;
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
    return (
        <Container id='overview' className='sticky top-0 z-[100]'>
            <Box direction="col" className="shadow-lg px-4 pt-4 rounded-lg md:hidden bg-white">
                <Box className="items-center justify-between">
                    <Box gap={4} className="items-center">
                        <Image src={profile.headshot} alt={profile.name} width={200} height={200} className="rounded-full w-12 h-12 object-cover" />
                        <h2>{profile.name.split(' ')[0]}</h2>
                    </Box>
                    <Box gap={4} className="items-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className={`
                                    rounded-full flex aspect-square items-center justify-center relative border
                                    ${profile.profileType === 'Design' ? 'bg-designpurple' : ''}
                                    ${profile.profileType === 'Engineering' ? 'bg-engbluebg border-engblueborder text-engblue' : ''}
                                    ${profile.profileType === 'Management' ? 'bg-manpinkbg border-manpinkborder text-manpink' : ''}
                                `}>
                                    <div className="absolute">$</div>
                                </Button>
                            </DialogTrigger>
                            <DialogTitle className='hidden'>
                                We&apos;re here to help
                            </DialogTitle>
                            <DialogContent className="fixed flex w-screen h-screen top-0 left-0 backdrop-blur-sm bg-[#101828]/60">
                                <Container className="w-[39.333rem] m-auto py-8 bg-background rounded-lg relative">
                                    <Box direction="col" gap={4} className="items-center">
                                        <DialogClose asChild>
                                            <Button variant='ghost' className="absolute right-4 top-4">
                                                X
                                            </Button>
                                        </DialogClose>
                                        <Box direction="col" gap={2} className="">
                                            <h1>{profile.name.split(' ')[0]}&apos;s <span className={`
                                                ${profile.profileType === 'Design' ? 'text-designpurple' : profile.profileType === 'Engineering' ? 'text-engblue' : ''}
                                            `}>Rate</span></h1>
                                            <p className="">
                                                Matic Teams pays people well to do what they love. Some adjustment is possible based on factors like duration, team scale, and individual considerations.
                                            </p>
                                        </Box>
                                        <Box cols={3} className={`
                                            border rounded-lg flex
                                            ${profile.profileType === 'Design' ? 'border-[#d6bbfb] bg-[#fcfaff]' : ''}
                                        `}>
                                            <OverviewItem label="Individual Hourly" value={`$${profile.rate}`} color={profile.profileType} />
                                            <OverviewItem label="Team Hourly" value={'Contact Us'} color={profile.profileType} />
                                            <OverviewItem label="Full-Time" value={'Contact Us'} color={profile.profileType} />
                                        </Box>
                                        <Box className="justify-between items-center">
                                            <Button>Request Introduction</Button>
                                            <Box gap={2} className="">
                                                <p className="">Ready to discuss?</p>
                                                <Link href="#" className="">
                                                    <p className="">Get in Touch</p>
                                                </Link>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Container>
                            </DialogContent>
                        </Dialog>
                        <Button className={`
                            rounded-lg hover:bg-blue-100
                            ${profile.profileType === 'Design' ? 'bg-design-purple' : ''}
                            ${profile.profileType === 'Engineering' ? 'bg-engineering-blue' : ''}
                            ${profile.profileType === 'Management' ? 'bg-manpink' : ''}
                        `}>
                            Inquire
                        </Button>
                    </Box>
                </Box>
                <Box className="">
                    <Link href="#overview" className={`flex flex-grow items-center justify-center p-4 text-sm`}>Overview</Link>
                    {profile.hasSamples && (
                        <Link href="#samples" className={`flex flex-grow items-center justify-center p-4 text-sm`}>Samples</Link>
                    )}
                    {profile.hasEval && (
                        <Link href="#evaluation" className={`flex flex-grow items-center justify-center p-4 text-sm`}>Evaluation</Link>
                    )}
                    <Link href="#experience" className={`flex flex-grow items-center justify-center p-4 text-sm`}>Experience</Link>
                </Box>
            </Box>
            <Box direction="col" className="shadow-lg hidden md:flex bg-white rounded-lg py-2 px-4">
                <Box className="justify-between">
                    <Box gap={4} className="items-center">
                        <Image src={profile.headshot} alt={profile.name} width={200} height={200} className="rounded-full w-12 h-12 object-cover" />
                        <h2>{profile.name.split(' ')[0]}</h2>
                    </Box>
                    <Box>
                        <Link href="#overview" className={`flex items-center justify-center p-4 text-sm`}>Overview</Link>
                        {profile.hasSamples && (
                            <Link href="#samples" className={`flex items-center justify-center p-4 text-sm`}>Samples</Link>
                        )}
                        {profile.hasEval && (
                            <Link href="#evaluation" className={`flex items-center justify-center p-4 text-sm`}>Evaluation</Link>
                        )}
                        <Link href="#experience" className={`flex items-center justify-center p-4 text-sm`}>Experience</Link>
                    </Box>
                    <Box gap={4} className="items-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className={`
                                    rounded-full flex aspect-square items-center justify-center relative border
                                    ${profile.profileType === 'Design' ? 'bg-designpurplebg border-designpurpleborder text-designpurple' : ''}
                                    ${profile.profileType === 'Engineering' ? 'bg-engbluebg border-engblueborder text-engblue' : ''}
                                    ${profile.profileType === 'Management' ? 'bg-manpinkbg border-manpinkborder text-manpink' : ''}
                                `}>
                                    <div className="absolute">$</div>
                                </Button>
                            </DialogTrigger>
                            <DialogTitle className='hidden'>
                                We&apos;re here to help
                            </DialogTitle>
                            <DialogContent className="fixed flex w-screen h-screen top-0 left-0 backdrop-blur-sm bg-[#101828]/60">
                                <Container className=" w-[45vw] p-6 my-auto bg-background rounded-lg relative h-fit">
                                    <Box direction="col" gap={4} className="items-center">
                                        <DialogClose asChild>
                                            <Button variant='ghost' className="absolute right-4 top-4">
                                                X
                                            </Button>
                                        </DialogClose>
                                        <Box direction="col" gap={2} className="">
                                            <h1>{profile.name.split(' ')[0]}&apos;s <span className={`
                                                ${profile.profileType === 'Design' ? 'text-design-purple' : profile.profileType === 'Engineering' ? 'text-engineering-blue' : ''}
                                            `}>Rate</span></h1>
                                            <p className="">
                                                Matic Teams pays people well to do what they love. Some adjustment is possible based on factors like duration, team scale, and individual considerations.
                                            </p>
                                        </Box>
                                        <Box cols={3} className={`
                                            border rounded-lg flex w-full
                                            ${profile.profileType === 'Design' ? 'border-designpurpleborder bg-designpurplebg' : ''}
                                            ${profile.profileType === 'Engineering' ? 'border-engblueborder bg-engbluebg' : ''}
                                            ${profile.profileType === 'Management' ? 'border-manpinkborder bg-manpinkbg' : ''}
                                        `}>
                                            <OverviewItem label="Individual Hourly" value={`$${profile.rate}`} color={profile.profileType} />
                                            <OverviewItem label="Team Hourly" value={'Contact Us'} color={profile.profileType} />
                                            <OverviewItem label="Full-Time" value={'Contact Us'} color={profile.profileType} />
                                        </Box>
                                        <Box className="justify-between items-center w-full">
                                            <Button className={`
                                                ${profile.profileType === 'Design' ? 'bg-designpurple' : ''}
                                                ${profile.profileType === 'Engineering' ? 'bg-engblue' : ''}    
                                                ${profile.profileType === 'Management' ? 'bg-manpink' : ''}
                                            `}>Request Introduction</Button>
                                            <Box gap={2} className="">
                                                <p className="">Ready to discuss?</p>
                                                <Link href="#" className="">
                                                    <p className="">Get in Touch</p>
                                                </Link>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Container>
                            </DialogContent>
                        </Dialog>
                        <Button className={`
                            ${profile.profileType === 'Design' ? 'bg-design-purple' : ''}
                            ${profile.profileType === 'Engineering' ? 'bg-engineering-blue' : ''}
                            ${profile.profileType === 'Management' ? 'bg-manpink' : ''}
                            rounded-lg hover:bg-blue-100
                        `}>
                            Inquire
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};
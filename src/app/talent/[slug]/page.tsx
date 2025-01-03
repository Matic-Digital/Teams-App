// Next.js metadata types
import type { Metadata } from 'next';

// API and types
import { getTalent, getProfile } from '@/lib/api';
import { ResourceNotFoundError } from '@/lib/errors';

// Components
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Section } from '@/components/global/matic-ds';
import { ErrorBoundary } from '@/components/global/ErrorBoundary';
import { BackButton } from '@/components/ui/back-button';

export const metadata: Metadata = {
    title: 'Talent',
    description: 'Meet our talented team members'
};

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function TalentPage({ params }: PageProps) {
    const { slug } = await params;

    try {
        console.log('Fetching talent data for slug:', slug);
        const talent = await getTalent(slug);

        if (!talent) {
            console.log('No talent found for slug:', slug);
            throw new ResourceNotFoundError(`Talent with slug "${slug}" not found`, 'talent');
        }

        console.log('Fetching related data for talent:', talent.sys.id);
        const profile = await Promise.resolve(
            getProfile(talent.sys.id).catch(error => {
                console.error('Failed to fetch profile:', error);
                return null;
            }),
        );

        return (
            <ErrorBoundary>
                <Container width="full">
                    <Box className="">
                        <BackButton href="/talent" />
                    </Box>
                    <Section>
                        <Container>
                            <Box gap={12}>
                                <Image
                                    src={talent.headshot.url}
                                    alt={`Cover image for ${talent.name}`}
                                    height={487}
                                    width={487}
                                    className="aspect-square object-cover rounded-lg shadow-lg"
                                    priority={false}
                                />
                                <Box direction="col" gap={2} className="">
                                    <h4 className="text-[16px] text-maticgreen">{talent.primaryTitle}</h4>
                                    <h1 className="font-medium text-6xl">{talent.name}</h1>
                                    {profile && (
                                        <Link href={`/talent/${talent.slug}/profile/${profile.slug}`} className="">
                                            <Box direction="col" gap={0} className="border border-gray-300 w-fit p-4 rounded-lg">
                                                <h4 className="text-maticgreen">{profile.profileType}</h4>
                                                <h3 className="">{profile.role}</h3>
                                            </Box>
                                        </Link>
                                    )}
                                </Box>
                            </Box>
                        </Container>
                    </Section>
                </Container>
            </ErrorBoundary>
        );
    } catch (error) {
        console.error('Error in TalentPage:', error);
        throw error; // Let Next.js error boundary handle it
    }
}
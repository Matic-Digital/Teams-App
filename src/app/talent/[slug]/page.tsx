// Next.js metadata types
import type { Metadata } from 'next';

// API and types
import { getTalent, getProfile } from '@/lib/api';
import { ResourceNotFoundError } from '@/lib/errors';

// Components
import Image from 'next/image';
import { Box, Container, Section } from '@/components/global/matic-ds';
import { ErrorBoundary } from '@/components/global/ErrorBoundary';
import { BackButton } from '@/components/ui/back-button';
import { ProfileCard } from '@/components/profiles/ProfileCard';

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
        const profiles = await Promise.resolve(
            getProfile(talent.sys.id).catch(error => {
                console.error('Failed to fetch profiles:', error);
                return [];
            }),
        );

        console.log('Fetched profiles:', JSON.stringify(profiles, null, 2));

        return (
            <ErrorBoundary>
                    <Section className="">
                        <Container className="">
                            <BackButton href="/talent" />
                            <Box gap={12} direction={{ base: 'col', lg: 'row' }}>
                                <Image
                                    src={talent.headshot.url}
                                    alt={`Cover image for ${talent.name}`}
                                    height={487}
                                    width={487}
                                    className="aspect-square object-cover rounded-lg shadow-lg"
                                    priority={false}
                                />
                                <Box direction="col" gap={12} className="">
                                    <Box direction="col" gap={2} className="">
                                        <h4 className="text-[16px] text-maticgreen">{talent.primaryTitle}</h4>
                                        <h1 className="font-medium text-6xl">{talent.name}</h1>
                                    </Box>
                                    <Box direction="row" gap={4} className="flex-wrap">
                                        {profiles.length > 0 ? profiles.reverse().map((profile, index) => (
                                            <ProfileCard
                                                key={profile.slug ?? index}
                                                talentSlug={talent.slug}
                                                profileSlug={profile.slug ?? ''}
                                                profileType={profile.profileType}
                                                role={profile.role ?? ''}
                                            />
                                        )) : (
                                            <Box direction="col" gap={0} className="border w-fit p-4 rounded-lg text-gray-500">
                                                <h3>No Profiles Published</h3>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Container>
                    </Section>
            </ErrorBoundary>
        );
    } catch (error) {
        console.error('Error in TalentPage:', error);
        throw error; // Let Next.js error boundary handle it
    }
}
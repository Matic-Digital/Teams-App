// Next.js metadata types
import type { Metadata } from 'next';

// API and types
import { getTalent, getEducation, getAwards, getLanguages, getProfile } from '@/lib/api';
import { ResourceNotFoundError } from '@/lib/errors';
import type { Language } from '@/types/contentful';

// Components
import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Main, Section } from '@/components/global/matic-ds';
import { ErrorBoundary } from '@/components/global/ErrorBoundary';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Button } from '@/components/ui/button';

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

        let languages: Language[] = [];
        try {
            languages = await getLanguages(talent.sys.id);
        } catch (error) {
            console.error('Failed to fetch languages:', error);
        }

        return (
            <Main className="h-screen">
                <Section>
                    <ErrorBoundary>
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
                                <Box direction="col" gap={4} className="">
                                    <h4 className="">{talent.primaryTitle}</h4>
                                    <h1 className="font-semibold">{talent.name}</h1>
                                </Box>
                            </Box>
                            {profile && (
                                <Link href={`/talent/${talent.slug}/profile/${profile.slug}`} className="">
                                    <Box direction="col" gap={4} className="">
                                        <h4 className="">{profile.profileType}</h4>
                                        <h3 className="">{profile.role}</h3>
                                    </Box>
                                </Link>
                            )}
                        </Container>
                    </ErrorBoundary>
                </Section>
            </Main>
        );
    } catch (error) {
        console.error('Error in TalentPage:', error);
        throw error; // Let Next.js error boundary handle it
    }
}
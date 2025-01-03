// Next.js metadata types
import type { Metadata } from 'next';

// API and types
import { getAllTalent, getAllProfiles } from '@/lib/api';
import type { Talent, Profile } from '@/types';

// Components
import Image from 'next/image';
import { Box, Container } from '@/components/global/matic-ds';
import { ErrorBoundary } from '@/components/global/ErrorBoundary';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Metadata configuration for SEO
 */
export const metadata: Metadata = {
  title: 'Our Talent',
  description: 'Meet our talented team members'
};

/**
 * TalentGrid component to display talent in a grid layout
 */
function TalentGrid({ talents, profiles }: { talents: Talent[], profiles: Profile[] }) {
  return (
    <Box direction="row" wrap={true} gap={4} className="">
      {talents.map((talent) => {
        const talentProfiles = profiles.filter(p => p.talent?.sys?.id === talent.sys.id);

        return (
          <Card key={talent.sys.id} className="h-full overflow-hidden transition-colors rounded-lg">
            <CardContent className="p-0">
              <Box className="relative">
                <Image
                  src={talent.headshot.url}
                  alt={`Cover image for ${talent.name}`}
                  height={350}
                  width={300}
                  className="aspect-[4/3] object-cover rounded-none"
                  priority={false}
                />
                <Box className="absolute bg-black/60 w-full h-full top-0 left-0 p-4 opacity-0 hover:opacity-100 transition-opacity">
                  <Box direction="col" gap={2} className="w-full justify-center">
                    {talentProfiles.map((profile) => (
                      <Link
                        key={profile.sys.id}
                        href={`/talent/${talent.slug}/profile/${profile.slug}`}
                        className="w-full flex items-center justify-center"
                      >
                        <Button className="">
                          <span>{profile.profileType}</span>
                          <span className="text-sm opacity-70">{profile.level}</span>
                        </Button>
                      </Link>
                    ))}
                    <Link href={`/talent/${talent.slug}`} className="w-full flex items-center justify-center">
                      <Button className="">View Talent</Button>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </CardContent>
            <CardHeader>
              <CardTitle className="line-clamp-2 flex flex-col gap-2">
                <h3>{talent.name}</h3>
                <h4 className="text-maticgreen">{talent.primaryTitle}</h4>
              </CardTitle>
              <CardFooter className="px-0 pt-2">
              </CardFooter>
            </CardHeader>
          </Card>
        );
      })}
    </Box>
  );
}

/**
 * Talent page displaying all team members
 */
export default async function TalentPage() {
  const [talents, profiles] = await Promise.all([
    getAllTalent(),
    getAllProfiles()
  ]);

  return (
    <Container className="flex flex-col gap-12">
      <Box direction="col" gap={2} className="text-center">

        <h4 className={`
        text-maticgreen
      `}>The team</h4>
        <h1 className="">Meet the Team</h1>
      </Box>
      <ErrorBoundary>
        <TalentGrid talents={talents} profiles={profiles} />
      </ErrorBoundary>
    </Container>
  );
}
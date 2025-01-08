// Next.js metadata types
import type { Metadata } from 'next';

// API and types
import { getAllTalent } from '@/lib/api';
import type { Talent } from '@/types';

// Components
import Image from 'next/image';
import { Box, Container } from '@/components/global/matic-ds';
import { ErrorBoundary } from '@/components/global/ErrorBoundary';
import { Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import Link from 'next/link';

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
function TalentGrid({ talents }: { talents: Talent[] }) {
  return (
    <Box direction="row" wrap={true} gap={4} className=" justify-center">
      {talents.map((talent) => {
        return (
          <Link href={`/talent/${talent.slug}`} key={talent.sys.id} className="no-underline hover:scale-95">
            <Card className="overflow-hidden transition-colors rounded-lg bg-foreground h-fit">
              <CardContent className="p-0 rounded-none">
                <Image
                  src={talent.headshot.url}
                  alt={`Cover image for ${talent.name}`}
                  height={450}
                  width={350}
                  className=" aspect-portrait object-cover w-[15rem] h-[15rem] rounded-none border-none"
                  priority={false}
                />
              </CardContent>
              <CardHeader>
                <CardTitle className="line-clamp-2 flex flex-col gap-2">
                  <h3 className="text-white">{talent.name}</h3>
                  <h4 className="text-white">{talent.primaryTitle}</h4>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </Box>
  );
}

/**
 * Talent page displaying all team members
 */
export default async function TalentPage() {
  const [talents] = await Promise.all([
    getAllTalent(),
  ]);

  return (
    <Container className="flex flex-col gap-12 mt-24">
      <Box direction="col" gap={2} className="text-center">
        <h4 className={`
        text-maticgreen
      `}>The team</h4>
        <h1 className="">Meet the Team</h1>
      </Box>
      <ErrorBoundary>
        <TalentGrid talents={talents} />
      </ErrorBoundary>
    </Container>
  );
}
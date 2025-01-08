import { Box, Container } from '@/components/global/matic-ds';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ProfileTalentCard } from '@/components/talent/ProfileTalentCard';
import { type Profile, type Talent } from '@/types';

interface MoreTeamsProps {
  profilesWithTalent: Array<{
    profile: Profile;
    talent: Talent;
  } | null>;
}

export function MoreTeams({ profilesWithTalent }: MoreTeamsProps) {
  const validProfiles = profilesWithTalent.filter((item): item is { profile: Profile; talent: Talent } => item !== null);

  return (
    <Container id="more-teams">
      <Box direction="col" gap={8} className="rounded-lg bg-white p-4 shadow-lg md:p-8">
        <Box direction="row" gap={4}>
          <Box direction="col" gap={2}>
            <h1 className="text-2xl font-bold flex flex-col leading-tight">
              More
              <span className="text-maticgreen">Teams</span>
            </h1>
            <p className="text-sm text-gray-600 max-w-xs">
              Browse other Teams talent in our hand-built, peer vetted network.
            </p>
          </Box>
          <Carousel className="w-full">
            <CarouselContent>
              {validProfiles.map((item) => {
                const { profile, talent } = item;
                
                return (
                  <CarouselItem key={profile.sys.id} className="basis-[225px]">
                    <ProfileTalentCard
                      talent={talent}
                      profileSlug={profile.slug ?? ''}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </Box>
      </Box>
    </Container>
  );
}
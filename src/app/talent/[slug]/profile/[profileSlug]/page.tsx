import { notFound } from 'next/navigation';
import { getTalent, getAllProfiles } from '@/lib/api';
import { Box, Container, Section } from '@/components/global/matic-ds';
import { getEducation, getAwards, getLanguages, getWorkSamples, getProfessionalBackground, getTechSpecification } from '@/lib/api';
import ProfileNav from '@/components/profiles/ProfileNav';
import { Overview } from '@/components/profiles/overview/Overview';
import ProfileNotes from '@/components/profiles/ProfileNotes';
import { WorkSamples } from '@/components/profiles/work-samples/WorkSamples';
import { CareerExperience } from '@/components/profiles/career/CareerExperience';
import { EvalItem } from '@/components/shared/items/EvalItem';
import { Link } from 'lucide-react';
import { getLocationName } from '@/utils/location';

interface Props {
  params: Promise<{
    slug: string;
    profileSlug: string;
  }>;
}

export default async function ProfilePage({ params }: Props) {
  const { slug, profileSlug } = await params;

  try {
    const talent = await getTalent(slug);
    if (!talent) {
      notFound();
    }

    const profiles = await getAllProfiles();
    const profile = profiles.find(
      (p) => p.slug === profileSlug && p.talent?.sys?.id === talent.sys.id
    );

    if (!profile) {
      notFound();
    }

    const talentLocation = await getLocationName(`${talent.location.lat}, ${talent.location.lon}`);

    const education = await getEducation(talent.sys.id);
    const awards = await getAwards(talent.sys.id);
    const languages = await getLanguages(talent.sys.id);
    const workSamples = await getWorkSamples(talent.sys.id);
    const professionalBackground = await getProfessionalBackground(talent.sys.id);
    const techSpecification = await getTechSpecification(talent.sys.id);

    // Get location names for education institutions
    const educationWithLocations = await Promise.all(education.map(async (edu) => {
      const locationName = await getLocationName(`${edu.location.lat}, ${edu.location.lon}`);
      return {
        ...edu,
        locationName
      };
    }));

    return (
      <Section className="flex flex-col gap-4">
        <ProfileNav
          profile={{
            name: talent.name,
            slug: talent.slug,
            profileType: profile.profileType,
            headshot: talent.headshot.url,
            rate: profile.rate,
            role: profile.role ?? '',
            focus: profile.focus ?? '',
            level: profile.level ?? '',
            experience: profile.experience ?? 0,
            hasSamples: workSamples.length > 0,
            hasEval: techSpecification.length > 0
          }}
        />
        <Overview
          name={talent.name}
          tier={talent.tier?.name}
          tags={profile.profileTags}
          type={profile.profileType}
          role={profile.role}
          focus={profile.focus}
          level={profile.level}
          experience={profile.experience}
          engagementType={profile.engagementType}
          availability={profile.availability}
          headshot={talent.headshot.url}
          description={profile.talentBriefDescription}
          location={profile.talentBriefLocation}
          timezone={talentLocation}
        />
        {workSamples.length > 0 && (
          <WorkSamples
            type={profile.profileType}
            samples={workSamples}
          />
        )}
        {techSpecification.length > 0 && (
          <Container id="evaluation">
            <Box direction="col" className="p-4 md:p-8 shadow-lg rounded-lg bg-white">
              {techSpecification.map((tech, index) => (
                <Box key={index} direction="col" className="gap-2">
                  <Box className="justify-between items-center">
                    <h1 className="font-bold flex gap-2">
                      {profile.profileType === 'Engineering' ? 'Tech' : ''}
                      {profile.profileType === 'Management' ? 'Management' : ''}
                      <span className={`
                              ${profile.profileType === 'Design' ? 'text-designpurple' : ''}
                              ${profile.profileType === 'Engineering' ? 'text-engblue' : ''}
                              ${profile.profileType === 'Management' ? 'text-manpink' : ''}
                            `}>
                        Evaluation
                      </span>
                    </h1>
                    <Link href={tech.repo} target="_blank" className="text-foreground font-bold hover:underline flex gap-2">
                      View Repo
                    </Link>
                  </Box>
                  <Box direction="col" gap={2} className="my-4">
                    <p className="uppercase font-bold text-[#a4a7ae] text-[10px] md:text-[12px]">Blended Score</p>
                    <p className="font-semibold text-4xl">{tech.blendedScore}+</p>
                  </Box>
                  <Box cols={{ base: 1, md: 2 }} gap={10} className="">
                    <EvalItem label={tech.field1} value={tech.field1Score} desc={tech.field1Description} />
                    <EvalItem label={tech.field2} value={tech.field2Score} desc={tech.field2Description} />
                    <EvalItem label={tech.field3} value={tech.field3Score} desc={tech.field3Description} />
                    <EvalItem label={tech.field4} value={tech.field4Score} desc={tech.field4Description} />
                    <EvalItem label={tech.field5} value={tech.field5Score} desc={tech.field5Description} />
                    <EvalItem label={tech.field6} value={tech.field6Score} desc={tech.field6Description} />
                    <EvalItem label={tech.field7} value={tech.field7Score} desc={tech.field7Description} />
                    <EvalItem label={tech.field8} value={tech.field8Score} desc={tech.field8Description} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        )}
        <CareerExperience
          type={profile.profileType}
          roles={professionalBackground}
          markets={profile.markets}
          sectors={profile.sectors}
          skills={profile.skills}
          tools={profile.tools}
          location={talentLocation}
          education={educationWithLocations}
          awards={awards}
          languages={languages}
        />
        <ProfileNotes
          type={profile.profileType}
          notes={profile.notes}
        />
      </Section>
    )
  } catch (error) {
    console.error('Error fetching profile:', error instanceof Error ? error.message : 'Unknown error');
    return (
      <div>
        <p>Profile not found or an error occurred.</p>
      </div>
    );
  }
}
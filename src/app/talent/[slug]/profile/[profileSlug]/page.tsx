import { notFound } from 'next/navigation';
import { getTalent, getAllProfiles } from '@/lib/api';
import { Box, Container, Section } from '@/components/global/matic-ds';
import SimplifyCTA from '@/components/profiles/SimplifyCTA';
import { getEducation, getAwards, getLanguages, getWorkSamples, getProfessionalBackground, getTechSpecification } from '@/lib/api';
import ProfileNav from '@/components/profiles/ProfileNav';
import ProfileOverview from '@/components/profiles/ProfileOverview';
import ProfileNotes from '@/components/profiles/ProfileNotes';
import ProfileWorkSamples from '@/components/profiles/ProfileWorkSamples';
import ProfileCareerExperience from '@/components/profiles/ProfileCareerExperience';
import EvalItem from '@/components/profiles/EvalItem';
import { Link } from 'lucide-react';

interface LocationResponse {
  address?: {
    city?: string;
    state?: string;
    town?: string;
  };
}

const stateAbbreviations: Record<string, string> = { 'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD', 'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC', 'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY' };

const getLocationName = async (location: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&addressdetails=1`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json() as LocationResponse[];
    if (data[0]?.address) {
      const { city, state, town } = data[0].address;
      const cityName = city ?? town;
      const stateAbbr = state ? stateAbbreviations[state.toLowerCase()] ?? state : null;
      return cityName && stateAbbr ? `${cityName}, ${stateAbbr}` : location;
    }
    return location;
  } catch (error) {
    console.error('Error fetching location:', error);
    return location;
  }
};

type Props = {
  params: Promise<{
    slug: string;
    profileSlug: string;
  }>;
};

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
        <Box direction="col" className="mt-0">
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
            <ProfileOverview
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
              <ProfileWorkSamples
                type={profile.profileType}
                samples={workSamples}
              />
            )}
            {techSpecification.length > 0 && (
              <Container>
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
                        <EvalItem field={tech.field1} score={tech.field1Score} desc={tech.field1Description} />
                        <EvalItem field={tech.field2} score={tech.field2Score} desc={tech.field2Description} />
                        <EvalItem field={tech.field3} score={tech.field3Score} desc={tech.field3Description} />
                        <EvalItem field={tech.field4} score={tech.field4Score} desc={tech.field4Description} />
                        <EvalItem field={tech.field5} score={tech.field5Score} desc={tech.field5Description} />
                        <EvalItem field={tech.field6} score={tech.field6Score} desc={tech.field6Description} />
                        <EvalItem field={tech.field7} score={tech.field7Score} desc={tech.field7Description} />
                        <EvalItem field={tech.field8} score={tech.field8Score} desc={tech.field8Description} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Container>
            )}
            <ProfileCareerExperience
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
          </Section>
          <Section>
            <ProfileNotes
              type={profile.profileType}
              notes={profile.notes}
            />
          </Section>
          <SimplifyCTA />
        </Box>
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
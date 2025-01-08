/**
 * Contentful API Integration Module
 * Provides functions for fetching and managing blog articles from Contentful CMS
 */

// Types
import type {
  Talent,
  Tier,
  Profile,
  Education,
  Awards,
  Language,
  WorkSample,
  ProfessionalBackground,
  TechSpecification,
  ContentfulResponse,
} from "@/types/contentful";

import {
  ContentfulError,
  NetworkError,
  GraphQLError,
  ResourceNotFoundError,
} from './errors';

/**
 * GraphQL fragment defining the structure of article data to fetch
 * Includes system metadata, content, and media assets
 */
const TALENT_GRAPHQL_FIELDS = `
  sys {
    id
  }
  name
  slug
  headshot {
    url
  }
  location {
    lat
    lon
  }
  tier {
    sys {
      id
    }
    name
  }
  primaryTitle
`;

const TIER_GRAPHQL_FIELDS = `
  sys {
    id
  }
  name
  description {
    json
  }
  talentCollection {
    items {
      sys {
        id
      }
      name
      slug
      headshot {
        url
      }
      location {
        lat
        lon
      }
    }
  }
`;

const PROFILE_GRAPHQL_FIELDS = `
  sys {
    id
  }
  talent {
    sys {
      id
    }
  }
  slug
  talentBriefDescription {
    json
  }
  talentBriefLocation
  profileType
  level
  profileTags
  role
  rate
  focus
  experience
  engagementType
  markets
  sectors
  skills
  tools
  availability
  notes {
    json
  }
`;

const EDUCATION_GRAPHQL_FIELDS = `
  sys {
    id
  }
  institution
  degreeName
  location {
    lat
    lon
  }
  timeframe
`;

const AWARD_GRAPHQL_FIELDS = `
  sys {
    id
  }
  awardName
  awardDate
  description {
    json
  }
`;

const LANGUAGE_GRAPHQL_FIELDS = `
  sys {
    id
  }
  name
  type
`;

const WORK_SAMPLE_GRAPHQL_FIELDS = `
  sys {
    id
  }
  sampleName
  sampleType
  briefDescription {
    json
  }
  featuredImage {
    url
  }
  roleTags
  talent {
    sys {
      id
    }
  }
  title
  sampleGalleryCollection {
    items {
      url
    }
  }
`;

const PROFESSIONAL_BACKGROUND_GRAPHQL_FIELDS = `
  sys {
    id
  }
  talent {
    sys {
      id
    }
  }
  companyName
  companyLogo {
    url
  }
  startDate
  endDate
  roleTitle
  roleDescription {
    json
  }
`;

/**
 * Executes GraphQL queries against Contentful's API with caching
 * @param query - GraphQL query string
 * @param variables - GraphQL variables
 * @param preview - Whether to use preview or production content
 * @returns Promise resolving to typed API response
 * @throws Error on network or GraphQL errors
 */
async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
  preview = false,
  cacheConfig?: { next: { revalidate: number } },
): Promise<ContentfulResponse<T>> {
  try {
    const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
    const token = preview
      ? process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN
      : process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

    if (!spaceId || !token) {
      console.error('Missing Contentful credentials:', { spaceId: !!spaceId, token: !!token });
      throw new ContentfulError('Missing Contentful credentials');
    }

    const url = `https://graphql.contentful.com/content/v1/spaces/${spaceId}`;
    const requestBody = JSON.stringify({ query, variables });
    
    console.log('GraphQL Request:', {
      url,
      method: 'POST',
      variables,
      query,
      preview,
      hasToken: !!token,
      requestBody,
    });

    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: requestBody,
        next: cacheConfig?.next,
      },
    );

    const responseText = await response.text();
    console.log('Raw Response:', responseText);

    if (!response.ok) {
      console.error('GraphQL Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      throw new NetworkError(
        `Network error: ${response.statusText}. Body: ${responseText}`,
        response
      );
    }

    try {
      const json = JSON.parse(responseText) as ContentfulResponse<T>;
      
      // Check for GraphQL errors in the response
      if (json.errors?.length) {
        console.error('GraphQL errors in response:', json.errors);
        throw new GraphQLError(
          'GraphQL query execution error',
          json.errors.map(e => ({
            message: typeof e === 'string' ? e : e.message || 'Unknown error'
          }))
        );
      }

      return json;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
  } catch (error) {
    if (error instanceof NetworkError || error instanceof GraphQLError) {
      throw error;
    }
    throw new ContentfulError('Failed to fetch data from Contentful', error);
  }
}

/**
 * Fetches all talent entries from Contentful
 * @param isDraftMode - Whether to fetch draft content (default: false)
 * @returns Promise resolving to array of Talent entries
 */
async function getAllTalent(
  isDraftMode = false
): Promise<Talent[]> {
  try {
    console.log('Fetching talent:', { isDraftMode });
    
    const query = `query GetTalent {
      talentCollection {
        items {
          ${TALENT_GRAPHQL_FIELDS}
        }
      }
    }`;

    console.log('GraphQL Query:', query);
    
    const response = await fetchGraphQL<{
      talentCollection: {
        items: Talent[];
      };
    }>(query, {}, isDraftMode);

    console.log('Talent response:', JSON.stringify(response, null, 2));

    // Check for GraphQL errors
    if (response.errors) {
      console.error('GraphQL errors:', response.errors);
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map((e: { message?: string; extensions?: Record<string, unknown> }): { message: string; extensions?: Record<string, unknown> } => ({
          message: e?.message ?? (typeof e === 'string' ? e : 'Unknown error'),
          ...(e?.extensions && { extensions: e.extensions })
        }))
      );
    }

    if (!response.data?.talentCollection?.items) {
      console.error('No talent collection in response:', response);
      throw new ContentfulError('Invalid response format - missing talentCollection.items');
    }

    return response.data.talentCollection.items;
  } catch (error) {
    console.error('Error fetching talent:', error);
    throw new ContentfulError('Failed to fetch talent', error);
  }
}

async function getTalent(
  slug: string,
  isDraftMode = false
): Promise<Talent | null> {
  try {
    console.log('Fetching talent by slug:', { slug, isDraftMode });
    
    const query = `query GetTalentBySlug {
      talentCollection(where: { slug: "${slug}" }, limit: 1) {
        items {
          ${TALENT_GRAPHQL_FIELDS}
        }
      }
    }`;

    console.log('GraphQL Query:', query);
    
    const response = await fetchGraphQL<{
      talentCollection: {
        items: Talent[];
      };
    }>(query, {}, isDraftMode);

    console.log('Contentful Response:', JSON.stringify(response, null, 2));

    if (!response.data?.talentCollection?.items?.length) {
      console.log('No talent found with slug:', slug);
      return null;
    }

    return response.data.talentCollection.items[0] ?? null;
  } catch (error) {
    console.error('Error fetching talent:', error);
    throw error;
  }
}

async function getTalentById(
  id: string,
  isDraftMode = false
): Promise<Talent | null> {
  try {
    console.log('Fetching talent by id:', { id, isDraftMode });
    
    const query = `query GetTalentById {
      talentCollection(where: { sys: { id: "${id}" } }, limit: 1) {
        items {
          ${TALENT_GRAPHQL_FIELDS}
        }
      }
    }`;

    console.log('GraphQL Query:', query);
    
    const response = await fetchGraphQL<{
      talentCollection: {
        items: Talent[];
      };
    }>(query, {}, isDraftMode);

    console.log('Contentful Response:', JSON.stringify(response, null, 2));

    if (!response.data?.talentCollection?.items?.length) {
      console.log('No talent found with id:', id);
      return null;
    }

    return response.data.talentCollection.items[0] ?? null;
  } catch (error) {
    console.error('Error fetching talent:', error);
    throw error;
  }
}

async function getAllTiers(
  isDraftMode = false
): Promise<Tier[]> {
  try {
    console.log('Fetching tiers:', { isDraftMode });
    
    const query = `query GetTiers {
      tierCollection {
        items {
          ${TIER_GRAPHQL_FIELDS}
        }
      }
    }`;

    console.log('GraphQL Query:', query);
    
    const response = await fetchGraphQL<Tier>(
      query,
      {},
      isDraftMode
    );

    // Check for GraphQL errors
    if (response.errors) {
      console.error('GraphQL errors:', response.errors);
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map((e: { message?: string; extensions?: Record<string, unknown> }): { message: string; extensions?: Record<string, unknown> } => ({
          message: e?.message ?? (typeof e === 'string' ? e : 'Unknown error'),
          ...(e?.extensions && { extensions: e.extensions })
        }))
      );
    }

    return response.data?.tierCollection?.items ?? [];
  } catch (error) {
    console.error('Error fetching tiers:', error);
    throw new ContentfulError('Failed to fetch tiers', error);
  }
}

async function getTier (
  slug: string,
  isDraftMode = false
): Promise<Tier> {
  try {
    const response = await fetchGraphQL<Tier>(
      `query GetTier {
        tierCollection(
          where: { slug: "${slug}" },
          limit: 1,
        ) {
          items {
            ${TIER_GRAPHQL_FIELDS}
          }
        }
      }`,
      {},
      isDraftMode,
    );

    // Check for GraphQL errors
    if (response.errors) {
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map((e: { message?: string; extensions?: Record<string, unknown> }): { message: string; extensions?: Record<string, unknown> } => ({
          message: e?.message ?? (typeof e === 'string' ? e : 'Unknown error'),
          ...(e?.extensions && { extensions: e.extensions })
        }))
      );
    }

    const tier = response.data?.tierCollection?.items[0];

    if (!tier) {
      throw new ResourceNotFoundError(
        `Tier with slug '${slug}' not found`,
        'tier'
      );
    }

    return tier;
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      throw error;
    }
    throw new ContentfulError('Failed to fetch tier', error);
  }
}

async function getAllProfiles(
  isDraftMode = false
): Promise<Profile[]> {
  try {
    const response = await fetchGraphQL<Profile>(
      `query GetProfiles {
        profileCollection {
          items {
            ${PROFILE_GRAPHQL_FIELDS}
          }
        }
      }`,
      {},
      isDraftMode,
    );

    // Check for GraphQL errors
    if (response.errors) {
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map((e: { message?: string; extensions?: Record<string, unknown> }): { message: string; extensions?: Record<string, unknown> } => ({
          message: e?.message ?? (typeof e === 'string' ? e : 'Unknown error'),
          ...(e?.extensions && { extensions: e.extensions })
        }))
      );
    }

    return response.data?.profileCollection?.items ?? [];
  } catch (error) {
    throw new ContentfulError('Failed to fetch profiles', error);
  }
}

async function getProfile(
  talentId: string,
  isDraftMode = false
): Promise<Profile[]> {
  try {
    type ProfileResponse = ContentfulResponse<{
      data: {
        profileCollection?: {
          items: Profile[];
          total: number;
        };
      };
    }>;

    const query = `query GetProfile {
      profileCollection(where: { talent: { sys: { id: "${talentId}" } } }, limit: 100) {
        total
        items {
          ${PROFILE_GRAPHQL_FIELDS}
        }
      }
    }`;
    
    console.log('GetProfile Query:', query);
    
    const response = await fetchGraphQL<ProfileResponse>(
      query,
      {},
      isDraftMode
    );

    console.log('GetProfile Response:', JSON.stringify(response, null, 2));

    if (response.errors) {
      console.error('GraphQL errors:', response.errors);
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map((e: { message?: string; extensions?: Record<string, unknown> }): { message: string; extensions?: Record<string, unknown> } => ({
          message: e?.message ?? (typeof e === 'string' ? e : 'Unknown error'),
          ...(e?.extensions && { extensions: e.extensions })
        }))
      );
    }

    const profiles = response.data?.profileCollection?.items ?? [];

    if (profiles.length === 0) {
      throw new ResourceNotFoundError(
        `No profiles found for talent with ID '${talentId}'`,
        'profile'
      );
    }

    return profiles;
  } catch (error: unknown) {
    if (error instanceof ResourceNotFoundError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ContentfulError('Failed to fetch profiles', new Error(errorMessage));
  }
}

async function getEducation(
  talentId: string,
  isDraftMode = false
): Promise<Education[]> {
  try {
    const response = await fetchGraphQL<ContentfulResponse<Education>>(`
      query GetEducation {
        educationCollection(
          where: { talent: { sys: { id: "${talentId}" } } }
        ) {
          items {
            ${EDUCATION_GRAPHQL_FIELDS}
          }
        }
      }
    `, {}, isDraftMode);

    const educations = response.data?.educationCollection?.items ?? [];

    if (!educations) {
      throw new ResourceNotFoundError(
        `No education found for talent '${talentId}'`,
        'education'
      );
    }
    return educations;    
  } catch (error: unknown) {
    if (error instanceof ResourceNotFoundError) {
      throw error;
    }
    const errorMessage = 
      error instanceof Error ? error.message : 
      typeof error === 'string' ? error :
      'An unknown error occurred';
    throw new Error(errorMessage);
  }
}

async function getAllAwards(
  isDraftMode = false
): Promise<Awards[]> {
  try {
    const response = await fetchGraphQL<Awards>(
      `query GetAwards {
        awardsCollection {
          items {
            ${AWARD_GRAPHQL_FIELDS}
          }
        }
      }`,
      {},
      isDraftMode,
    );

    // Check for GraphQL errors
    if (response.errors) {
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map((e: { message?: string; extensions?: Record<string, unknown> }): { message: string; extensions?: Record<string, unknown> } => ({
          message: e?.message ?? (typeof e === 'string' ? e : 'Unknown error'),
          ...(e?.extensions && { extensions: e.extensions })
        }))
      );
    }

    if (!response.data?.awardsCollection) {
      return [];
    }

    return response.data.awardsCollection.items;
  } catch (error: unknown) {
    // Ensure type-safe error handling
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ContentfulError('Failed to fetch awards', new Error(errorMessage));
  }
}

async function getAwards(
  talentId: string,
  isDraftMode = false
): Promise<Awards[]> {
  try {
    const response = await fetchGraphQL<Awards>(
      `query GetAwardsByTalent($talentId: String!) {
        awardsCollection(where: { talent: { sys: { id: $talentId } } }) {
          items {
            ${AWARD_GRAPHQL_FIELDS}
          }
        }
      }`,
      { talentId },
      isDraftMode,
    );

    if (response.errors) {
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map((e: unknown) => ({
          message: typeof e === 'string' 
            ? e 
            : (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string')
              ? e.message
              : 'Unknown error',
          ...(e && typeof e === 'object' && 'extensions' in e && e.extensions 
              ? { extensions: e.extensions as Record<string, unknown> }
              : {})
        }))
      );
    }

    if (!response.data?.awardsCollection) {
      return [];
    }

    return response.data.awardsCollection.items;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage);
  }
}

async function getLanguage(
  id: string,
  isDraftMode?: boolean
): Promise<Language> {
  try {
    const response = await fetchGraphQL<ContentfulResponse<Language>>(
      `query GetLanguage($id: String!) {
        languagesCollection(
          where: { 
            sys: { id: $id }
          },
          limit: 1,
        ) {
          items {
            ${LANGUAGE_GRAPHQL_FIELDS}
          }
        }
      }`,
      { id },
      isDraftMode ?? false,
    );

    // Check for GraphQL errors
    if (response.errors) {
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map((e: unknown) => ({
          message: typeof e === 'string' 
            ? e 
            : (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string')
              ? e.message
              : 'Unknown error',
          ...(e && typeof e === 'object' && 'extensions' in e && e.extensions 
              ? { extensions: e.extensions as Record<string, unknown> }
              : {})
        }))
      );
    }

    const language = response.data?.languagesCollection?.items[0];

    if (!language) {
      throw new ResourceNotFoundError(`Language with ID ${id} not found`, 'language');
    }

    return language;
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      throw error;
    }
    throw new ContentfulError('Failed to fetch language', error);
  }
}

async function getLanguages(
  talentId: string,
  isDraftMode = false
): Promise<Language[]> {
  try {
    const response = await fetchGraphQL<ContentfulResponse<Language>>(`
      query GetLanguages {
        languagesCollection(
          where: { talent: { sys: { id: "${talentId}" } } }
        ) {
          items {
            ${LANGUAGE_GRAPHQL_FIELDS}
          }
        }
      }
    `, {}, isDraftMode);

    if (response.errors) {
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map((e: { message?: string }) => ({
          message: e?.message ?? 'Unknown error'
        }))
      );
    }

    if (!response.data?.languagesCollection) {
      return [];
    }

    return response.data.languagesCollection.items;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage);
  }
}

async function getAllWorkSamples(
  isDraftMode = false
): Promise<WorkSample[]> {
  try {
    const query = `query GetAllWorkSamples {
      workSamplesCollection {
        total
        items {
          ${WORK_SAMPLE_GRAPHQL_FIELDS}
        }
      }
    }`;

    const response = await fetchGraphQL<{ workSamplesCollection: { items: WorkSample[]; total: number; } }>(
      query,
      {},
      isDraftMode
    );

    // Check for GraphQL errors
    if (response.errors) {
      console.error('GraphQL errors:', response.errors);
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map(e => ({
          message: typeof e === 'string' ? e : e.message || 'Unknown error'
        }))
      );
    }

    if (!response.data?.workSamplesCollection?.items) {
      return [];
    }

    return response.data.workSamplesCollection.items;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ContentfulError('Failed to fetch work samples', new Error(errorMessage));
  }
}

async function getWorkSamples(
  talentId: string,
  isDraftMode = false
): Promise<WorkSample[]> {
  try {
    const query = `query GetWorkSamples {
      workSamplesCollection(
        where: { talent: { sys: { id: "${talentId}" } } }
      ) {
        total
        items {
          ${WORK_SAMPLE_GRAPHQL_FIELDS}
        }
      }
    }`;

    console.log('GraphQL Query:', query);

    const response = await fetchGraphQL<{ workSamplesCollection: { items: WorkSample[]; total: number; } }>(
      query,
      {},
      isDraftMode
    );

    console.log('GraphQL Response:', JSON.stringify(response, null, 2));

    // Check for GraphQL errors
    if (response.errors) {
      console.error('GraphQL errors:', response.errors);
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map(e => ({
          message: typeof e === 'string' ? e : e.message || 'Unknown error'
        }))
      );
    }

    if (!response.data?.workSamplesCollection?.items) {
      return [];
    }

    return response.data.workSamplesCollection.items;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Work Samples Error:', errorMessage);
    throw new ContentfulError('Failed to fetch work samples', new Error(errorMessage));
  }
}

async function getAllProfessionalBackgrounds(
  isDraftMode = false
): Promise<ProfessionalBackground[]> {
  try {
    const query = `query GetAllProfessionalBackgrounds {
      professionalBackgroundCollection {
        total
        items {
          ${PROFESSIONAL_BACKGROUND_GRAPHQL_FIELDS}
        }
      }
    }`;

    const response = await fetchGraphQL<{ professionalBackgroundCollection: { items: ProfessionalBackground[]; total: number; } }>(
      query,
      {},
      isDraftMode
    );

    // Check for GraphQL errors
    if (response.errors) {
      console.error('GraphQL errors:', response.errors);
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map(e => ({
          message: typeof e === 'string' ? e : e.message || 'Unknown error'
        }))
      );
    }

    if (!response.data?.professionalBackgroundCollection?.items) {
      return [];
    }

    return response.data.professionalBackgroundCollection.items;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ContentfulError('Failed to fetch professional backgrounds', new Error(errorMessage));
  }
}

async function getProfessionalBackground(
  talentId: string,
  isDraftMode = false
): Promise<ProfessionalBackground[]> {
  try {
    const query = `query GetProfessionalBackground {
      professionalBackgroundCollection(
        where: { talent: { sys: { id: "${talentId}" } } }
      ) {
        total
        items {
          ${PROFESSIONAL_BACKGROUND_GRAPHQL_FIELDS}
        }
      }
    }`;

    const response = await fetchGraphQL<{ professionalBackgroundCollection: { items: ProfessionalBackground[]; total: number; } }>(
      query,
      {},
      isDraftMode
    );

    // Check for GraphQL errors
    if (response.errors) {
      console.error('GraphQL errors:', response.errors);
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map(e => ({
          message: typeof e === 'string' ? e : e.message || 'Unknown error'
        }))
      );
    }

    if (!response.data?.professionalBackgroundCollection?.items) {
      return [];
    }

    return response.data.professionalBackgroundCollection.items;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ContentfulError('Failed to fetch professional background', new Error(errorMessage));
  }
}

async function getTechSpecification(
  talentId: string,
  isDraftMode = false
): Promise<TechSpecification[]> {
  try {
    interface TechSpecResponse {
      data?: {
        techSpecificationCollection?: {
          items: TechSpecification[];
        };
      };
      errors?: Array<{
        message: string;
        extensions?: Record<string, unknown>;
      }>;
    }

    const response = await fetchGraphQL<TechSpecResponse>(
      `query GetTechSpecification($talentId: String!) {
        techSpecificationCollection(where: { talent: { sys: { id: $talentId } } }) {
          items {
            talent {
              sys {
                id
              }
            }
            repo
            blendedScore
            field1
            field1Score
            field1Description {
              json
            }
            field2
            field2Score
            field2Description {
              json
            }
            field3
            field3Score
            field3Description {
              json
            }
            field4
            field4Score
            field4Description {
              json
            }
            field5
            field5Score
            field5Description {
              json
            }
            field6
            field6Score
            field6Description {
              json
            }
            field7
            field7Score
            field7Description {
              json
            }
            field8
            field8Score
            field8Description {
              json
            }
          }
        }
      }`,
      { talentId },
      isDraftMode,
    );

    if (response.errors) {
      throw new GraphQLError(
        'GraphQL query execution error',
        response.errors.map((e: unknown) => ({
          message: typeof e === 'string' 
            ? e 
            : (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string')
              ? e.message
              : 'Unknown error',
          ...(e && typeof e === 'object' && 'extensions' in e && e.extensions 
              ? { extensions: e.extensions as Record<string, unknown> }
              : {})
        }))
      );
    }

    const items = response.data?.techSpecificationCollection?.items ?? [];
    return items;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage);
  }
}


export {
  getTalent,
  getTalentById,
  getAllTalent,
  getAllTiers,
  getTier,
  getAllProfiles,
  getProfile,
  getEducation,
  getAllAwards,
  getAwards,
  getLanguage,
  getLanguages,
  getAllWorkSamples,
  getWorkSamples,
  getAllProfessionalBackgrounds,
  getProfessionalBackground,
  getTechSpecification,
};

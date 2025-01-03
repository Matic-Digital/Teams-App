import { type Document } from "@contentful/rich-text-types";

/**
 * Represents a talent from Contentful CMS
 * @property sys - System metadata containing the talent's unique identifier
 * @property name - Talent's name
 */
export interface Talent {
  sys: {
    id: string;
  };
  name: string;
  slug: string;
  primaryTitle: string;
  headshot: {
    url: string;
  };
  location: {
    lat: number;
    lon: number;
  }
  tier: {
    sys: {
      id: string;
    };
    name: string;
  };
  linkedFrom: {
    educationCollection: {
      items: Array<{
        sys: {
          id: string;
        };
        institution: string;
        degreeName: string;
        location: {
          lat: number;
          lon: number;
        }
        timeframe: string;
      }>;
    };
  };
  awards: {
    sys: {
      id: string;
    };
    awardName: string;
    awardDate: {
      start: string;
    };
    description: {
      json: Document;
    };
  };
  languages: {
    sys: {
      id: string;
    };
    name: string;
    type: string;
  };
}

export interface Tier {
  sys: {
    id: string;
  };
  name: string;
  description: {
    json: Document;
  };
  talent: Array<{
    sys: {
      id: string;
    };
  }>;
}

export interface Profile {
  sys: {
    id: string;
  };
  talent?: {
    sys: {
      id: string;
    };
  };
  slug?: string;
  profileType: 'Strategy' | 'Design' | 'Engineering' | 'Management';
  profileTags?: string[];
  talentBriefDescription?: {
    json: Document;
  };
  talentBriefLocation?: string;
  level?: 'Junior' | 'Mid' | 'Senior' | 'Director';
  role: string;
  focus?: string;
  rate?: number;
  engagementType?: Array<'Full-Time' | 'Dedicated' | 'Fractional'>;
  technicalEvaluation?: Array<{
    sys: {
      id: string;
    };
  }>; 
  experience?: number;
  markets?: string[];
  sectors?: string[];
  skills?: string[];
  tools?: string[];
  availability?: string;
  notes: {
    json: Document;
  }
}

/**
 * Represents an education from Contentful CMS
 * @property sys - System metadata containing the education's unique identifier
 * @property institution - Education institution
 * @property degreeName - Name of the degree
 * @property location - Location of the education
 * @property timeframe - Timeframe of the education
 */
export interface Education {
  sys: {
    id: string;
  };
  institution: string;
  degreeName: string;
  location: {
    lat: number;
    lon: number;
  }
  timeframe: string;
}

/**
 * Represents an award from Contentful CMS
 * @property sys - System metadata containing the award's unique identifier
 * @property awardName - Name of the award
 * @property awardDate - Date of the award
 * @property description - Description of the award
 */
export interface Awards {
  sys: {
    id: string;
  };
  awardName: string;
  awardDate: string;
  description: {
    json: Document;
  };
}

/**
 * Represents a language from Contentful CMS
 * @property sys - System metadata containing the language's unique identifier
 * @property name - Name of the language
 * @property type - Type of the language
 */
export interface Language {
  sys: {
    id: string;
  };
  name: string;
  type: string;
  talent: Array<{
    sys: {
      id: string;
    };
  }>;
}

/**
 * Represents a work sample from Contentful CMS
 * @property sys - System metadata containing the work sample's unique identifier
 * @property talent - Reference to the associated talent
 * @property sampleName - Name of the work sample
 * @property sampleType - Type of work sample (Contract, Employee, Project)
 * @property title - Title of the work sample
 * @property briefDescription - Rich text description of the work sample
 * @property featuredImage - Optional featured image
 * @property sampleGalleryCollection - Optional gallery of images
 * @property roleTags - Optional array of role tags
 */
export interface WorkSample {
  sys: {
    id: string;
  };
  talent?: {
    sys: {
      id: string;
    };
  };
  sampleName: string;
  sampleType?: 'Contract' | 'Employee' | 'Project';
  title: string;
  briefDescription: {
    json: Document;
  };
  featuredImage?: {
    url: string;
  };
  sampleGalleryCollection?: {
    items: Array<{
      url: string;
    }>;
  };
  roleTags?: string[];
}

/**
 * Represents a professional background entry from Contentful CMS
 * @property sys - System metadata containing the entry's unique identifier
 * @property talent - Reference to the associated talent
 * @property companyName - Name of the company
 * @property companyLogo - Optional company logo
 * @property startDate - Start date of the role
 * @property endDate - Optional end date of the role
 * @property roleTitle - Title of the role
 * @property roleDescription - Rich text description of the role
 */
export interface ProfessionalBackground {
  sys: {
    id: string;
  };
  talent?: {
    sys: {
      id: string;
    };
  };
  companyName?: string;
  companyLogo?: {
    url: string;
  };
  startDate?: string;
  endDate?: string;
  roleTitle?: string;
  roleDescription?: {
    json: Document;
  };
}

/**
 * Represents a technical specification from Contentful CMS
 * @property sys - System metadata containing the technical specification's unique identifier
 * @property talent - Reference to the associated talent
 * @property repo - Optional repository URL
 * @property evaluationField - Field of evaluation
 * @property blendedScore - Blended score of the evaluation
 * @property field1 - Field 1 of the evaluation
 * @property field1Score - Score of field 1
 * @property field1Description - Description of field 1
 * @property field2 - Field 2 of the evaluation
 * @property field2Score - Score of field 2
 * @property field2Description - Description of field 2
 * @property field3 - Field 3 of the evaluation
 * @property field3Score - Score of field 3
 * @property field3Description - Description of field 3
 * @property field4 - Field 4 of the evaluation
 * @property field4Score - Score of field 4
 * @property field4Description - Description of field 4
 * @property field5 - Field 5 of the evaluation
 * @property field5Score - Score of field 5
 * @property field5Description - Description of field 5
 * @property field6 - Field 6 of the evaluation
 * @property field6Score - Score of field 6
 * @property field6Description - Description of field 6
 * @property field7 - Field 7 of the evaluation
 * @property field7Score - Score of field 7
 * @property field7Description - Description of field 7
 * @property field8 - Field 8 of the evaluation
 * @property field8Score - Score of field 8
 * @property field8Description - Description of field 8
 */
export interface TechSpecification {
  sys: {
    id: string;
  };
  talent: {
    sys: {
      id: string;
    };
  };
  repo?: string;
  evaluationField: string;
  blendedScore: number;
  field1: string;
  field1Score: number;
  field1Description: {
    json: Document;
  };
  field2: string;
  field2Score: number;
  field2Description: {
    json: Document;
  };
  field3: string;
  field3Score: number;
  field3Description: {
    json: Document;
  };
  field4: string;
  field4Score: number;
  field4Description: {
    json: Document;
  };
  field5: string;
  field5Score: number;
  field5Description: {
    json: Document;
  };
  field6: string;
  field6Score: number;
  field6Description: {
    json: Document;
  };
  field7: string;
  field7Score: number;
  field7Description: {
    json: Document;
  };
  field8: string;
  field8Score: number;
  field8Description: {
    json: Document;
  };
}

/**
 * Raw response structure from Contentful GraphQL API
 * @template T - The type of items in the collection
 * @property data - Contains the collection if request succeeds
 * @property errors - Contains error details if request fails
 */
export interface ContentfulResponse<T> {
  data?: {
    talentCollection?: {
      items: Talent[];
      total: number;
    };
    tierCollection?: {
      items: Tier[];
      total: number;
    };
    profileCollection?: {
      items: Profile[];
      total: number;
    };
    educationCollection?: {
      items: Education[];
      total: number;
    };
    awardsCollection?: {
      items: Awards[];
      total: number;
    };
    languagesCollection?: {
      items: Language[];
      total: number;
    };
    workSamplesCollection?: {
      items: WorkSample[];
      total: number;
    };
    professionalBackgroundCollection?: {
      items: ProfessionalBackground[];
      total: number;
    };
    techSpecificationCollection?: {
      items: TechSpecification[];
      total: number;
    };
  };
  errors?: Array<{ message: string }>;
}

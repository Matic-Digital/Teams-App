import type { Document } from '@contentful/rich-text-types';
import { Box, Container } from '@/components/global/matic-ds';
import Image from 'next/image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import OverviewList from './OverviewList';

interface ProfileOverviewProps {
    name: string;
    tags: string[] | undefined;
    type: string | undefined;
    role: string | undefined;
    tier: string;
    focus: string | undefined;
    level: string | undefined;
    experience: number | undefined;
    engagementType: ("Full-Time" | "Dedicated" | "Fractional")[] | undefined;
    availability: string | undefined;
    headshot: string;
    description: { json: Document; } | undefined;
    location: string | undefined;
    timezone: string | undefined;   
}

// Level abbreviation mapping
export const levelMapping = {
    'Junior': 'Jr.',
    'Mid': 'Mid',
    'Senior': 'Sr.',
    'Director': 'Dir.'
} as const;

type LevelKey = keyof typeof levelMapping;

interface ContentNode {
    nodeType: string;
    value?: string;
    content?: ContentNode[];
}

const options = {
    renderNode: {
        [BLOCKS.PARAGRAPH]: (node: { content: ContentNode[] }) => {
            return (
                <p style={{ margin: '1em 0' }}>
                    {node.content.map((content, index) => {
                        if (content.nodeType === 'text' && content.value) {
                            return content.value.split('\n').map((line, lineIndex) => (
                                <span key={`${index}-${lineIndex}`}>{line}<br /></span>
                            ));
                        }
                        return null;
                    })}
                </p>
            );
        },
    },
};

export default function ProfileOverview({ name, tags, tier, type, availability, headshot, description, location, role, focus, level, experience, engagementType, timezone }: ProfileOverviewProps) {
    const profileLevel = level ? (levelMapping[level as LevelKey] ?? 'Unknown') : 'Unknown';
    return (
        <Container id="overview" className="scroll-mt-28">
            <Box direction="col" className="px-4 py-6 md:p-8 shadow-lg rounded-lg bg-white">
                <Box gap={6} className="items-center justify-between border-b border-[#a4a7ae] pb-4">
                    <h1 className="flex gap-2">
                        Meet
                        <span className={`
                            ${type === 'Design' ? 'text-designpurple' : ''}
                            ${type === 'Engineering' ? 'text-engblue' : ''}
                            ${type === 'Management' ? 'text-manpink' : ''}

                        `}>
                            {name.split(' ')[0]}
                        </span>
                    </h1>
                    <Box direction="row" gap={2} wrap={true} className="flex-grow hidden md:flex">
                        {tags?.map((tag: string, index: number) => (
                            <p
                                key={index}
                                className="bg-[#f5f5f5] w-fit px-2 py-1 rounded-full text-xs font-light"
                            >
                                {tag}
                            </p>
                        ))}
                    </Box>
                    <p className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                            availability ? (
                                new Date(availability) <= new Date() ? 
                                'bg-green-500' : 
                                'bg-yellow-500'
                            ) : 'bg-red-500'
                        }`} />
                        <span className="font-semibold w-[7rem] md:w-[10rem]">
                            {availability ? (
                                new Date(availability) <= new Date() ? 'Available Now' : 
                                `Available ${new Date(availability).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
                            ) : 'Not Available'}
                        </span>
                    </p>
                </Box>
                <Box className='relative pb-4 md:pb-10 mt-4 flex-col md:flex-row' gap={{ base: 4, md: 12 }}>
                    <Box gap={4} className="mt-4">
                        <Image
                            src={headshot}
                            alt={name}
                            width={300}
                            height={300}
                            className="w-[175px] md:min-w-[211px] h-[200px] md:h-[241px] rounded-lg z-10 object-cover shadow-md"
                        />
                        {/* <div className={`
                            w-[175px] md:w-[211px] h-[200px] md:h-[241px] rounded-[0.8rem] absolute top-6 left-1.5
                            ${type === 'Design' ? 'bg-designpurple' : ''}
                            ${type === 'Engineering' ? 'bg-engblue' : ''}
                            ${type === 'Management' ? 'bg-manpink' : ''}
                        `}>
                        </div> */}
                        <Box direction="col" gap={2} className="flex-grow flex md:hidden">
                            {tags?.map((tag: string, index: number) => (
                                <p
                                    key={index}
                                    className="bg-[#f5f5f5] w-fit px-2 py-1 rounded-full text-xs font-light"
                                >
                                    {tag}
                                </p>
                            ))}
                        </Box>
                    </Box>
                    <Box direction="col" className="mx-auto">
                        {description?.json ? documentToReactComponents(description.json, options) : <p>No description available.</p>}
                        <p className="font-semibold">{location}</p>
                    </Box>
                </Box>
                <OverviewList
                    role={role ?? ''}
                    focus={focus}
                    tier={tier.toString() ?? ''}
                    level={profileLevel ?? ''}
                    color={type ?? ''}
                    location={timezone ?? ''}
                    experience={`${Number(experience)}+ Years`}
                    engagementType={engagementType}
                />
            </Box>
        </Container>
    );
}
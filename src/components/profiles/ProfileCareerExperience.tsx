import type { Awards, Education, Language, ProfessionalBackground } from "@/types";
import { Box, Container, Prose } from "../global/matic-ds";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";

interface ProfileCareerExperienceProps {
    type: string;
    roles: ProfessionalBackground[];
    markets: string[] | undefined,
    sectors: string[] | undefined,
    skills: string[] | undefined,
    tools: string[] | undefined,
    location: string | undefined,
    education: Education[],
    awards: Awards[],
    languages: Language[]
}

const options = {
    renderNode: {
        [BLOCKS.PARAGRAPH]: (node: { content: Array<{ nodeType: string; value?: string }> }) => {
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
        // Add other node types as needed
    },
};

export default function ProfileCareerExperience({ type, roles, markets, sectors, skills, tools, education, awards, languages, location }: ProfileCareerExperienceProps) {
    return (
        <Container id='experience' className="relative">
            <Box direction="col" className="p-4 md:p-8 shadow-lg rounded-lg bg-white">
                <h1 className="flex gap-2">
                    Career
                    <span className={` 
                ${type === 'Design' ? 'text-designpurple' : ''} 
                ${type === 'Engineering' ? 'text-engblue' : ''} 
                ${type === 'Management' ? 'text-manpink' : ''}
            `}>
                        Experience
                    </span>
                </h1>
                <Carousel>
                    <Box className='absolute -top-12  right-8 md:right-14 h-8 w-fit'>
                        <CarouselPrevious className='' />
                        <CarouselNext className='' />
                    </Box>
                    <CarouselContent className="gap-4 ml-[0.5px]">
                        {roles.reverse().map((background, index) => (
                            <CarouselItem key={index} className={`
                    basis-4/5 md:basis-2/5 border rounded-xl px-4 py-6
                    ${type === 'Design' ? 'bg-designpurplebg border-designpurpleborder' : ''}
                    ${type === 'Engineering' ? 'bg-engbluebg border-engblueborder' : ''}
                    ${type === 'Management' ? 'bg-manpinkbg border-manpinkborder' : ''}
                `}>
                                <Box direction="col">
                                    <h3>{background.companyName}</h3>
                                    <p className="mb-6">{background.startDate ? new Date(background.startDate).getFullYear() : 'N/A'} - {background.endDate ? new Date(background.endDate).getFullYear() : 'Present'}</p>
                                    <h5>{background.roleTitle}</h5>
                                    <Prose className="">{background.roleDescription?.json ? documentToReactComponents(background.roleDescription.json, options) : <p>No description available.</p>}</Prose>
                                </Box>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className="border-b border-[#a4a7ae] mb-4 mt-2 md:mb-6 md:mt-8"></div>
                <Carousel>
                    <CarouselContent>
                        <CarouselItem className="basis-1/3 md:basis-1/6">
                            <Box direction="col" gap={2}>
                                <p className="uppercase font-bold text-[#a4a7ae] text-[10px] md:text-[12px]">Markets</p>
                                {markets?.map((market, index) => (
                                    <p key={index} className='font-semibold'>{market}</p>
                                ))}
                            </Box>
                        </CarouselItem>
                        <CarouselItem className="basis-1/2 md:basis-1/4">
                            <Box direction="col" gap={2}>
                                <p className="uppercase font-bold text-[#a4a7ae] text-[10px] md:text-[12px]">Sectors</p>
                                {sectors?.map((sector, index) => (
                                    <p key={index} className='font-semibold'>{sector}</p>
                                ))}
                            </Box>
                        </CarouselItem>
                        <CarouselItem className="basis-1/2 md:basis-1/4">
                            <Box direction="col" gap={2}>
                                <p className="uppercase font-bold text-[#a4a7ae] text-[10px] md:text-[12px]">Skills & Methods</p>
                                <Box className="grid grid-col-1 gap-2 overflow-y-hidden">
                                    {skills?.map((skill, index) => (
                                        <Box className="" key={index}>
                                            <p className='font-semibold'>{skill}</p>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </CarouselItem>
                        <CarouselItem className="basis-1/2 md:basis-1/4">
                            <Box direction="col" gap={2}>
                                <p className="uppercase font-bold text-[#a4a7ae] text-[10px] md:text-[12px]">Tools</p>
                                {tools?.map((tool, index) => (
                                    <p key={index} className='font-semibold'>{tool}</p>
                                ))}
                            </Box>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
                <div className="border-b border-[#a4a7ae] my-4 md:mb-4 md:mt-8"></div>
                <Carousel>
                    <CarouselContent>
                        <CarouselItem className="basis-1/2 md:basis-1/4">
                            <Box direction="col" gap={4}>
                                <p className="uppercase font-bold text-[#a4a7ae] text-[10px] md:text-[12px] mt-4">Education</p>
                                {education.map((edu, index) => (
                                    <Box key={index} direction="col" gap={0.5} className=''>
                                        <h6>{edu.institution}</h6>
                                        <p>{edu.degreeName}</p>
                                        <Box gap={1}>
                                            <p className='text-[10px] md:text-[12px]'>{location}</p>
                                            <p className='text-[10px] md:text-[12px]'>•</p>
                                            <p className="text-[10px] md:text-[12px] font-bold">{new Date(edu.timeframe).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </CarouselItem>
                        {awards.length > 0 ? (
                            <CarouselItem className="basis-1/3 md:basis-1/4">
                                <Box direction="col" gap={4} className="">
                                    <p className="uppercase font-bold text-[#a4a7ae] text-[10px] md:text-[12px] mt-4">Awards</p>
                                    <Box direction="col" gap={2}>
                                        {awards.reverse().map((award, index) => (
                                            <Box key={index} direction="col" gap={1} className="">
                                                <h6>{award.awardName}</h6>
                                                <p className="text-[10px] md:text-[12px]">{new Date(award.awardDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </CarouselItem>
                        ) : null}
                        {languages.length > 0 ? (
                            <CarouselItem className="basis-1/2">
                                <p className="uppercase font-bold text-[#a4a7ae] text-[10px] md:text-[12px] mb-2 mt-4">Languages</p>
                                <Box direction="col" gap={2}>
                                    {languages.reverse().map((language, index) => (
                                        <div key={index} className="flex">
                                            <h6>{language.name}</h6>
                                            <p className="">, {language.type}</p>
                                        </div>
                                    ))}
                                </Box>
                            </CarouselItem>
                        ) : null}
                    </CarouselContent>
                </Carousel>
            </Box>
        </Container>
    )
}

import { Box } from "@/components/global/matic-ds";
import { OverviewItem } from "@/components/shared/items/OverviewItem";

interface OverviewListProps {
    role: string;
    focus: string | undefined;
    tier: string;
    level: string;
    location: string;
    color: string;
    experience: string | undefined;
    engagementType: ("Full-Time" | "Dedicated" | "Fractional")[] | undefined;
}

export const OverviewList = ({ role, focus, tier, level, location, color, experience, engagementType}: OverviewListProps) => {
    return (
        <Box  cols={{ sm: 2, md: 3}} className={
            `
                rounded-lg overflow-hidden border 
                ${color === 'Design' ? 'bg-designpurplebg border-designpurpleborder' : ''}
                ${color === 'Engineering' ? 'bg-engbluebg border-engblueborder' : ''}
                ${color === 'Management' ? 'bg-manpinkbg border-manpinkborder' : ''}
                ${color === 'Strategy' ? 'bg-strategygreenbg border-strategygreenborder' : ''}
            `
        }>
            <OverviewItem label="Role" value={`${level} ${role}`} color={color} />
            <OverviewItem label="Focus" value={focus} color={color} />
            <OverviewItem label="Tier" value={tier} color={color} />
            <OverviewItem label="Location & Timezone" value={location} color={color} />
            <OverviewItem label="Experience" value={experience?.toString()} color={color} />
            <OverviewItem label="Engagement Types" value={engagementType?.join(', ')} color={color} />
        </Box>
    );
}
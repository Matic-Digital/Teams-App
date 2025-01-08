import { Box } from "@/components/global/matic-ds";

interface OverviewItemProps {
    label: string;
    value: string | number | undefined;
    color: string;
}

export const OverviewItem = ({ label, value, color }: OverviewItemProps) => {
    return (
        <Box direction="col" gap={0.5} className={`
            items-start border p-4 h-full justify-center flex-grow
            ${color === 'Design' ? 'border-designpurpleborder' : ''}
            ${color === 'Engineering' ? 'border-engblueborder' : ''}
            ${color === 'Management' ? 'border-manpinkborder' : ''}
            ${color === 'Strategy' ? 'border-strategygreenborder' : ''}
        `}>
            <p className="uppercase font-bold text-[#a4a7ae] text-[10px]">{label}</p>
            <p className="font-semibold">{value}</p>
        </Box>
    )
}
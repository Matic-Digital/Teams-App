import { Box } from "../global/matic-ds";

interface OverviewItemProps {
    label: string;
    value: string | number | undefined;
    color: string;
}

export default function OverviewItem({ label, value, color }: OverviewItemProps) {
    return (
        <Box direction="col" gap={0.5} className={`
            items-start border p-4 h-full justify-center flex-grow
            ${color === 'Design' ? 'border-[#e9d7fe]/80' : ''}
            ${color === 'Engineering' ? 'border-[#c7d7fe]/80' : ''}
        `}>
            <p className="uppercase font-bold text-[#a4a7ae] text-[10px]">{label}</p>
            <p className="font-semibold">{value}</p>
        </Box>
    )
}
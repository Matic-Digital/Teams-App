import Link from 'next/link';
import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Box } from '@/components/global/matic-ds';

import { type Talent } from '@/types';

interface ProfileTalentCardProps {
    talent: Talent;
    profileSlug: string;
}

export function ProfileTalentCard({ talent, profileSlug }: ProfileTalentCardProps) {
    return (
        <Box className="pointer-events-auto w-[200px] group">
            <Link
                href={`/talent/${talent.slug}/profile/${profileSlug}`}
                className="no-underline block transition-transform group-hover:scale-95 shadow-lg"
            >
                <Card className="overflow-hidden transition-colors rounded-lg bg-foreground h-fit">
                    <CardContent className="p-0 rounded-none">
                        <Image
                            src={talent.headshot.url}
                            alt={`Cover image for ${talent.name}`}
                            height={200}
                            width={200}
                            className="aspect-square object-cover rounded-none border-none"
                            priority={false}
                        />
                    </CardContent>
                    <CardHeader className="p-3">
                        <CardTitle className="line-clamp-2 flex flex-col gap-1 text-sm">
                            <h3 className="text-white">{talent.name}</h3>
                            <h4 className="text-white text-xs">{talent.primaryTitle}</h4>
                        </CardTitle>
                    </CardHeader>
                </Card>
            </Link>
        </Box>
    );
}

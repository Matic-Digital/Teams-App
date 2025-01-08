import { Box } from '@/components/global/matic-ds';
import Link from 'next/link';
import { getProfileTypeStyles } from '@/utils/profileStyles';
import type { ProfileType } from '@/utils/profileStyles';

interface ProfileCardProps {
  talentSlug: string;
  profileSlug: string;
  profileType: ProfileType;
  role: string;
}

export const ProfileCard = ({ talentSlug, profileSlug, profileType, role }: ProfileCardProps) => {
  const styles = getProfileTypeStyles(profileType);
  
  return (
    <Link href={`/talent/${talentSlug}/profile/${profileSlug}`} className="hover:scale-95">
      <Box 
        direction="col" 
        gap={0} 
        className={`border w-fit p-4 rounded-lg ${styles.border}`}
      >
        <h4 className={styles.text}>{profileType}</h4>
        <h3 className="">{role}</h3>
      </Box>
    </Link>
  );
};

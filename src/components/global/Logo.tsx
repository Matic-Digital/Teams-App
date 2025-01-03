import Link from 'next/link';
import Image from 'next/image';
import { Box } from '@/components/global/matic-ds';

export function Logo() {
  return (
    <Link href="/" className="mr-6">
      <Box gap={2} className="items-center">
        <Image
          src="/teams-logo.svg"
          alt="Teams Logo"
          width={32}
          height={32}
          priority
          className="border-none rounded-none w-full"
        />
      </Box>
    </Link>
  );
}

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BackButtonProps {
  href: string;
}

export function BackButton({ href }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Link>
  );
}

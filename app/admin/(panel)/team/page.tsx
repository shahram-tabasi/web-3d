import type { Metadata } from 'next';
import { TeamEditor } from '@/src/admin/ui/sections/TeamEditor';

export const metadata: Metadata = { title: 'تیم و رزومه‌ها' };

export default function Page() {
  return <TeamEditor />;
}

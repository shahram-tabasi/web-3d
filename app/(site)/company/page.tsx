import { Company } from '@/src/site-pages/Company';
import { pageMetadata } from '@/src/seo/metadata';
import { getContent, toPublic } from '@/src/content/store';
import { getRequestLocale } from '@/src/seo/locale';
import { JsonLd, teamLd } from '@/src/seo/jsonld';

export const generateMetadata = pageMetadata('company');

export default async function Page() {
  const [c, locale] = await Promise.all([getContent(), getRequestLocale()]);
  const people = teamLd(c, toPublic(c).team, locale);
  return (
    <>
      {people.length > 0 && <JsonLd data={people} />}
      <Company />
    </>
  );
}

import type { ServiceItem } from '@/lib/portfolio/model';

const serviceCopy = new Map<string, { label: string; preview: string }>([
  ['web-development', { label: 'Web development', preview: 'Build a website for your business.' }],
  ['e-commerce-solution', { label: 'E-commerce', preview: 'Set up or improve your online store.' }],
  ['android-development', { label: 'Android development', preview: 'Build an Android app for your business.' }],
  ['web-designing', { label: 'Web design', preview: 'Design a clear and useful website.' }],
  ['responsive-web-design', { label: 'Responsive web design', preview: 'Make your website work across screen sizes.' }],
  ['seo', { label: 'SEO', preview: 'Help people find your site through search.' }],
]);

export const featuredServiceSlugs = ['web-development', 'e-commerce-solution', 'android-development'] as const;

export function getServiceCopy(service: ServiceItem) {
  const known = serviceCopy.get(service.slug);
  return known
    ? { ...known, known: true }
    : { label: service.title, preview: service.description, known: false };
}

import { z } from 'zod';

import type { PortfolioSource } from './config';

const requiredText = z.string().trim().min(1);

function isImagePath(value: string): boolean {
  if (!value.trim() || value.includes('\\')) return false;
  if (value.startsWith('/')) return !value.startsWith('//');

  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

const imagePath = z.string().refine(isImagePath);
const optionalImagePath = imagePath.optional().catch(undefined);

const emailContact = z.object({
  content: requiredText.regex(/^[^\s@?#]+@[^\s@?#]+\.[^\s@?#]+$/),
}).optional().catch(undefined);

const whatsappContact = z.object({
  content: z.string()
    .transform(value => value.trim().replace(/[\s()-]/g, ''))
    .pipe(z.string().regex(/^\+[1-9]\d{7,14}$/))
    .transform(value => value.slice(1)),
}).optional().catch(undefined);

const processItem = z.object({
  slug: requiredText,
  title: requiredText,
  icon: requiredText,
});
const serviceItem = processItem.extend({ description: requiredText });

const companySchema = z.object({
  layout: z.object({
    navbar: z.object({
      logo: z.object({ title: requiredText, imagePath }),
      headerInfo: z.object({ email: emailContact, phone: whatsappContact }),
    }),
  }),
  page: z.object({
    whatWeDo: z.object({ items: z.array(serviceItem) }),
    workProcess: z.object({ heading: requiredText, processes: z.array(processItem) }),
    whyChooseUs: z.object({ heading: requiredText, content: requiredText }),
  }),
}).transform(({ layout: { navbar }, page }) => ({
  logo: navbar.logo,
  email: navbar.headerInfo.email?.content,
  phone: navbar.headerInfo.phone?.content,
  services: page.whatWeDo.items,
  processHeading: page.workProcess.heading,
  processes: page.workProcess.processes,
  whyHeading: page.whyChooseUs.heading,
  whyParagraphs: page.whyChooseUs.content.split(/\n\s*\n/).map(part => part.trim()).filter(Boolean),
}));

const personalSchema = z.object({
  page: z.object({
    profile: z.object({ name: requiredText, image: optionalImagePath }),
  }),
}).transform(({ page }) => page.profile);

export const portfolioSchemas = {
  company: companySchema,
  personal: personalSchema,
} satisfies Record<PortfolioSource, z.ZodType>;

type PortfolioSchemas = typeof portfolioSchemas;
export type PortfolioContent = {
  [Source in PortfolioSource]: z.output<PortfolioSchemas[Source]>;
};
export type CompanyContent = PortfolioContent['company'];
export type PersonalContent = PortfolioContent['personal'];
export type ServiceItem = z.output<typeof serviceItem>;
export type ProcessItem = z.output<typeof processItem>;

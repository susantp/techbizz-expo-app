export type ServiceItem = { slug: string; title: string; description: string; icon: string };
export type ProcessItem = { slug: string; title: string; icon: string };
export type CompanyContent = { logo: { title: string; imagePath: string }; email?: string; phone?: string; services: ServiceItem[]; processHeading: string; processes: ProcessItem[]; whyHeading: string; whyParagraphs: string[] };
export type PersonalContent = { name: string; image?: string };
type RecordValue = Record<string, unknown>;
function object(value: unknown, label: string): RecordValue { if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid ' + label); return value as RecordValue; }
function required(value: unknown, label: string): string { if (typeof value !== 'string' || !value.trim()) throw new Error('Invalid ' + label); return value.trim(); }
function safeImage(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim() || value.includes('\\')) return undefined;
  if (/^\/(?!\/)/.test(value)) return value;
  try { const url = new URL(value); return url.protocol === 'http:' || url.protocol === 'https:' ? value : undefined; } catch { return undefined; }
}
function array<T>(value: unknown, label: string, parse: (item: unknown) => T): T[] { if (!Array.isArray(value)) throw new Error('Invalid ' + label); return value.map(parse); }
function email(value: unknown): string | undefined { if (typeof value !== 'string') return undefined; const candidate = value.trim(); return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) && !/[?#]/.test(candidate) ? candidate : undefined; }
function whatsapp(value: unknown): string | undefined { if (typeof value !== 'string') return undefined; const digits = value.trim().replace(/[\s()-]/g, ''); return /^\+[1-9]\d{7,14}$/.test(digits) ? digits.slice(1) : undefined; }
function optionalContact(value: unknown): unknown {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as RecordValue).content : undefined;
}
export function readCompanyContent(input: unknown): CompanyContent {
  const root = object(input, 'company response'), layout = object(root.layout, 'layout'), navbar = object(layout.navbar, 'navbar'), logo = object(navbar.logo, 'logo'), info = object(navbar.headerInfo, 'contacts'), page = object(root.page, 'page'), what = object(page.whatWeDo, 'services'), process = object(page.workProcess, 'process'), why = object(page.whyChooseUs, 'introduction');
  const emailValue = optionalContact(info.email);
  const phoneValue = optionalContact(info.phone);
  const logoPath = safeImage(logo.imagePath);
  if (!logoPath) throw new Error('Invalid logo path');
  return {
    logo: { title: required(logo.title, 'company name'), imagePath: logoPath }, email: email(emailValue), phone: whatsapp(phoneValue),
    services: array(what.items, 'services', item => { const v = object(item, 'service'); return { slug: required(v.slug, 'service slug'), title: required(v.title, 'service title'), description: required(v.description, 'service description'), icon: required(v.icon, 'service icon') }; }),
    processHeading: required(process.heading, 'process heading'),
    processes: array(process.processes, 'processes', item => { const v = object(item, 'process'); return { slug: required(v.slug, 'process slug'), title: required(v.title, 'process title'), icon: required(v.icon, 'process icon') }; }),
    whyHeading: required(why.heading, 'introduction heading'), whyParagraphs: required(why.content, 'introduction').split(/\n\s*\n/).map(part => part.trim()).filter(Boolean),
  };
}
export function readPersonalContent(input: unknown): PersonalContent {
  const root = object(input, 'personal response'), page = object(root.page, 'page'), profile = object(page.profile, 'profile');
  return { name: required(profile.name, 'profile name'), image: safeImage(profile.image) };
}

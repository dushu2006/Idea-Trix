/**
 * Central event dataset for IDEATRIX.
 *
 * Every section of the site reads from this module so that facts (date, fee,
 * team size, venue, …) are defined once and displayed consistently. When the
 * organisers confirm a detail (e.g. the year), update it here and the whole
 * site — including the registration review and FAQ — follows.
 */

export const EVENT = {
  name: 'IDEATRIX',
  edition: 'Vol. 01',
  kind: 'Ideathon',
  tagline: 'Turn a problem into a presentable idea.',
  description:
    'Teams of up to two students pick a problem, shape a concept, and present it as a PowerPoint.',
  organisers: [
    { name: 'Department of Artificial Intelligence and Data Science', short: 'AI & DS' },
    { name: 'Matrix Club', short: 'Matrix Club' },
    { name: 'Vignan’s Institute of Information Technology, Visakhapatnam', short: 'VIIT' },
  ],
  date: {
    display: 'November 23',
    /** The year has not been announced by the organisers — keep this honest everywhere. */
    yearNote: 'Year to be confirmed',
  },
  time: {
    reporting: '8:45 AM',
    end: '4:00 PM',
  },
  team: {
    maxMembers: 2,
    feeINR: 100,
  },
  format: 'PowerPoint presentation',
  venue: {
    name: 'Seminar Hall 1, VIIT',
    note: 'Venue is provisional, not yet confirmed.',
  },
} as const;

export type SectionId =
  | 'hero'
  | 'about'
  | 'details'
  | 'journey'
  | 'schedule'
  | 'guidelines'
  | 'certificates'
  | 'faq'
  | 'register';

/** Editorial section registry: number, anchor, nav label. */
export const SECTIONS: { id: SectionId; index: string; label: string }[] = [
  { id: 'hero', index: '00', label: 'Home' },
  { id: 'about', index: '01', label: 'About' },
  { id: 'details', index: '02', label: 'Details' },
  { id: 'journey', index: '03', label: 'Journey' },
  { id: 'schedule', index: '04', label: 'Schedule' },
  { id: 'guidelines', index: '05', label: 'Guidelines' },
  { id: 'certificates', index: '06', label: 'Certificates' },
  { id: 'faq', index: '07', label: 'FAQ' },
  { id: 'register', index: '08', label: 'Register' },
];

/** Links shown in the desktop header; the mobile menu lists every section. */
export const HEADER_NAV: SectionId[] = ['about', 'details', 'journey', 'schedule', 'faq'];

export interface JourneyStage {
  id: string;
  step: string;
  name: string;
  tagline: string;
  description: string;
  prompt: string;
}

/**
 * Explanatory stages of the ideathon journey. These describe the flow of the
 * day — they are not additional event rules.
 */
export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'imagine',
    step: '01',
    name: 'Imagine',
    tagline: 'Identify a meaningful problem.',
    description:
      'Start with the problem, not the solution. The strongest entries name a specific problem, say who feels it, and explain why it matters right now.',
    prompt: 'What problem is worth solving — and who feels it most?',
  },
  {
    id: 'develop',
    step: '02',
    name: 'Develop',
    tagline: 'Shape the idea into a clear concept.',
    description:
      'Turn a rough spark into a concept someone else can understand: what changes, how it works at a high level, and what makes it different from the obvious answer.',
    prompt: 'Can you explain the whole concept in three sentences?',
  },
  {
    id: 'present',
    step: '03',
    name: 'Present',
    tagline: 'Communicate the concept through a PPT.',
    description:
      'Ideas are presented as a PowerPoint. A clear structure — problem, concept, why it works — beats a long deck every time.',
    prompt: 'Does every slide earn its place in the story?',
  },
  {
    id: 'inspire',
    step: '04',
    name: 'Inspire',
    tagline: 'Share the potential value of the idea.',
    description:
      'Close by showing what changes if the idea succeeds. Judges and audiences remember ideas whose value they can picture.',
    prompt: 'What does the world look like if this idea works?',
  },
];

export interface ScheduleItem {
  time: string;
  title: string;
  note: string;
  status: 'confirmed' | 'tba';
}

export const SCHEDULE: ScheduleItem[] = [
  {
    time: EVENT.time.reporting,
    title: 'Reporting',
    note: 'Report at the venue by 8:45 AM.',
    status: 'confirmed',
  },
  {
    time: 'TBA',
    title: 'Activities',
    note: 'Schedule to be announced.',
    status: 'tba',
  },
  {
    time: 'TBA',
    title: 'Presentations & results',
    note: 'Schedule to be announced.',
    status: 'tba',
  },
  {
    time: EVENT.time.end,
    title: 'Scheduled end',
    note: 'The event closes at 4:00 PM.',
    status: 'confirmed',
  },
];

export interface Guideline {
  title: string;
  note: string;
}

export const GUIDELINES: Guideline[] = [
  {
    title: `Maximum ${EVENT.team.maxMembers} members per team`,
    note: 'Teams of one or two — pairs are the maximum.',
  },
  {
    title: `₹${EVENT.team.feeINR} registration fee per team`,
    note: 'One fee covers the whole team.',
  },
  {
    title: 'PowerPoint presentation required',
    note: 'Ideas are presented as a PowerPoint.',
  },
  {
    title: `Report at ${EVENT.time.reporting}`,
    note: 'Reach the venue before reporting time.',
  },
];

export interface Certificate {
  id: string;
  title: string;
  body: string;
  footnote: string;
}

export const CERTIFICATES: Certificate[] = [
  {
    id: 'digital',
    title: 'Digital participation certificates',
    body: 'Digital participation certificates will be sent to participants’ registered email addresses.',
    footnote: 'Use an email you actually check when you register.',
  },
  {
    id: 'physical',
    title: 'Physical certificates for the top five',
    body: 'Physical certificates will be awarded only to the top five teams.',
    footnote: 'Awarded on the day of the event.',
  },
];

export interface Faq {
  id: string;
  q: string;
  a: string;
  tags: string[];
}

export const FAQS: Faq[] = [
  {
    id: 'what',
    q: 'What is IDEATRIX?',
    a: 'An ideathon where students identify problems, develop concepts, and present ideas through PowerPoint presentations.',
    tags: ['about', 'event', 'ideathon'],
  },
  {
    id: 'who',
    q: 'Who is organising it?',
    a: 'The Department of AI & DS and Matrix Club at Vignan’s Institute of Information Technology (VIIT), Visakhapatnam.',
    tags: ['about', 'organisers', 'matrix', 'viit'],
  },
  {
    id: 'when',
    q: 'When is the event?',
    a: 'November 23. The year is yet to be confirmed. Reporting is at 8:45 AM and the scheduled end is 4:00 PM.',
    tags: ['date', 'time', 'schedule', 'reporting'],
  },
  {
    id: 'team',
    q: 'What is the maximum team size?',
    a: 'Two members per team. You can also take part on your own.',
    tags: ['team', 'members', 'size', 'solo'],
  },
  {
    id: 'fee',
    q: 'What is the registration fee?',
    a: '₹100 per team — one fee covers the whole team, whether solo or a pair.',
    tags: ['fee', 'payment', 'cost', 'price'],
  },
  {
    id: 'ppt',
    q: 'Is a PPT required?',
    a: 'Yes. Ideas are presented as a PowerPoint presentation, so bring your deck ready to present.',
    tags: ['ppt', 'powerpoint', 'presentation', 'deck'],
  },
  {
    id: 'venue',
    q: 'Where will the event take place?',
    a: 'Seminar Hall 1, VIIT. The venue is provisional and not yet confirmed.',
    tags: ['venue', 'location', 'hall', 'where'],
  },
  {
    id: 'certificates',
    q: 'How are certificates distributed?',
    a: 'Digital participation certificates go to registered email addresses. Physical certificates go only to the top five teams.',
    tags: ['certificates', 'digital', 'physical', 'top five'],
  },
];

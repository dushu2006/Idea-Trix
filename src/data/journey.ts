import type { SectionId } from './event';

/**
 * Destination-node definitions — the single source of truth binding the
 * neural scene, the camera, navigation, and content sections together.
 *
 * - `node` is the destination position in scene coordinates (1000 × 760).
 * - `side` is where the content panel sits on desktop; the camera frames the
 *   node on the opposite side so panel and node never overlap.
 */

export type PanelSide = 'left' | 'right' | 'center' | 'overview';

export interface DestinationDef {
  id: SectionId;
  index: string;
  label: string;
  short: string;
  accent: string;
  node: { x: number; y: number };
  side: PanelSide;
  a11y: string;
}

export const DESTINATIONS: DestinationDef[] = [
  {
    id: 'hero',
    index: '00',
    label: 'IDEATRIX',
    short: 'Hero',
    accent: '#14B8A6',
    node: { x: 500, y: 210 },
    side: 'overview',
    a11y: 'IDEATRIX overview — the complete neural brain',
  },
  {
    id: 'about',
    index: '01',
    label: 'About',
    short: 'About',
    accent: '#FB923C',
    node: { x: 300, y: 250 },
    side: 'right',
    a11y: 'About the event',
  },
  {
    id: 'details',
    index: '02',
    label: 'Event Details',
    short: 'Details',
    accent: '#22D3EE',
    node: { x: 250, y: 390 },
    side: 'left',
    a11y: 'Event details and logistics',
  },
  {
    id: 'journey',
    index: '03',
    label: 'Ideathon Journey',
    short: 'Journey',
    accent: '#A78BFA',
    node: { x: 700, y: 245 },
    side: 'right',
    a11y: 'The four ideathon journey stages',
  },
  {
    id: 'schedule',
    index: '04',
    label: 'Schedule',
    short: 'Schedule',
    accent: '#38BDF8',
    node: { x: 745, y: 390 },
    side: 'left',
    a11y: 'Event schedule',
  },
  {
    id: 'guidelines',
    index: '05',
    label: 'Guidelines',
    short: 'Guide',
    accent: '#FBBF24',
    node: { x: 320, y: 510 },
    side: 'right',
    a11y: 'Participation guidelines',
  },
  {
    id: 'certificates',
    index: '06',
    label: 'Certificates',
    short: 'Certs',
    accent: '#F472B6',
    node: { x: 680, y: 510 },
    side: 'left',
    a11y: 'Certificate distribution',
  },
  {
    id: 'faq',
    index: '07',
    label: 'FAQ',
    short: 'FAQ',
    accent: '#FB7185',
    node: { x: 500, y: 545 },
    side: 'right',
    a11y: 'Frequently asked questions',
  },
  {
    id: 'register',
    index: '08',
    label: 'Registration',
    short: 'Register',
    accent: '#34D399',
    node: { x: 500, y: 405 },
    side: 'center',
    a11y: 'Team registration',
  },
];

/** Journey order — also the order of the highlighted neural route. */
export const JOURNEY_ORDER: SectionId[] = DESTINATIONS.map((d) => d.id);

export const destinationById = (id: SectionId): DestinationDef =>
  DESTINATIONS.find((d) => d.id === id) as DestinationDef;

export const destinationIndex = (id: SectionId): number =>
  JOURNEY_ORDER.findIndex((entry) => entry === id);

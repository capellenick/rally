// Seed data for the Boone / App State showcase. Dates are relative to "now" so the
// feed never goes stale while demoing — and is never empty.

export type Sport = 'tennis' | 'pickleball';
export type Skill = 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
export type Format = 'Singles' | 'Doubles' | 'Open Play';

export interface Player {
  initials: string;
  name: string;
}

export interface Match {
  id: string;
  sport: Sport;
  format: Format;
  skill: Skill;
  /** Days from today */
  dayOffset: number;
  start: string;
  end: string;
  court: string;
  area: string;
  miles: number;
  host: Player;
  players: Player[];
  spots: number;
}

const P = (initials: string, name: string): Player => ({ initials, name });

export const matches: Match[] = [
  {
    id: 'm1', sport: 'tennis', format: 'Singles', skill: 'Intermediate',
    dayOffset: 0, start: '6:00', end: '7:30pm',
    court: 'App State Tennis Courts', area: 'App State campus', miles: 0.4,
    host: P('JM', 'Jordan'), players: [], spots: 1,
  },
  {
    id: 'm2', sport: 'pickleball', format: 'Doubles', skill: 'Beginner',
    dayOffset: 0, start: '7:00', end: '8:30pm',
    court: 'Student Rec Center', area: 'App State campus', miles: 0.9,
    host: P('AC', 'Ava'), players: [P('DM', 'Diego')], spots: 2,
  },
  {
    id: 'm3', sport: 'tennis', format: 'Doubles', skill: 'Advanced',
    dayOffset: 1, start: '7:00', end: '8:30am',
    court: 'Watauga County Park', area: 'Boone', miles: 2.3,
    host: P('KR', 'Kayla'), players: [P('AE', 'Andy'), P('RZ', 'Robby')], spots: 1,
  },
  {
    id: 'm4', sport: 'pickleball', format: 'Open Play', skill: 'Intermediate',
    dayOffset: 1, start: '5:30', end: '7:30pm',
    court: 'Watauga County Park', area: 'Boone', miles: 2.3,
    host: P('EC', 'Elizabeth'), players: [P('HD', 'Haley'), P('LM', 'Luis'), P('SK', 'Sam'), P('TB', 'Theo'), P('NW', 'Nia')], spots: 3,
  },
  {
    id: 'm5', sport: 'tennis', format: 'Singles', skill: 'Beginner',
    dayOffset: 3, start: '10:00', end: '11:30am',
    court: 'App State Tennis Courts', area: 'App State campus', miles: 0.4,
    host: P('CM', 'Chris'), players: [], spots: 1,
  },
  {
    id: 'm6', sport: 'pickleball', format: 'Doubles', skill: 'Advanced',
    dayOffset: 5, start: '9:00', end: '11:00am',
    court: 'Student Rec Center', area: 'App State campus', miles: 0.9,
    host: P('DM', 'Diego'), players: [P('AC', 'Ava')], spots: 2,
  },
];

const DAY = 86_400_000;

export function dayLabel(offset: number, now = new Date()): string {
  if (offset === 0) return 'Today';
  if (offset === 1) return 'Tomorrow';
  if (offset === -1) return 'Yesterday';
  return new Date(now.getTime() + offset * DAY).toLocaleDateString('en-US', {
    weekday: 'long',
  });
}

export function shortDate(offset: number, now = new Date()): string {
  return new Date(now.getTime() + offset * DAY).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

export const sportLabel: Record<Sport, string> = {
  tennis: 'Tennis',
  pickleball: 'Pickleball',
};

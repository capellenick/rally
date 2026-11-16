// People, conversations and activity for the prototype. Everything is local
// state seeded here; the real app will back this with the server.
import { matches, type Match, type Skill, type Sport } from './matches';

export interface Person {
  id: string;
  initials: string;
  name: string;
  handle: string;
  pronouns: string;
  age: number;
  home: string;
  occupation: string;
  joined: string;
  bio: string;
  sports: { sport: Sport; skill: Skill }[];
  played: number;
  /** Share of confirmed matches they actually showed up to */
  showUp: number;
}

export const me: Person = {
  id: 'me', initials: 'NC', name: 'Nick Capelle', handle: 'nickcapelle', pronouns: 'He/Him', age: 22,
  home: 'Boone, NC', occupation: 'Student at App State', joined: 'Joined May 2026',
  bio: 'Product designer, former high-school tennis player. Trying to play three times a week — singles or doubles, always down for pickleball.',
  sports: [{ sport: 'tennis', skill: 'Intermediate' }, { sport: 'pickleball', skill: 'Beginner' }],
  played: 11, showUp: 1,
};

const person = (p: Omit<Person, 'handle' | 'joined'> & { joined?: string }): Person => ({
  handle: p.name.toLowerCase(),
  joined: 'Joined June 2026',
  ...p,
});

export const people: Record<string, Person> = {
  JM: person({
    id: 'JM', initials: 'JM', name: 'Jordan', pronouns: 'They/Them', age: 24, home: 'Boone',
    occupation: 'Grad student at App State', played: 18, showUp: 0.97,
    bio: 'Played No. 2 singles in college. Looking for steady hitting partners between classes, usually at the campus courts.',
    sports: [{ sport: 'tennis', skill: 'Intermediate' }],
  }),
  KR: person({
    id: 'KR', initials: 'KR', name: 'Kayla', pronouns: 'She/Her', age: 26, home: 'Boone',
    occupation: 'Senior at App State', played: 23, showUp: 1,
    bio: 'Doubles is my happy place. I run an early group at the campus courts most Tuesdays — come hit!',
    sports: [{ sport: 'tennis', skill: 'Advanced' }, { sport: 'pickleball', skill: 'Intermediate' }],
  }),
  DM: person({
    id: 'DM', initials: 'DM', name: 'Diego', pronouns: 'He/Him', age: 29, home: 'Blowing Rock',
    occupation: 'Software engineer', played: 9, showUp: 0.9,
    bio: 'Picked up pickleball last year and can’t stop. Competitive but friendly.',
    sports: [{ sport: 'pickleball', skill: 'Advanced' }],
  }),
  AC: person({
    id: 'AC', initials: 'AC', name: 'Ava', pronouns: 'She/Her', age: 21, home: 'App State',
    occupation: 'Sophomore at App State', played: 4, showUp: 1,
    bio: 'New to pickleball and looking for chill doubles games.',
    sports: [{ sport: 'pickleball', skill: 'Beginner' }],
  }),
  CM: person({
    id: 'CM', initials: 'CM', name: 'Chris', pronouns: 'He/Him', age: 31, home: 'Downtown Boone',
    occupation: 'Teacher', played: 6, showUp: 0.83,
    bio: 'Getting back into tennis after ten years off. Patient partners appreciated!',
    sports: [{ sport: 'tennis', skill: 'Beginner' }],
  }),
  EC: person({
    id: 'EC', initials: 'EC', name: 'Elizabeth', pronouns: 'She/Her', age: 27, home: 'Boone',
    occupation: 'Physical therapist', played: 31, showUp: 1,
    bio: 'Host of Thursday open play at Watauga County Park. All levels welcome.',
    sports: [{ sport: 'pickleball', skill: 'Intermediate' }],
  }),
};

export interface Message {
  id: string;
  from: 'me' | 'them' | 'system';
  text: string;
  at: number;
}

export interface Thread {
  id: string;
  personId: string;
  messages: Message[];
  unread: boolean;
}

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const now = Date.now();

export const seedThreads: Thread[] = [
  {
    id: 't-KR', personId: 'KR', unread: true,
    messages: [
      { id: 'k1', from: 'system', text: 'Kayla approved your request · Tennis Doubles', at: now - 5 * HOUR },
      { id: 'k2', from: 'them', text: 'Welcome to the group! We’re usually on courts 3 and 4 👋', at: now - 4.5 * HOUR },
      { id: 'k3', from: 'me', text: 'Awesome, I’ll bring a fresh can of balls', at: now - 4 * HOUR },
      { id: 'k4', from: 'them', text: 'Legend. See you at 7!', at: now - 38 * MIN },
    ],
  },
  {
    id: 't-DM', personId: 'DM', unread: false,
    messages: [
      { id: 'd1', from: 'them', text: 'Good games today 🏓', at: now - 2 * DAY },
      { id: 'd2', from: 'me', text: 'Thanks! That third game was close', at: now - 2 * DAY + 20 * MIN },
      { id: 'd3', from: 'them', text: 'Rematch next week?', at: now - 2 * DAY + 25 * MIN },
    ],
  },
];

export type ActivityStatus = 'upcoming' | 'confirm' | 'played' | 'missed';

export interface ActivityItem {
  id: string;
  match: Match;
  personId: string;
  status: ActivityStatus;
}

export const seedActivity: ActivityItem[] = [
  { id: 'a-m3', match: matches[2], personId: 'KR', status: 'upcoming' },
  {
    id: 'a-p1', personId: 'DM', status: 'confirm',
    match: { ...matches[5], id: 'p1', dayOffset: -2, start: '6:00', end: '7:30pm', format: 'Singles' },
  },
  {
    id: 'a-p2', personId: 'CM', status: 'played',
    match: { ...matches[4], id: 'p2', dayOffset: -6 },
  },
];

export const replies = [
  'Sounds good! 🎾',
  'Perfect, see you there.',
  'I’ll grab a court when I get there.',
  'Can’t wait 🙌',
];

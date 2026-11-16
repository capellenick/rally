import { sportLabel, type Match } from '../data/matches';

/** Resolve a match's "6:00"–"7:30pm" times to real Dates. */
export function matchTimes(m: Match, now = new Date()): { start: Date; end: Date } {
  const day = new Date(now);
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() + m.dayOffset);

  const parse = (t: string, meridiem: string) => {
    const [h, min] = t.replace(/[ap]m$/, '').split(':').map(Number);
    const h24 = (h % 12) + (meridiem === 'pm' ? 12 : 0);
    const d = new Date(day);
    d.setHours(h24, min || 0);
    return d;
  };

  const endMeridiem = m.end.slice(-2);
  const [sh] = m.start.split(':').map(Number);
  const [eh] = m.end.split(':').map(Number);
  // "11:00–1:00pm" starts in the morning; otherwise the start shares the end's meridiem
  const startMeridiem = endMeridiem === 'pm' && sh % 12 > eh % 12 ? 'am' : endMeridiem;
  return { start: parse(m.start, startMeridiem), end: parse(m.end, endMeridiem) };
}

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** Hand an .ics file to the OS — on iPhone this opens the native "Add to Calendar" sheet. */
export function addToCalendar(m: Match, partner: string) {
  const { start, end } = matchTimes(m);
  const title = `${sportLabel[m.sport]} ${m.format} with ${partner}`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Rally//EN',
    'BEGIN:VEVENT',
    `UID:${m.id}-${start.getTime()}@rally.app`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${m.court}\\, ${m.area}\\, Boone NC`,
    'DESCRIPTION:Booked on Rally.',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `rally-${m.sport}-${m.id}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

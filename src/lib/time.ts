const DAY = 86_400_000;

/** Inbox-style timestamp: "9:41 AM", "Yesterday", "Monday", "Oct 12". */
export function relativeStamp(at: number, now = Date.now()): string {
  const d = new Date(at);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const diff = startOfToday.getTime() - at;
  if (diff <= 0) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (diff < DAY) return 'Yesterday';
  if (diff < 6 * DAY) return d.toLocaleDateString('en-US', { weekday: 'long' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Chat section stamp: "Today 9:41 AM", like the Figma "Fri, Apr 10 at 8:09am". */
export function chatStamp(at: number, now = Date.now()): string {
  const day = relativeStamp(at, now);
  const time = new Date(at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return day.includes(':') ? `Today ${time}` : `${day} ${time}`;
}

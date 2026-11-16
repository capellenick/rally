import { useLayoutEffect, useRef, useState } from 'react';
import calendar from '../assets/figma/icon-calendar-small.svg';
import clock from '../assets/figma/icon-clock.svg';
import pin from '../assets/figma/icon-pin.svg';
import { AvatarStack } from '../components/AvatarStack';
import { Screen } from '../components/Screen';
import { SportGlyph } from '../components/SportGlyph';
import { shortDate, sportLabel } from '../data/matches';
import { me, people, type ActivityItem, type ActivityStatus } from '../data/social';
import { addToCalendar } from '../lib/calendar';
import styles from './Activity.module.css';

type Tab = 'upcoming' | 'recent';

interface Props {
  items: ActivityItem[];
  onMessage: (personId: string) => void;
  onSetStatus: (id: string, status: ActivityStatus) => void;
}

/** Activity — Figma 230:1204: Upcoming / Recent with an underline indicator. */
export function Activity({ items, onMessage, onSetStatus }: Props) {
  const [tab, setTab] = useState<Tab>('upcoming');
  const tabsRef = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState({ x: 0, w: 0 });

  // The underline tracks the selected tab's real width, so it survives font and text-size changes.
  useLayoutEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth });
  }, [tab]);
  const shown = items
    .filter((a) => (tab === 'upcoming' ? a.status === 'upcoming' : a.status !== 'upcoming'))
    .sort((a, b) => (tab === 'upcoming' ? 1 : -1) * (a.match.dayOffset - b.match.dayOffset));
  const toConfirm = items.filter((a) => a.status === 'confirm').length;

  return (
    <Screen inlineTitle="Activity">
      <div ref={tabsRef} className={styles.tabs} role="tablist" aria-label="Activity">
        {(['upcoming', 'recent'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={styles.tab}
            onClick={() => setTab(t)}
          >
            {t === 'upcoming' ? 'Upcoming' : 'Recent'}
            {t === 'recent' && toConfirm > 0 && <span className={styles.badge}>{toConfirm}</span>}
          </button>
        ))}
        <span className={styles.indicator} style={{ transform: `translateX(${bar.x}px)`, width: bar.w }} aria-hidden />
      </div>

      <div className={styles.list} role="tabpanel">
        {shown.map((a) => (
          <ActivityCard key={a.id} item={a} onMessage={onMessage} onSetStatus={onSetStatus} />
        ))}
        {shown.length === 0 && (
          <p className={styles.empty}>
            {tab === 'upcoming'
              ? 'Nothing booked yet. Request a match on Explore and it lands here once the host approves.'
              : 'Matches you’ve played will show up here.'}
          </p>
        )}
      </div>
    </Screen>
  );
}

function ActivityCard({
  item,
  onMessage,
  onSetStatus,
}: {
  item: ActivityItem;
  onMessage: (personId: string) => void;
  onSetStatus: (id: string, status: ActivityStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { match: m, status } = item;
  const partner = people[item.personId];
  const detailsId = `details-${item.id}`;

  return (
    <article className={styles.card} data-status={status}>
      <div className={styles.top}>
        <div className={styles.glyph}>
          <SportGlyph sport={m.sport} scale={0.86} />
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>
            {sportLabel[m.sport]} with {partner.name}
          </h3>
          <p className={styles.meta}>
            <img src={calendar} width={14} height={13} alt="" />
            {shortDate(m.dayOffset)}
          </p>
          <p className={styles.meta}>
            <img src={clock} width={18.5} height={18.5} alt="" />
            {m.start}–{m.end}
          </p>
        </div>
        <div className={styles.aside}>
          <AvatarStack players={[me, partner]} size={34} overlap={8} />
          {status === 'upcoming' && (
            <button
              type="button"
              className={styles.details}
              aria-expanded={open}
              aria-controls={detailsId}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? 'Less' : 'Details'}
            </button>
          )}
          {status === 'played' && <span className={styles.tagPlayed}>Played</span>}
          {status === 'missed' && <span className={styles.tagMissed}>Didn’t happen</span>}
        </div>
      </div>

      {status === 'upcoming' && (
        <div id={detailsId} className={styles.disclosure} data-open={open || undefined}>
          <div>
            <p className={styles.meta}>
              <img src={pin} width={16.5} height={20.7403} alt="" />
              {m.court} · {m.area}
            </p>
            <p className={styles.kicker}>
              {m.format} · <span>{m.skill}</span>
            </p>
            <div className={styles.actions}>
              <button type="button" className={styles.primary} onClick={() => onMessage(partner.id)}>
                Message {partner.name}
              </button>
              <button
                type="button"
                className={`${styles.secondary} glass`}
                onClick={() => {
                  addToCalendar(m, partner.name);
                  setAdded(true);
                }}
              >
                {added ? 'Added ✓' : 'Add to Calendar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'confirm' && (
        <div className={styles.confirm}>
          <p>Did you play with {partner.name}?</p>
          <div className={styles.actions}>
            <button type="button" className={styles.yes} onClick={() => onSetStatus(item.id, 'played')}>
              Yes, we played
            </button>
            <button type="button" className={`${styles.secondary} glass`} onClick={() => onSetStatus(item.id, 'missed')}>
              No
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

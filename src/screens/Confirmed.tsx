import { useCallback, useEffect, useRef, useState } from 'react';
import { Ball } from '../components/Ball';
import { AvatarStack } from '../components/AvatarStack';
import { ConfirmedPill, MatchCard } from '../components/MatchCard';
import { shortDate, type Match } from '../data/matches';
import { addToCalendar } from '../lib/calendar';
import styles from './Confirmed.module.css';
import { haptic } from '../lib/haptics';

interface Props {
  match: Match;
  onDone: () => void;
  /** Close the cover and open the chat with the host */
  onMessage: () => void;
}

/**
 * The playful register: the host approved, you're in. Presented full-screen
 * (like a SwiftUI fullScreenCover) so the moment gets the whole stage.
 */
export function Confirmed({ match, onDone, onMessage }: Props) {
  const doneRef = useRef<HTMLButtonElement>(null);
  const [leaving, setLeaving] = useState(false);
  const close = useCallback(() => {
    setLeaving(true);
    window.setTimeout(onDone, 330);
  }, [onDone]);
  const [added, setAdded] = useState(false);
  const you = { initials: 'NC', name: 'You' };

  useEffect(() => {
    doneRef.current?.focus({ preventScroll: true });
    haptic([12, 60, 18]);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  return (
    <div className={styles.cover} data-leaving={leaving || undefined} role="dialog" aria-modal="true" aria-labelledby="confirmed-title">
      <div className={styles.topBar}>
        <button ref={doneRef} type="button" className={styles.done} onClick={close}>
          Done
        </button>
      </div>

      <div className={styles.content}>
        <Ball size={60} />

        <h1 id="confirmed-title" className={styles.title}>You’re on.</h1>
        <p className={styles.lede}>
          {match.host.name} approved your request.
          <br />
          See you on the court.
        </p>

        <div className={styles.summary}>
          <div className={styles.pairing}>
            <AvatarStack players={[you, match.host]} size={40} overlap={8} />
            <span className={styles.names}>You &amp; {match.host.name}</span>
            <ConfirmedPill compact />
          </div>
          <MatchCard match={match} summary dateLabel={shortDate(match.dayOffset)} />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          onClick={() => {
            setLeaving(true);
            window.setTimeout(onMessage, 330);
          }}
        >
          Message {match.host.name}
        </button>
        <button
          type="button"
          className={styles.secondary}
          data-done={added || undefined}
          onClick={() => {
            addToCalendar(match, match.host.name);
            setAdded(true);
          }}
        >
          {added ? 'Added to Calendar ✓' : 'Add to Calendar'}
        </button>
      </div>
    </div>
  );
}

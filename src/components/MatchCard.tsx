import clock from '../assets/figma/icon-clock.svg';
import pin from '../assets/figma/icon-pin.svg';
import ring from '../assets/figma/confirmed-check-ring.svg';
import check from '../assets/figma/confirmed-check.svg';
import { sportLabel, type Match } from '../data/matches';
import { AvatarStack } from './AvatarStack';
import { SportGlyph } from './SportGlyph';
import styles from './MatchCard.module.css';

export type RequestState = 'idle' | 'pending' | 'confirmed';

interface Props {
  match: Match;
  state?: RequestState;
  onRequest?: () => void;
  /** Summary variant (used on the confirmation screen) drops the action column */
  summary?: boolean;
  dateLabel?: string;
}

/** Event card — Figma "Explore (home page)" 1:313, adapted to the post/request loop. */
export function MatchCard({ match, state = 'idle', onRequest, summary, dateLabel }: Props) {
  const people = [match.host, ...match.players];
  const spotsText = `${match.spots} ${match.spots === 1 ? 'spot' : 'spots'} left`;

  return (
    <article className={styles.card} data-summary={summary || undefined}>
      <div className={styles.glyph}>
        <SportGlyph sport={match.sport} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{sportLabel[match.sport]}</h3>
        <p className={styles.kicker}>
          <span>{match.format}</span>
          <span className={styles.dot} aria-hidden>·</span>
          <span className={styles.skill}>{match.skill}</span>
        </p>
        <p className={styles.meta}>
          <img src={clock} width={18.5} height={18.5} alt="" />
          <span>
            {dateLabel && <>{dateLabel}, </>}
            {match.start}–{match.end}
          </span>
        </p>
        <p className={styles.meta}>
          <img src={pin} width={16.5} height={20.7403} alt="" />
          <span>
            {match.court}
            <span className={styles.distance}> · {match.miles} mi</span>
          </span>
        </p>
      </div>

      {!summary && (
        <div className={styles.aside}>
          <AvatarStack players={people} />
          <p className={styles.spots}>{spotsText}</p>
          <RequestButton state={state} host={match.host.name} onRequest={onRequest} />
        </div>
      )}
    </article>
  );
}

function RequestButton({
  state,
  host,
  onRequest,
}: {
  state: RequestState;
  host: string;
  onRequest?: () => void;
}) {
  if (state === 'confirmed') {
    return <ConfirmedPill compact />;
  }
  const pending = state === 'pending';
  return (
    <button
      type="button"
      className={styles.request}
      data-pending={pending || undefined}
      disabled={pending}
      onClick={onRequest}
      aria-label={pending ? `Request sent to ${host}` : `Request to join ${host}'s match`}
    >
      {pending ? (
        <>
          <span className={styles.spinner} aria-hidden />
          Sent
        </>
      ) : (
        'Request'
      )}
    </button>
  );
}

/** The "Confirmed ✓" pill from the chat screen (320:2803). */
export function ConfirmedPill({ compact }: { compact?: boolean }) {
  return (
    <span className={styles.confirmed} data-compact={compact || undefined}>
      Confirmed
      <span className={styles.check} aria-hidden>
        <img src={ring} width={29} height={29} alt="" />
        <img src={check} width={18.4038} height={13.1162} alt="" />
      </span>
    </span>
  );
}

import type { Player } from '../data/matches';
import styles from './AvatarStack.module.css';

interface Props {
  players: Player[];
  /** How many faces to draw before collapsing into "+N" */
  max?: number;
  size?: number;
  /** How far each face tucks under the previous one, in pt */
  overlap?: number;
}

/** Overlapping initials avatars — Figma Group 39/40: #A8A8A8 discs with a card-coloured ring. */
export function AvatarStack({ players, max = 2, size = 44, overlap = 20 }: Props) {
  const shown = players.slice(0, max);
  const extra = players.length - shown.length;
  const names = players.map((p) => p.name).join(', ');

  return (
    <div className={styles.stack} role="img" aria-label={`Players: ${names}`}>
      {shown.map((p, i) => (
        <span
          key={p.initials + i}
          className={styles.avatar}
          style={{
            width: size,
            height: size,
            zIndex: max - i,
            fontSize: size * 0.36,
            marginLeft: i > 0 ? -overlap : undefined,
          }}
        >
          {p.initials}
        </span>
      ))}
      {extra > 0 && <span className={styles.extra}>+{extra}</span>}
    </div>
  );
}

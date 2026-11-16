import { useState } from 'react';
import styles from './Ball.module.css';
import { haptic } from '../lib/haptics';

/**
 * The ball from the "Rally." wordmark (Figma 1:5, #C3EE25) — the app's one
 * playful motif. It drops in and bounces on mount; tapping it squishes and hops.
 */
export function Ball({ size = 64 }: { size?: number }) {
  const [hops, setHops] = useState(0);

  return (
    <div className={styles.stage} style={{ ['--size' as string]: `${size}px` }}>
      <span className={styles.ripple} aria-hidden />
      <span className={styles.ripple} data-late aria-hidden />
      <button
        type="button"
        key={hops}
        className={styles.ball}
        data-hop={hops > 0 || undefined}
        onClick={() => {
          setHops((h) => h + 1);
          haptic(8);
        }}
        aria-label="Bounce the ball"
      />
      <span key={`s${hops}`} className={styles.shadow} data-hop={hops > 0 || undefined} aria-hidden />
    </div>
  );
}

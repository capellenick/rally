import { useCallback, useEffect, useState, type ReactNode } from 'react';
import back from '../assets/figma/button-back.svg';
import styles from './Pushed.module.css';

interface Props {
  onPop: () => void;
  /** Render prop gets a `back` that plays the pop transition before removing the screen */
  children: (back: () => void) => ReactNode;
}

/** A screen pushed onto a navigation stack: slides in from the right, out on back. */
export function Pushed({ onPop, children }: Props) {
  const [leaving, setLeaving] = useState(false);
  const pop = useCallback(() => {
    setLeaving(true);
    window.setTimeout(onPop, 280);
  }, [onPop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && pop();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pop]);

  return (
    <div className={styles.pushed} data-leaving={leaving || undefined}>
      {children(pop)}
    </div>
  );
}

/** Glass circular back button — Figma Group 178. */
export function BackButton({ onClick, label = 'Back' }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" className={`${styles.circle} glass`} onClick={onClick} aria-label={label}>
      <img src={back} width={38} height={38} alt="" />
    </button>
  );
}

/** Glass circular "•••" button — Figma Group 64. */
export function MoreButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className={`${styles.circle} glass`} onClick={onClick} aria-label={label}>
      <span className={styles.dots} aria-hidden>
        <i /><i /><i />
      </span>
    </button>
  );
}

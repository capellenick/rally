import plus from '../assets/figma/chip-plus.svg';
import cross from '../assets/figma/chip-x.svg';
import styles from './Chip.module.css';

export type Facet = 'sport' | 'skill' | 'day';

interface Props {
  label: string;
  facet: Facet;
  selected: boolean;
  onToggle: () => void;
}

/**
 * Toggle chip from the Figma Components frame (133:552): grey with a "+" when
 * off, filled with its facet colour and a "×" (the same glyph turned 45°) when on.
 */
export function Chip({ label, facet, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      className={selected ? styles.chip : `${styles.chip} glass`}
      data-facet={facet}
      aria-pressed={selected}
      onClick={onToggle}
    >
      <span className={styles.glyph} aria-hidden>
        <img src={selected ? cross : plus} width={22.8152} height={21.366} alt="" />
      </span>
      {label}
    </button>
  );
}

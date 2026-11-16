import type { ReactNode } from 'react';
import searchIcon from '../assets/figma/icon-search.svg';
import styles from './SearchField.module.css';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
  /** e.g. the filter button on Explore */
  trailing?: ReactNode;
}

/** Glass search pill — Figma 1:444, with the original magnifier glyph. */
export function SearchField({ value, onChange, placeholder, label, trailing }: Props) {
  return (
    <div className={`${styles.row} glass-float`} data-trailing={trailing ? true : undefined}>
      <label className={styles.field}>
        <span className={styles.glyph} aria-hidden>
          <img src={searchIcon} width={32.8835} height={29.9098} alt="" />
        </span>
        <span className="visually-hidden">{label}</span>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          enterKeyHint="search"
        />
      </label>
      {trailing}
    </div>
  );
}

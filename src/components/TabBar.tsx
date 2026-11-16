import explore from '../assets/figma/tab-explore.svg';
import messages from '../assets/figma/tab-messages.svg';
import activity from '../assets/figma/tab-activity.svg';
import profile from '../assets/figma/tab-profile.svg';
import styles from './TabBar.module.css';

const tabs = [
  { id: 'explore', label: 'Explore', icon: explore, w: 32.8835, h: 29.9098, rotate: true },
  { id: 'messages', label: 'Messages', icon: messages, w: 34, h: 29.4032 },
  { id: 'activity', label: 'Activity', icon: activity, w: 48, h: 26.2536 },
  { id: 'profile', label: 'Profile', icon: profile, w: 43, h: 34.5001 },
] as const;

export type TabId = (typeof tabs)[number]['id'];

/** Floating glass tab bar — Figma 358:3279, with the selected-tab capsule (358:3281). */
export function TabBar({
  active,
  onChange,
  badges = {},
}: {
  active: TabId;
  onChange: (t: TabId) => void;
  badges?: Partial<Record<TabId, number>>;
}) {
  return (
    <nav className={`${styles.bar} glass-float`} aria-label="Main">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          className={styles.tab}
          aria-current={active === t.id ? 'page' : undefined}
          aria-label={badges[t.id] ? `${t.label}, ${badges[t.id]} new` : undefined}
          onClick={() => onChange(t.id)}
        >
          <span className={styles.icon} data-rotate={'rotate' in t || undefined}>
            <img src={t.icon} width={t.w} height={t.h} alt="" />
            {!!badges[t.id] && <span className={styles.badge}>{badges[t.id]}</span>}
          </span>
          <span className={styles.label}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

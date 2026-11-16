import { useState } from 'react';
import location from '../assets/figma/icon-location.svg';
import briefcase from '../assets/figma/icon-briefcase.svg';
import calendar from '../assets/figma/icon-calendar.svg';
import { BackButton, MoreButton } from '../components/Pushed';
import { SportGlyph } from '../components/SportGlyph';
import { sportLabel } from '../data/matches';
import type { Person } from '../data/social';
import styles from './Profile.module.css';

interface Props {
  person: Person;
  isMe?: boolean;
  onBack?: () => void;
  onChat?: () => void;
}

/**
 * Profile — Figma "Profile View" 258:1528. Trust lives here, so this is the
 * restrained register: verification, show-up rate and match count up front.
 */
export function Profile({ person: p, isMe, onBack, onChat }: Props) {
  const [friend, setFriend] = useState(false);
  const [menu, setMenu] = useState(false);
  const [reported, setReported] = useState<string | null>(null);

  return (
    <div className={styles.profile}>
      <header className={styles.bar} data-me={isMe || undefined}>
        {onBack ? <BackButton onClick={onBack} /> : <span className={styles.spacer} />}
        <span className={styles.handle}>@{p.handle}</span>
        {isMe ? (
          <span className={styles.spacer} />
        ) : (
          <MoreButton onClick={() => setMenu((m) => !m)} label={`More options for ${p.name}`} />
        )}
        {menu && (
          <div className={`${styles.menu} glass-float`} role="menu">
            <button type="button" role="menuitem" onClick={() => { setReported('reported'); setMenu(false); }}>
              Report {p.name}
            </button>
            <button type="button" role="menuitem" data-destructive onClick={() => { setReported('blocked'); setMenu(false); }}>
              Block {p.name}
            </button>
          </div>
        )}
      </header>

      <div className={styles.scroll}>
        <div className={styles.avatar} aria-hidden>{p.initials}</div>
        <h1 className={styles.name}>{p.name}</h1>
        <p className={styles.sub}>
          {p.pronouns}, {p.age}
          <span className={styles.verified}>Phone verified</span>
        </p>

        <hr className={styles.rule} />

        <ul className={styles.facts}>
          <li><img src={location} width={19} height={19} alt="" />Lives in {p.home}</li>
          <li><img src={briefcase} width={20.5} height={18.5} alt="" />{p.occupation}</li>
          <li><img src={calendar} width={21} height={19.5} alt="" />{p.joined}</li>
        </ul>

        {!isMe && (
          <div className={styles.actions}>
            <button type="button" className={styles.add} data-on={friend || undefined} aria-pressed={friend} onClick={() => setFriend((f) => !f)}>
              {friend ? 'Friends ✓' : 'Add Friend'}
            </button>
            <button type="button" className={`${styles.chat} glass`} onClick={onChat}>
              Chat
            </button>
          </div>
        )}

        {reported && (
          <p className={styles.notice} role="status">
            {reported === 'blocked'
              ? `${p.name} is blocked. They can’t see your matches or message you.`
              : `Thanks — our team will review ${p.name}’s profile within 24 hours.`}
          </p>
        )}

        <div className={styles.stats}>
          <div>
            <strong>{p.played}</strong>
            <span>Matches played</span>
          </div>
          <div>
            <strong>{Math.round(p.showUp * 100)}%</strong>
            <span>Show-up rate</span>
          </div>
        </div>

        <section className={styles.about}>
          <h2>About Me</h2>
          <p>{p.bio}</p>
        </section>

        <div className={styles.sports}>
          {p.sports.map((s) => (
            <div key={s.sport} className={styles.sport}>
              <span className={styles.sportGlyph}><SportGlyph sport={s.sport} scale={0.5} /></span>
              <span className={styles.sportName}>{sportLabel[s.sport]}</span>
              <span className={styles.sportSkill}>{s.skill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

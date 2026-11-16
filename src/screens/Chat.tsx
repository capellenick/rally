import { useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import chevron from '../assets/figma/chevron-small.svg';
import plus from '../assets/figma/button-plus.svg';
import send from '../assets/figma/icon-send-arrow.svg';
import ring from '../assets/figma/confirmed-check-ring.svg';
import check from '../assets/figma/confirmed-check.svg';
import { BackButton } from '../components/Pushed';
import type { Person, Thread } from '../data/social';
import { chatStamp } from '../lib/time';
import styles from './Chat.module.css';

const quickReplies = ['On my way 🎾', 'Running 5 min late', 'Here — court 3', 'Rain check?'];

interface Props {
  thread: Thread;
  person: Person;
  typing: boolean;
  onBack: () => void;
  onSend: (text: string) => void;
  onOpenProfile: () => void;
}

/** Conversation — Figma "Community (new message)" 320:2772. In-app only: no numbers exchanged. */
export function Chat({ thread, person, typing, onBack, onSend, onOpenProfile }: Props) {
  const [draft, setDraft] = useState('');
  const [tray, setTray] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Stay pinned to the newest message, like Messages.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread.messages.length, typing]);

  const submit = (text: string) => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setDraft('');
    setTray(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(draft);
  };

  // Show a timestamp above the first message and after any 30+ minute gap.
  const stamps = new Set<number>();
  thread.messages.forEach((m, i) => {
    if (i === 0 || m.at - thread.messages[i - 1].at > 30 * 60_000) stamps.add(i);
  });

  return (
    <div className={styles.chat}>
      <header className={styles.bar}>
        <BackButton onClick={onBack} label="Back to Messages" />
        <button type="button" className={styles.title} onClick={onOpenProfile} aria-label={`View ${person.name}’s profile`}>
          <span className={styles.titleAvatar} aria-hidden>{person.initials}</span>
          <span className={styles.titleName}>
            {person.name}
            <img src={chevron} width={15.5052} height={10.1771} alt="" />
          </span>
        </button>
        <span className={styles.barSpacer} />
      </header>

      <div ref={scrollRef} className={styles.scroll} role="log" aria-live="polite" aria-label={`Conversation with ${person.name}`}>
        {thread.messages.map((m, i) => (
          <div key={m.id} className={styles.item}>
            {stamps.has(i) && <p className={styles.stamp}>{chatStamp(m.at)}</p>}
            {m.from === 'system' ? (
              <p className={`${styles.system} glass`}>
                <span className={styles.check} aria-hidden>
                  <img src={ring} width={29} height={29} alt="" />
                  <img src={check} width={18.4038} height={13.1162} alt="" />
                </span>
                {m.text}
              </p>
            ) : (
              <p
                className={styles.bubble}
                data-from={m.from}
                data-tail={thread.messages[i + 1]?.from !== m.from || undefined}
              >
                {m.text}
              </p>
            )}
          </div>
        ))}
        {typing && (
          <div className={styles.item}>
            <p className={`${styles.bubble} ${styles.typing}`} data-from="them" data-tail aria-label={`${person.name} is typing`}>
              <i /><i /><i />
            </p>
          </div>
        )}
      </div>

      <div className={styles.tray} data-open={tray || undefined} aria-hidden={!tray}>
        {quickReplies.map((r) => (
          <button key={r} type="button" className={`${styles.quick} glass`} tabIndex={tray ? 0 : -1} onClick={() => submit(r)}>
            {r}
          </button>
        ))}
      </div>

      <form className={styles.composer} onSubmit={onSubmit}>
        <button
          type="button"
          className={`${styles.plus} glass`}
          aria-expanded={tray}
          aria-label={tray ? 'Hide quick replies' : 'Show quick replies'}
          onClick={() => setTray((t) => !t)}
        >
          <img src={plus} width={20} height={21} alt="" />
        </button>
        <label className={`${styles.field} glass`}>
          <span className="visually-hidden">Message {person.name}</span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message"
            enterKeyHint="send"
            autoComplete="off"
          />
          <button type="submit" className={styles.send} disabled={!draft.trim()} aria-label="Send">
            <img src={send} width={15.5} height={17.5} alt="" />
          </button>
        </label>
      </form>
    </div>
  );
}

import { useMemo, useState } from 'react';
import chevron from '../assets/figma/chevron-small.svg';
import { Screen } from '../components/Screen';
import { SearchField } from '../components/SearchField';
import { people, type Thread } from '../data/social';
import { relativeStamp } from '../lib/time';
import styles from './Messages.module.css';

interface Props {
  threads: Thread[];
  onOpen: (threadId: string) => void;
}

/** Inbox — Figma "Community (messages)" 230:1329. */
export function Messages({ threads, onOpen }: Props) {
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return threads
      .filter((t) => t.messages.length > 0)
      .sort((a, b) => last(b).at - last(a).at)
      .filter((t) => {
        if (!q) return true;
        const p = people[t.personId];
        return p.name.toLowerCase().includes(q) || t.messages.some((m) => m.text.toLowerCase().includes(q));
      });
  }, [threads, query]);

  return (
    <Screen inlineTitle="Messages">
      <div className={styles.search}>
        <SearchField value={query} onChange={setQuery} label="Search messages" placeholder="Search" />
      </div>

      <ul className={styles.list}>
        {rows.map((t) => {
          const p = people[t.personId];
          const m = last(t);
          return (
            <li key={t.id}>
              <button
                type="button"
                className={styles.row}
                data-unread={t.unread || undefined}
                onClick={() => onOpen(t.id)}
                aria-label={`${p.name}${t.unread ? ', unread' : ''}: ${m.text}`}
              >
                <span className={styles.unreadDot} aria-hidden />
                <span className={styles.avatar} aria-hidden>{p.initials}</span>
                <span className={styles.text}>
                  <span className={styles.name}>{p.name}</span>
                  <span className={styles.preview}>
                    {m.from === 'me' ? 'You: ' : ''}
                    {m.text}
                  </span>
                </span>
                <span className={styles.meta} aria-hidden>
                  {relativeStamp(m.at)}
                  <img src={chevron} width={15.5052} height={10.1771} alt="" />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {rows.length === 0 && (
        <p className={styles.empty}>
          {query ? 'No messages match that search.' : 'When a host approves your request, your chat with them shows up here.'}
        </p>
      )}
    </Screen>
  );
}

const last = (t: Thread) => t.messages[t.messages.length - 1];

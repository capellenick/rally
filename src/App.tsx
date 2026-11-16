import { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceFrame } from './components/DeviceFrame';
import type { RequestState } from './components/MatchCard';
import { Pushed } from './components/Pushed';
import { TabBar, type TabId } from './components/TabBar';
import { matches, sportLabel, type Match } from './data/matches';
import {
  me,
  people,
  replies,
  seedActivity,
  seedThreads,
  type ActivityItem,
  type ActivityStatus,
  type Thread,
} from './data/social';
import { Activity } from './screens/Activity';
import { Chat } from './screens/Chat';
import { Confirmed } from './screens/Confirmed';
import { Feed } from './screens/Feed';
import { Messages } from './screens/Messages';
import { Profile } from './screens/Profile';
import { haptic } from './lib/haptics';

// Prototype stand-ins for the other person acting on their end.
const HOST_APPROVAL_MS = 1600;
const REPLY_MS = 1800;

type Route = { kind: 'chat'; threadId: string } | { kind: 'profile'; personId: string };

let seq = 0;
const uid = () => `x${Date.now().toString(36)}${seq++}`;

export default function App() {
  const [tab, setTab] = useState<TabId>('explore');
  const [stack, setStack] = useState<Route[]>([]);
  const [requests, setRequests] = useState<Record<string, RequestState>>({});
  const [threads, setThreads] = useState<Thread[]>(seedThreads);
  const [activity, setActivity] = useState<ActivityItem[]>(seedActivity);
  const [typing, setTyping] = useState<Record<string, boolean>>({});
  const [confirmed, setConfirmed] = useState<Match | null>(() => {
    // ?screen=confirmed jumps straight to the celebration (handy for demos/screenshots)
    const q = new URLSearchParams(location.search);
    return q.get('screen') === 'confirmed' ? matches[0] : null;
  });
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const threadFor = (personId: string) => `t-${personId}`;

  const appendMessage = useCallback((threadId: string, personId: string, from: 'me' | 'them' | 'system', text: string) => {
    setThreads((ts) => {
      const msg = { id: uid(), from, text, at: Date.now() };
      const existing = ts.find((t) => t.id === threadId);
      if (!existing) return [...ts, { id: threadId, personId, unread: from !== 'me', messages: [msg] }];
      return ts.map((t) =>
        t.id === threadId ? { ...t, messages: [...t.messages, msg], unread: from === 'them' ? true : t.unread } : t,
      );
    });
  }, []);

  // Request → host approves → celebration, plus the chat and the Activity entry it unlocks.
  const request = useCallback(
    (m: Match) => {
      setRequests((r) => ({ ...r, [m.id]: 'pending' }));
      later(() => {
        const host = m.host.initials;
        setRequests((r) => ({ ...r, [m.id]: 'confirmed' }));
        setActivity((a) =>
          a.some((x) => x.match.id === m.id) ? a : [...a, { id: `a-${m.id}`, match: m, personId: host, status: 'upcoming' }],
        );
        appendMessage(threadFor(host), host, 'system', `${m.host.name} approved your request · ${sportLabel[m.sport]} ${m.format}`);
        later(() => appendMessage(threadFor(host), host, 'them', `Hey! Glad you’re in — see you at ${m.court.split(' ')[0]} 👋`), 400);
        setConfirmed(m);
      }, HOST_APPROVAL_MS);
    },
    [appendMessage],
  );

  const push = (r: Route) => setStack((s) => [...s, r]);
  const pop = useCallback(() => setStack((s) => s.slice(0, -1)), []);

  const openThread = (threadId: string) => {
    setThreads((ts) => ts.map((t) => (t.id === threadId ? { ...t, unread: false } : t)));
    push({ kind: 'chat', threadId });
  };

  const messagePerson = (personId: string) => {
    const id = threadFor(personId);
    if (!threads.some((t) => t.id === id)) setThreads((ts) => [...ts, { id, personId, unread: false, messages: [] }]);
    setTab('messages');
    setStack([{ kind: 'chat', threadId: id }]);
  };

  const send = (thread: Thread, text: string) => {
    appendMessage(thread.id, thread.personId, 'me', text);
    later(() => setTyping((t) => ({ ...t, [thread.id]: true })), 600);
    later(() => {
      setTyping((t) => ({ ...t, [thread.id]: false }));
      appendMessage(thread.id, thread.personId, 'them', replies[thread.messages.length % replies.length]);
      // they replied while you're looking at it
      setThreads((ts) => ts.map((t) => (t.id === thread.id ? { ...t, unread: false } : t)));
    }, 600 + REPLY_MS);
  };

  const setStatus = (id: string, status: ActivityStatus) => {
    haptic(10);
    setActivity((a) => a.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const changeTab = (t: TabId) => {
    setStack([]);
    setTab(t);
  };

  const dismissConfirmed = useCallback(() => setConfirmed(null), []);

  const unread = threads.filter((t) => t.unread).length;
  const toConfirm = activity.filter((a) => a.status === 'confirm').length;

  return (
    <DeviceFrame>
      {tab === 'explore' && <Feed requests={requests} onRequest={request} />}
      {tab === 'messages' && <Messages threads={threads} onOpen={openThread} />}
      {tab === 'activity' && <Activity items={activity} onMessage={messagePerson} onSetStatus={setStatus} />}
      {tab === 'profile' && <Profile person={me} isMe />}

      {stack.map((r, i) => (
        <Pushed key={`${r.kind}-${i}`} onPop={pop}>
          {(back) => {
            if (r.kind === 'chat') {
              const thread = threads.find((t) => t.id === r.threadId)!;
              const person = people[thread.personId];
              return (
                <Chat
                  thread={thread}
                  person={person}
                  typing={!!typing[thread.id]}
                  onBack={back}
                  onSend={(text) => send(thread, text)}
                  onOpenProfile={() => push({ kind: 'profile', personId: person.id })}
                />
              );
            }
            const person = people[r.personId];
            return (
              <Profile
                person={person}
                onBack={back}
                onChat={() => {
                  const id = threadFor(person.id);
                  // came from this chat → just go back to it
                  if (stack[i - 1]?.kind === 'chat' && (stack[i - 1] as { threadId: string }).threadId === id) back();
                  else messagePerson(person.id);
                }}
              />
            );
          }}
        </Pushed>
      ))}

      {stack.length === 0 && (
        <TabBar active={tab} onChange={changeTab} badges={{ messages: unread, activity: toConfirm }} />
      )}
      {confirmed && (
        <Confirmed
          match={confirmed}
          onDone={dismissConfirmed}
          onMessage={() => {
            setConfirmed(null);
            messagePerson(confirmed.host.initials);
          }}
        />
      )}
    </DeviceFrame>
  );
}

import { useMemo, useState } from 'react';
import filterIcon from '../assets/figma/icon-filter.svg';
import chevronDown from '../assets/figma/chevron-down.svg';
import chevronRight from '../assets/figma/chevron-right.svg';
import { Chip, type Facet } from '../components/Chip';
import { MatchCard, type RequestState } from '../components/MatchCard';
import { Screen } from '../components/Screen';
import { SearchField } from '../components/SearchField';
import { dayLabel, matches, shortDate, type Match, type Skill, type Sport } from '../data/matches';
import styles from './Feed.module.css';
import { haptic } from '../lib/haptics';

type Sort = 'soonest' | 'nearest';
type DayFilter = 'today' | 'tomorrow' | 'week';

const facetChips: { facet: Facet; key: string; label: string }[] = [
  { facet: 'sport', key: 'tennis', label: 'Tennis' },
  { facet: 'sport', key: 'pickleball', label: 'Pickleball' },
  { facet: 'skill', key: 'Beginner', label: 'Beginner' },
  { facet: 'skill', key: 'Intermediate', label: 'Intermediate' },
  { facet: 'skill', key: 'Advanced', label: 'Advanced' },
  { facet: 'day', key: 'today', label: 'Today' },
  { facet: 'day', key: 'tomorrow', label: 'Tomorrow' },
  { facet: 'day', key: 'week', label: 'This Week' },
];

interface Props {
  requests: Record<string, RequestState>;
  onRequest: (m: Match) => void;
}

export function Feed({ requests, onRequest }: Props) {
  const [query, setQuery] = useState('');
  const [sports, setSports] = useState<Set<Sport>>(new Set());
  const [skills, setSkills] = useState<Set<Skill>>(new Set());
  const [day, setDay] = useState<DayFilter | null>(null);
  const [sort, setSort] = useState<Sort>('soonest');
  const [showFilters, setShowFilters] = useState(true);
  const isOn = (facet: Facet, key: string) =>
    facet === 'sport' ? sports.has(key as Sport)
      : facet === 'skill' ? skills.has(key as Skill)
        : day === key;

  const toggle = (facet: Facet, key: string) => {
    haptic(5);
    if (facet === 'day') return setDay((d) => (d === key ? null : (key as DayFilter)));
    const flip = <T,>(s: Set<T>) => {
      const next = new Set(s);
      if (next.has(key as T)) next.delete(key as T);
      else next.add(key as T);
      return next;
    };
    if (facet === 'sport') setSports(flip);
    else setSkills(flip);
  };

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = matches.filter((m) => {
      if (sports.size && !sports.has(m.sport)) return false;
      if (skills.size && !skills.has(m.skill)) return false;
      if (day === 'today' && m.dayOffset !== 0) return false;
      if (day === 'tomorrow' && m.dayOffset !== 1) return false;
      if (day === 'week' && m.dayOffset > 6) return false;
      if (q && ![m.court, m.area, m.host.name, m.sport, m.format].some((s) => s.toLowerCase().includes(q)))
        return false;
      return true;
    });

    if (sort === 'nearest') {
      return [{
        key: 'nearest', title: 'Nearest to you', sub: 'Within 5 miles',
        items: [...filtered].sort((a, b) => a.miles - b.miles),
      }];
    }
    const byDay = new Map<number, Match[]>();
    for (const m of filtered) byDay.set(m.dayOffset, [...(byDay.get(m.dayOffset) ?? []), m]);
    return [...byDay.entries()]
      .sort(([a], [b]) => a - b)
      .map(([offset, items]) => ({
        key: String(offset), title: dayLabel(offset), sub: shortDate(offset), items,
      }));
  }, [query, sports, skills, day, sort]);

  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const clearAll = () => {
    setQuery('');
    setSports(new Set());
    setSkills(new Set());
    setDay(null);
  };

  const filterButton = (
    <button
      type="button"
      className={styles.filterButton}
      aria-pressed={showFilters}
      aria-controls="filters"
      aria-label={showFilters ? 'Hide filters' : 'Show filters'}
      onClick={() => setShowFilters((s) => !s)}
    >
      <img src={filterIcon} width={45} height={45} alt="" />
    </button>
  );

  return (
    <Screen
      inlineTitle="Open Matches"
      header={
        <SearchField
          value={query}
          onChange={setQuery}
          label="Search matches"
          placeholder="Search courts or players"
          trailing={filterButton}
        />
      }
      title={
        <div className={styles.titleRow}>
          <h1 className={styles.largeTitle}>
            <button type="button" className={styles.city} aria-label="Boone, change city">
              Boone
              <img src={chevronRight} width={17.5298} height={11.6966} alt="" />
            </button>
            <span className={styles.subtitle}>Open Matches</span>
          </h1>
          <button
            type="button"
            className={`${styles.sort} glass`}
            onClick={() => setSort((s) => (s === 'soonest' ? 'nearest' : 'soonest'))}
            aria-label={`Sorted by ${sort}. Change sort`}
          >
            <img src={chevronDown} width={18} height={12.0525} alt="" />
            {sort === 'soonest' ? 'Soonest' : 'Nearest'}
          </button>
        </div>
      }
    >
        <div id="filters" className={styles.filters} data-open={showFilters || undefined}>
          <div className={styles.chipRail} role="group" aria-label="Filters">
            {facetChips.map((c, i) => (
              <span key={c.key} className={styles.chipSlot}>
                {i > 0 && facetChips[i - 1].facet !== c.facet && <span className={styles.rule} aria-hidden />}
                <Chip
                  label={c.label}
                  facet={c.facet}
                  selected={isOn(c.facet, c.key)}
                  onToggle={() => toggle(c.facet, c.key)}
                />
              </span>
            ))}
          </div>
        </div>

        <p className={styles.count} aria-live="polite">
          {total} open {total === 1 ? 'match' : 'matches'} near Boone
        </p>

        {sections.map((s) => (
          <section key={s.key} className={styles.section} aria-labelledby={`h-${s.key}`}>
            <h2 id={`h-${s.key}`} className={styles.sectionTitle}>
              {s.title}
              <span>{s.sub}</span>
            </h2>
            <div className={styles.stack}>
              {s.items.map((m) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  state={requests[m.id]}
                  dateLabel={sort === 'nearest' ? shortDate(m.dayOffset) : undefined}
                  onRequest={() => onRequest(m)}
                />
              ))}
            </div>
          </section>
        ))}

        {total === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Nothing fits those filters yet</p>
            <p className={styles.emptyBody}>
              Widen the search, or post a match and let players come to you.
            </p>
            <button type="button" className={`${styles.emptyAction} glass`} onClick={clearAll}>
              Clear Filters
            </button>
          </div>
        )}
    </Screen>
  );
}

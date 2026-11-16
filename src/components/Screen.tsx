import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './Screen.module.css';

interface Props {
  /** Shown in the glass bar once the large title scrolls away */
  inlineTitle: string;
  /** Anything that sits above the large title (Feed's search field) */
  header?: ReactNode;
  /** The large title block; defaults to an <h1> of inlineTitle */
  title?: ReactNode;
  children: ReactNode;
}

/**
 * A tab's root screen: large title that collapses into an inline glass
 * navigation bar on scroll, the way UIKit navigation bars behave.
 */
export function Screen({ inlineTitle, header, title, children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCollapsed(!e.isIntersecting), {
      root: scrollRef.current,
      rootMargin: '-60px 0px 0px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.screen}>
      <header className={styles.navbar} data-collapsed={collapsed || undefined}>
        <span className={styles.inlineTitle} aria-hidden={!collapsed}>{inlineTitle}</span>
      </header>
      <div ref={scrollRef} className={styles.scroll}>
        {header}
        <div ref={titleRef}>
          {title ?? <h1 className={styles.largeTitle}>{inlineTitle}</h1>}
        </div>
        {children}
      </div>
    </div>
  );
}

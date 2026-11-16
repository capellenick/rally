import { useLayoutEffect, useRef, type ReactNode } from 'react';
import cellular from '../assets/figma/status-cellular.svg';
import wifi from '../assets/figma/status-wifi.svg';
import battery from '../assets/figma/status-battery.svg';
import styles from './DeviceFrame.module.css';

// iPhone 17 Pro: 402 × 874pt display (same as the Figma frames), plus bezel + band.
const DEVICE_W = 402 + 2 * 12;
const DEVICE_H = 874 + 2 * 12;
const MARGIN = 40;

/**
 * On a phone the app runs full-bleed and the real status bar/home indicator
 * apply. On a wider screen it's presented inside an iPhone 17 Pro at true
 * proportions, scaled as one piece to fit the window — never squashed.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  const deskRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const fit = () => {
      const s = Math.min(
        1,
        (window.innerWidth - MARGIN * 2) / DEVICE_W,
        (window.innerHeight - MARGIN * 2) / DEVICE_H,
      );
      deskRef.current?.style.setProperty('--scale', String(Math.max(s, 0.4)));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div ref={deskRef} className={styles.desk}>
      <div className={styles.scaler}>
        <div className={styles.device}>
          <span className={styles.action} aria-hidden />
          <span className={styles.volUp} aria-hidden />
          <span className={styles.volDown} aria-hidden />
          <span className={styles.side} aria-hidden />
          <span className={styles.camera} aria-hidden />
          <div className={styles.screen}>
            <div className={styles.status} aria-hidden>
              <span className={styles.time}>9:41</span>
              <span className={styles.levels}>
                <img src={cellular} width={19.2} height={12.226} alt="" />
                <img src={wifi} width={17.142} height={12.328} alt="" />
                <img src={battery} width={27.328} height={13} alt="" />
              </span>
            </div>
            <span className={styles.island} aria-hidden />
            {children}
            <span className={styles.home} aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}

import tennis from '../assets/figma/sport-tennis.svg';
import pickleball from '../assets/figma/sport-pickleball.svg';
import type { Sport } from '../data/matches';

// Pictograms exactly as drawn in Figma (Group 54 / Group 56), at their native size.
const glyphs: Record<Sport, { src: string; width: number; height: number }> = {
  tennis: { src: tennis, width: 37.2498, height: 69.6156 },
  pickleball: { src: pickleball, width: 56.7279, height: 48.0481 },
};

export function SportGlyph({ sport, scale = 1 }: { sport: Sport; scale?: number }) {
  const g = glyphs[sport];
  return (
    <img
      src={g.src}
      width={g.width}
      height={g.height}
      alt=""
      aria-hidden
      style={scale === 1 ? undefined : { width: g.width * scale, height: g.height * scale }}
    />
  );
}

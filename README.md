# Rally.

Find tennis and pickleball partners at your level, near you.

Rally is a PWA for one loop: **a host posts a match → players request to join →
the host approves → they chat → they play → they confirm it happened.** Success
is two people actually playing, not a signup or a message. v1 is tennis and pickleball
only, tested in Raleigh, NC over the summer before a campus launch.

## Run it

```bash
export PATH=~/.local/node/bin:$PATH   # Node 22 LTS lives here on this machine
npm install
npm run dev                            # http://localhost:5173
```

- `?screen=confirmed` jumps straight to the match-confirmed celebration.
- On a desktop browser the app is presented in a 402 × 874 device frame, the
  same size as the Figma frames. On a phone it runs full-bleed and respects the
  real safe areas. Add it to the Home Screen to run it standalone.

## What's built

| Screen | Register | Notes |
|---|---|---|
| **Feed** (Explore) | Refined | Search, collapsing large title, facet chips, matches grouped by day, Soonest/Nearest sort, request → sent → confirmed |
| **Match confirmed** | Playful | Full-screen cover, the wordmark's ball drops in and bounces (tap it to hop again), summary card. **Message** opens the new chat, **Add to Calendar** hands an `.ics` to the OS |
| **Messages** | Refined | Inbox with unread dots and search; the tab bar shows an unread badge |
| **Chat** | Refined | In-app only (no numbers exchanged): system "approved" event, bubbles, typing indicator, "+" for quick replies ("On my way", "Running 5 min late"…). Tap the name for their profile |
| **Activity** | Refined | Upcoming / Recent with a measured underline. Details expands the venue plus Message and Add to Calendar. Past matches ask "Did you play?", which closes the loop |
| **Profile** | Trust | Phone verified, matches played, show-up rate, About Me, sports with skill. Others' profiles add Add Friend, Chat, and Report/Block in the ••• menu |

Still to build from the seven-screen plan: onboarding, match detail, post a
match, and the host's side of requests.

## Design system

### Source of truth: Figma

Everything visual is taken from the Rally Figma file
([Onboarding](https://www.figma.com/design/5zvoEd6peSXvS7jA2Ubxc3/Onboarding)).
The file has no published variables, so each token in
[`src/styles/tokens.css`](src/styles/tokens.css) records the layer it was
sampled from. Icons and sport pictograms are the original Figma SVGs, kept
unmodified in [`src/assets/figma/`](src/assets/figma).

| Token | Value | Figma origin |
|---|---|---|
| Canvas | `#1A1A1A` | every frame background |
| Card | `#2A2A2A` · 20pt radius | event card |
| Fill | `#424242` | chips, sort pill, filter button |
| Secondary label | `#A8A8A8` | dates, venues, "Open Events" |
| Action green | `#32A45E` | Join, Confirmed |
| Message blue | `#409CFF` | sent bubble, send button |
| Rally lime | `#C3EE25` | the ball in the wordmark |
| Facet colours | sport `#3577E1` · skill `#F19B19` · day `#7246AB` | selected chips, Components frame |

### Contrast audit (WCAG 2.1 AA, 4.5:1 for text)

Several Figma fills failed AA under white text. Each hue keeps its original
value for icons, rings and coloured text on dark, and gets a deepened `-fill`
for anything that carries text. All ratios come from the WCAG 2.1
relative-luminance formula, the same one Adobe's
[contrast checker](https://color.adobe.com/create/color-contrast-analyzer)
uses, so any pair can be re-checked there.

| Pair | Figma | Ratio | Shipped | Ratio |
|---|---|---|---|---|
| White on action green | `#32A45E` | 3.18 ✗ | `#1E8449` | 4.72 ✓ |
| White on message blue | `#409CFF` | 2.83 ✗ | `#0071E3` (Apple's action blue) | 4.70 ✓ |
| White on sport chip | `#3577E1` | 4.31 ✗ | `#2F6FD6` | 4.81 ✓ |
| White on skill orange | `#F19B19` | 2.22 ✗ | ink `#1A1A1A` text on orange | 7.83 ✓ |
| White on day purple | `#7246AB` | 6.60 ✓ | unchanged | 6.60 ✓ |
| Secondary `#A8A8A8` on canvas / card | — | 7.32 / 6.04 ✓ | unchanged | |
| Orange skill text on card | — | 6.45 ✓ | unchanged | |
| Chip "+" glyph `#656565` on pill | — | 1.72 ✗ | lifted to ~`#A8A8A8` | ✓ |
| Facet divider | `rgba(84,84,88,.6)` | faint | `#8E8E93` (systemGray) | 5.34 |
| Tab badge, white on red | — | — | `#D6281F` | 5.02 ✓ |

### iOS conventions applied on top

The Figma frames were hand-positioned. The build keeps their look and rebuilds
the structure to Apple's Human Interface Guidelines:

- **Type** uses SF Pro on Apple's text-style scale. Figma's card titles (20
  Semibold) and metadata (15 Regular) already matched Title 3 and Subheadline.
  The two-tone "City › / Open Matches" heading is set at Large Title size (34
  Bold).
- **Navigation:** the large title collapses into an inline bar with a blurred
  material as you scroll.
- **Glass:** controls and navigation float on frosted glass; content cards
  stay opaque. The recipe follows apple.com/os/ios: a 10% white fill, a
  hairline rim of `rgba(217,207,207,.25)` with a lit top edge, a soft sheen,
  and `blur(24px) saturate(190%)`. Floating bars (tab bar, search) use the
  darker `rgba(42,42,45,.55)` material with a lift shadow. See `.glass` and
  `.glass-float` in [`base.css`](src/styles/base.css).
- **Tab bar:** a floating glass bar (Figma's translucent pill), with the
  selected-tab capsule as a brighter lens, Title Case labels and count badges.
- **Hit targets** are at least 44pt. The Join button keeps its green and 20pt
  corner, and the sort pill extends its hit area beyond its visual edge.
- **Feedback:** controls scale on press, chips spin + → × as they toggle, the
  full-screen cover slides up like `fullScreenCover`, and supported devices
  give haptic feedback.
- **Accessibility:** real buttons with `aria-pressed` and `aria-current`, live
  result counts, the dialog moves focus and closes on Escape, and all motion
  is disabled under Reduce Motion.

### Where play goes

Play goes where it builds delight; restraint goes where it builds trust. Lime
is the only loud colour, and the ball is the only playful motif: it drops,
squashes and ripples when a match is confirmed, and hops when tapped. Profiles,
venues and match details stay quiet.

## Stack

Vite + React 19 + TypeScript, CSS Modules, `vite-plugin-pwa`. No UI library.
The design tokens are plain CSS custom properties.

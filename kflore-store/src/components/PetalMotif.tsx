import { useMemo } from "react";
import type { PetalVariant } from "@/types";

interface PetalMotifProps {
  palette: [string, string, string];
  variant: PetalVariant;
  className?: string;
}

interface Petal {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotate: number;
  color: 0 | 1 | 2;
  opacity: number;
}

// Deterministic layout generators per variant — each returns petal ellipses
// on a 0-200 x 0-200 viewbox. Kept procedural so every product gets a
// related-but-distinct botanical mark instead of a repeated stock icon.
function layoutFor(variant: PetalVariant): Petal[] {
  const petals: Petal[] = [];

  const radial = (count: number, cx: number, cy: number, spread: number, baseR: number) => {
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2;
      const wobble = Math.sin(i * 2.3) * 0.15;
      const r = spread * (0.55 + 0.45 * Math.cos(i * 1.7));
      petals.push({
        cx: cx + Math.cos(angle) * r,
        cy: cy + Math.sin(angle) * r * 0.72,
        rx: baseR * (0.8 + wobble),
        ry: baseR * (1.25 + wobble),
        rotate: (angle * 180) / Math.PI,
        color: (i % 3) as 0 | 1 | 2,
        opacity: 0.88 - (i % 3) * 0.08,
      });
    }
    return petals;
  };

  switch (variant) {
    case 0: {
      // radial cluster — hand-tied bouquet
      radial(9, 100, 118, 34, 26);
      petals.push({ cx: 100, cy: 108, rx: 20, ry: 24, rotate: 0, color: 1, opacity: 0.95 });
      break;
    }
    case 1: {
      // loose airy scatter
      const pts: [number, number, number][] = [
        [70, 100, 22], [112, 88, 26], [96, 120, 20], [130, 112, 18], [60, 130, 16], [110, 60, 15],
      ];
      pts.forEach(([cx, cy, r], i) =>
        petals.push({ cx, cy, rx: r, ry: r * 1.3, rotate: i * 37, color: (i % 3) as 0 | 1 | 2, opacity: 0.85 })
      );
      break;
    }
    case 2: {
      // undone asymmetric drape
      const pts: [number, number, number][] = [
        [80, 70, 24], [110, 90, 22], [70, 110, 20], [130, 70, 18], [95, 130, 22], [140, 110, 16],
      ];
      pts.forEach(([cx, cy, r], i) =>
        petals.push({ cx, cy, rx: r, ry: r * 1.2, rotate: i * -25, color: (i % 3) as 0 | 1 | 2, opacity: 0.82 })
      );
      break;
    }
    case 3: {
      // domed box arrangement
      radial(11, 100, 100, 40, 22);
      petals.push({ cx: 100, cy: 96, rx: 18, ry: 20, rotate: 0, color: 1, opacity: 0.95 });
      break;
    }
    case 4: {
      // wide low centerpiece
      const pts: [number, number, number][] = [
        [55, 105, 20], [85, 95, 24], [115, 95, 24], [145, 105, 20], [70, 120, 18], [130, 120, 18], [100, 88, 22],
      ];
      pts.forEach(([cx, cy, r], i) =>
        petals.push({ cx, cy, rx: r, ry: r * 1.15, rotate: i * 19, color: (i % 3) as 0 | 1 | 2, opacity: 0.85 })
      );
      break;
    }
    case 5:
    default: {
      // ring / wreath / garland
      const count = 12;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const cx = 100 + Math.cos(angle) * 52;
        const cy = 100 + Math.sin(angle) * 52;
        petals.push({
          cx,
          cy,
          rx: 16,
          ry: 20,
          rotate: (angle * 180) / Math.PI + 90,
          color: (i % 3) as 0 | 1 | 2,
          opacity: 0.85,
        });
      }
      break;
    }
  }
  return petals;
}

// Lighten a hex color toward white by `amount` (0-1) — used to build each
// petal's highlight-to-base radial gradient without a color library.
function lighten(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function darken(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => Math.round(c * (1 - amount));
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

export function PetalMotif({ palette, variant, className }: PetalMotifProps) {
  const petals = useMemo(() => layoutFor(variant), [variant]);
  const uid = useMemo(() => `pm-${Math.random().toString(36).slice(2, 9)}`, []);

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-wash`} cx="50%" cy="38%" r="75%">
          <stop offset="0%" stopColor={lighten(palette[0], 0.42)} stopOpacity="0.5" />
          <stop offset="100%" stopColor={palette[0]} stopOpacity="0.06" />
        </radialGradient>
        <linearGradient id={`${uid}-stem`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={darken(palette[1], 0.1)} stopOpacity="0.55" />
          <stop offset="100%" stopColor={darken(palette[1], 0.1)} stopOpacity="0" />
        </linearGradient>
        {([0, 1, 2] as const).map((ci) => (
          <radialGradient key={ci} id={`${uid}-petal-${ci}`} cx="38%" cy="30%" r="75%">
            <stop offset="0%" stopColor={lighten(palette[ci], 0.55)} />
            <stop offset="55%" stopColor={palette[ci]} />
            <stop offset="100%" stopColor={darken(palette[ci], 0.22)} />
          </radialGradient>
        ))}
      </defs>
      <rect x="0" y="0" width="200" height="200" fill={`url(#${uid}-wash)`} />
      <path
        d="M100 150 C 96 165, 92 178, 88 192"
        stroke={`url(#${uid}-stem)`}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {petals.map((p, i) => (
        <ellipse
          key={i}
          cx={p.cx}
          cy={p.cy}
          rx={p.rx * 1.18}
          ry={p.ry * 1.18}
          fill={`url(#${uid}-petal-${p.color})`}
          stroke={darken(palette[p.color], 0.35)}
          strokeOpacity={0.18}
          strokeWidth={0.75}
          opacity={Math.min(1, p.opacity + 0.12)}
          transform={`rotate(${p.rotate} ${p.cx} ${p.cy})`}
        />
      ))}
    </svg>
  );
}

"use client";

import { useRef, useState } from "react";

interface Slice {
  label: string;
  href: string;
  description: string;
  color: string;
  startAngle: number;
}

const SLICE_DEG = 60;

const slices: Slice[] = [
  {
    label: "Måndagsklubben",
    href: "#",
    description: "Placeholder description for section one. Replace this with a sentence or two about what this link leads to.",
    color: "#003940",
    startAngle: 120,
  },
  {
    label: "Syntax Error",
    href: "#",
    description: "Placeholder description for section two. Replace this with a sentence or two about what this link leads to.",
    color: "#40002A",
    startAngle: 60,
  },
  {
    label: "SEC-T",
    href: "#",
    description: "Placeholder description for section three. Replace this with a sentence or two about what this link leads to.",
    color: "#230040",
    startAngle: 0,
  },
  {
    label: "Edison",
    href: "#",
    description: "Placeholder description for section four. Replace this with a sentence or two about what this link leads to.",
    color: "#400F00",
    startAngle: 180,
  },
  {
    label: "LinkedIn",
    href: "#",
    description: "Placeholder description for section five. Replace this with a sentence or two about what this link leads to.",
    color: "#0A1E40",
    startAngle: 240,
  },
  {
    label: "FlowersFX",
    href: "#",
    description: "Placeholder description for section six. Replace this with a sentence or two about what this link leads to.",
    color: "#003A1E",
    startAngle: 300,
  },
];

/** Parse a #rrggbb hex color into an rgba() string */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Point on a circle measured clockwise from 12 o'clock, in % units */
function radialPoint(angleDeg: number, r: number, cx = 50, cy = 50): string {
  const rad = (angleDeg * Math.PI) / 180;
  const x = cx + Math.sin(rad) * r;
  const y = cy - Math.cos(rad) * r;
  return `${x.toFixed(3)}% ${y.toFixed(3)}%`;
}

/** Fan of points from startAngle to endAngle at radius r — always covers corners */
function sliceClipPath(startAngle: number, endAngle: number): string {
  const r = 250;
  const pts = ["50% 50%"];
  for (let a = startAngle; a <= endAngle; a += 5) {
    pts.push(radialPoint(a, r));
  }
  const endPt = radialPoint(endAngle, r);
  if (pts[pts.length - 1] !== endPt) pts.push(endPt);
  return `polygon(${pts.join(", ")})`;
}

/**
 * Center of the visible wedge, offset from viewport center.
 * x uses vw and y uses vh so labels scale with their own axis —
 * on portrait phones the vertical labels push toward the top/bottom edge.
 */
function textPos(midAngle: number, distX = 22, distY = 32): React.CSSProperties {
  const rad = (midAngle * Math.PI) / 180;
  return {
    left: `calc(50% + ${(Math.sin(rad) * distX).toFixed(2)}vw)`,
    top:  `calc(50% - ${(Math.cos(rad) * distY).toFixed(2)}vh)`,
  };
}

export default function Home(): React.JSX.Element {
  const [active, setActive]               = useState<number | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  // transform-origin for the expansion wrapper, starts at viewport center
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const lastActive  = useRef<number>(0);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const open = (i: number) => {
    clearTimeout(pendingTimer.current);
    lastActive.current = i;

    // Shift the scale origin to the OPPOSITE side of the clicked section.
    // Scaling from there pushes the clicked section outward — looks like expansion.
    const midAngle = slices[i].startAngle + SLICE_DEG / 2;
    const rad = midAngle * (Math.PI / 180);
    setOrigin({
      x: 50 + Math.sin(rad) * 55,
      y: 50 - Math.cos(rad) * 55,
    });

    setActive(i);

    // Overlay fades in slightly after expansion starts
    pendingTimer.current = setTimeout(() => setOverlayVisible(true), 150);
  };

  const close = () => {
    clearTimeout(pendingTimer.current);
    setOverlayVisible(false);
    setActive(null); // immediate — scale-back starts in sync with overlay fade
  };

  const displayed   = slices[active ?? lastActive.current];
  const isExpanded  = active !== null;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">

      {/* ── Expansion wrapper ───────────────────────────────────────────
          transform-origin snaps to the opposite side of the clicked slice
          (no transition on origin — it must be instant so the scale
          transition reads from the correct anchor point from frame one).
          Scale transitions smoothly: 1 → 1.8 on open, 1.8 → 1 on close. */}
      <div
        className="absolute inset-0"
        style={{
          transformOrigin: `${origin.x.toFixed(2)}% ${origin.y.toFixed(2)}%`,
          transform: isExpanded ? "scale(1.8)" : "scale(1)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* ── Rock wrapper ─────────────────────────────────────────────
            Paused once the overlay becomes visible so the frozen frame
            is hidden behind it. Resumes when the overlay closes. */}
        <div
          className="absolute inset-0 origin-center animate-rock"
          style={overlayVisible ? { animationPlayState: "paused" } : undefined}
        >
          {/* Wedge hit targets */}
          {slices.map((slice, i) => (
            <button
              key={i}
              aria-label={`Open ${slice.label}`}
              className="absolute inset-0 bg-transparent border-0 p-0 cursor-pointer transition-[background-color] duration-300 hover:bg-white/5 focus:outline-none focus-visible:bg-white/10"
              style={{
                clipPath: sliceClipPath(slice.startAngle, slice.startAngle + SLICE_DEG),
                backgroundColor: hexToRgba(slice.color, 0.5),
              }}
              onClick={() => open(i)}
            />
          ))}

          {/* Slice labels */}
          {slices.map((slice, i) => (
            <div
              key={`label-${i}`}
              className="absolute pointer-events-none select-none animate-counter-rock"
              style={textPos(slice.startAngle + SLICE_DEG / 2)}
            >
              <h2
                className="text-sm font-bold text-white text-center leading-tight"
                style={{ maxWidth: "10ch" }}
              >
                {slice.label}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* ── Fullscreen overlay ──────────────────────────────────────────
          Mounted permanently — content is always rendered so it stays
          visible during the 0.4 s fade-out (lastActive ref keeps it). */}
      <div
        className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer"
        style={{
          backgroundColor: displayed.color,
          opacity: overlayVisible ? 1 : 0,
          pointerEvents: overlayVisible ? "auto" : "none",
          transition: "opacity 0.4s ease",
        }}
        onClick={close}
      >
        <div
          className="text-center px-10 max-w-sm cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-3xl font-bold">
            <a
              href={displayed.href}
              className="text-white underline underline-offset-4 focus:outline-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              {displayed.label}
            </a>
          </h2>
          <p className="mt-4 text-white/70 text-sm leading-relaxed">
            {displayed.description}
          </p>
        </div>

        <p className="absolute bottom-8 text-white/30 text-xs tracking-widest uppercase">
          tap anywhere to close
        </p>
      </div>

    </main>
  );
}

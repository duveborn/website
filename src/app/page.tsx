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
    href: "https://mandagsklubben.net",
    description: "I'm a co-founder of this weekly Monday afterwork meetup in Stockholm for geeks and friendly folks. Join us for a beverage and tell us about your day!",
    color: "#000000",
    startAngle: 240,
  },
  {
    label: "Syntax Error",
    href: "https://www.syntax-error.se",
    description: "I'm an organizer, DJ and board member of this video game nightclub in Stockholm with monthly events featuring DJs, live-acts, video games and cosplay. You should definitely check it out!",
    color: "#ffffff",
    startAngle: 60,
  },
  {
    label: "SEC-T",
    href: "https://www.sec-t.org",
    description: "I'm a club manager at this IT security conference in Stockholm where I make sure the official party and pubs are fun. Join our free community day!",
    color: "#000000",
    startAngle: 120,
  },
  {
    label: "Edison",
    href: "https://www.edisonparty.com",
    description: "I'm a main organizer of this demoparty in Stockholm aboard M/S Borgila, bringing together digital artists and coders with a ton of different competitions. Start your prod today!",
    color: "#ffffff",
    startAngle: 180,
  },
  {
    label: "Valtech",
    href: "https://www.valtech.com",
    description: "I'm a senior consultant at Valtech, a global digital agency. I work on a variety of projects with various technologies. Apply today!",
    color: "#000000",
    startAngle: 0,
  },
  {
    label: "FlowersFX",
    href: "https://www.flowersfx.com",
    description: "I'm a founder and developer at this creative collective of digital artists, known for the party game \"Eat my Shuriken and Die!\". Let's build something cool!",
    color: "#ffffff",
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
  const isLight     = displayed.color === "#ffffff";

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
                backgroundColor: hexToRgba(slice.color, 1),
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
                className="sm:text-[1.75rem] font-bold text-center leading-tight whitespace-nowrap"
                style={{ color: slice.color === "#ffffff" ? "#000000" : "#ffffff" }}
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
              className={`inline-flex items-center gap-2 underline underline-offset-4 focus:outline-none ${isLight ? "text-black" : "text-white"}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {displayed.label}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 opacity-70 shrink-0">
                <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm6.75-3a.75.75 0 0 1 .75-.75h5.25a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.06l-6.22 6.22a.75.75 0 1 1-1.06-1.06L15.44 3H11a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
            </a>
          </h2>
          <p className="mt-4 text-xl leading-relaxed" style={{ color: isLight ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)" }}>
            {displayed.description}
          </p>
        </div>

        <p className="absolute bottom-8 text-xs tracking-widest uppercase" style={{ color: isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)" }}>
          tap anywhere to close
        </p>
      </div>

    </main>
  );
}

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
 * Place a label on its wedge's center ray, at radius `r` from the viewport
 * center. Using a single vmin radius (rather than separate vw/vh distances)
 * keeps the true bisector angle, so each label sits centered in its segment
 * regardless of orientation, and the left/right labels clear the avatar.
 */
function textPos(midAngle: number, r = 32): React.CSSProperties {
  const rad = (midAngle * Math.PI) / 180;
  return {
    left: `calc(50% + ${(Math.sin(rad) * r).toFixed(2)}vmin)`,
    top:  `calc(50% - ${(Math.cos(rad) * r).toFixed(2)}vmin)`,
  };
}

export default function Home(): React.JSX.Element {
  const [active, setActive]               = useState<number | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [contactOpen, setContactOpen]     = useState(false);
  const [hovered, setHovered]             = useState<number | null>(null);
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
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
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
                className={`sm:text-[1.75rem] font-bold text-center leading-tight whitespace-nowrap transition-transform duration-300 ease-out ${hovered === i ? "scale-125" : "scale-100"}`}
                style={{ color: slice.color === "#ffffff" ? "#000000" : "#ffffff" }}
              >
                {slice.label}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* ── Center avatar ───────────────────────────────────────────────
          Sits above the intersecting wedges at the pie's center. Lives
          outside the rocking wrapper so it stays perfectly still.
          Clicking zooms into the contact page. */}
      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out hover:scale-110">
        <button
          aria-label="Open contact details"
          onClick={() => setContactOpen(true)}
          className="animate-breathe block h-24 w-24 rounded-full bg-cover bg-center ring-4 ring-white/80 shadow-[0_0_0_2px_rgba(0,0,0,0.6),0_8px_30px_rgba(0,0,0,0.5)] cursor-pointer focus:outline-none focus-visible:ring-white"
          style={{ backgroundImage: "url(/images/me.jpg)" }}
        />
      </div>

      {/* ── Contact page ────────────────────────────────────────────────
          A full-screen layer revealed with a circular clip that expands
          from the center — the avatar appears to zoom open into a page.
          Tap anywhere to close. */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black text-white cursor-pointer"
        style={{
          clipPath: contactOpen ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
          pointerEvents: contactOpen ? "auto" : "none",
          transition: "clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onClick={() => setContactOpen(false)}
      >
        <div
          className="flex flex-col items-center text-center px-10 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="h-32 w-32 rounded-full bg-cover bg-center ring-4 ring-white/80"
            style={{ backgroundImage: "url(/images/me.jpg)" }}
          />
          <h2 className="mt-6 text-4xl font-bold">Oskar Duveborn</h2>
          <p className="mt-2 text-xl text-white/60">Senior consultant · Organizer · Maker · Stockholm</p>

          <div className="mt-8 flex flex-col gap-3 text-lg">
            <a
              href="https://www.linkedin.com/in/duveborn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 underline underline-offset-4 hover:text-white/80 focus:outline-none"
            >
              linkedin.com/in/duveborn
            </a>
            <a
              href="https://www.instagram.com/duveborn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 underline underline-offset-4 hover:text-white/80 focus:outline-none"
            >
              instagram.com/duveborn
            </a>
            <a
              href="https://bsky.app/profile/duveborn.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 underline underline-offset-4 hover:text-white/80 focus:outline-none"
            >
              @duveborn.bsky.social
            </a>
          </div>
        </div>

        <p className="absolute bottom-8 text-xs tracking-widest uppercase text-white/30">
          tap anywhere to close
        </p>
      </div>

      {/* ── Fullscreen overlay ──────────────────────────────────────────
          Mounted permanently — content is always rendered so it stays
          visible during the 0.4 s fade-out (lastActive ref keeps it). */}
      <div
        className="fixed inset-0 z-30 flex flex-col items-center justify-center cursor-pointer"
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
          <h2 className={`text-3xl font-bold ${isLight ? "text-black" : "text-white"}`}>
            {displayed.label}
          </h2>
          <p className="mt-4 text-xl leading-relaxed" style={{ color: isLight ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)" }}>
            {displayed.description}
          </p>
          <a
            href={displayed.href}
            className={`mt-6 inline-flex items-center gap-2 text-sm underline underline-offset-4 focus:outline-none ${isLight ? "text-black" : "text-white"}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {displayed.href.replace(/^https?:\/\//, "")}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 opacity-70 shrink-0">
              <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm6.75-3a.75.75 0 0 1 .75-.75h5.25a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.06l-6.22 6.22a.75.75 0 1 1-1.06-1.06L15.44 3H11a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

        <p className="absolute bottom-8 text-xs tracking-widest uppercase" style={{ color: isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)" }}>
          tap anywhere to close
        </p>
      </div>

    </main>
  );
}

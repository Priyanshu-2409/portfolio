"use client";

import { useEffect, useRef, useState } from "react";

/** Circular lofi toggle. Plays /public/lofi.mp3 on loop (user-supplied,
 *  royalty-free). Renders nothing until the file actually exists, so the
 *  nav never shows a dead button. */
export default function MusicButton() {
  const [avail, setAvail] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/lofi.mp3", { method: "HEAD" })
      .then((r) => {
        if (alive) setAvail(r.ok);
      })
      .catch(() => {});
    return () => {
      alive = false;
      audioRef.current?.pause();
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/lofi.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }
    const a = audioRef.current;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  };

  if (!avail) return null;

  return (
    <button
      className={`music-btn ${playing ? "playing" : ""}`}
      onClick={toggle}
      aria-label={playing ? "Pause lofi music" : "Play lofi music"}
      aria-pressed={playing}
    >
      <svg width="14" height="10" viewBox="0 0 24 12" aria-hidden="true" style={{ overflow: "hidden" }}>
        {playing ? (
          <g className="wave-track">
            <path
              d="M0 6 Q 3 1.5, 6 6 T 12 6 T 18 6 T 24 6 T 30 6 T 36 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : (
          <path d="M4 6h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        )}
      </svg>
    </button>
  );
}
  
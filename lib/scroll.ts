/** Shared scroll progress (0..1) across the hero track.
 *  Hero writes it; the 3D scene reads it inside useFrame.
 *  A plain mutable object avoids React re-renders on every scroll frame. */
export const scrollState = { p: 0 };

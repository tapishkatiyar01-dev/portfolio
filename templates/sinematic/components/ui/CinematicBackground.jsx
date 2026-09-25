'use client';

/** Static cinema void. */
export default function CinematicBackground() {
  return (
    <div className="sinematic-cinematic-bg">
      <div className="sn-void-stage" aria-hidden="true">
        <div className="sn-void-base" />
        <div className="sn-void-screen" />
        <div className="sn-void-floor" />
        <div className="sn-void-columns" />
        <div className="sn-void-ambient" />
        <div className="sn-void-marks" />
      </div>
      <div className="sn-bg-wash" aria-hidden="true" />
      <div className="sn-bg-vignette" aria-hidden="true" />
    </div>
  );
}

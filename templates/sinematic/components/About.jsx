'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { sinematicCardMotion } from './motionConfig';

export default function About({ personal, compact = false }) {
  const reduced = useReducedMotion();
  const image = personal?.Logo || personal?.Avatar;
  const rows = [
    ['Name', personal?.name],
    ['Role', personal?.designation],
    ['Place', personal?.location],
    ['Email', personal?.email],
  ].filter(([, value]) => value);

  return (
    <section className="sinematic-panel sinematic-about">
      <div className="sinematic-panel-number">Subject</div>

      <div className="sinematic-about-grid">
        <motion.div
          className="sinematic-about-image"
          whileHover={reduced || compact ? undefined : { scale: 1.02, rotate: -1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {image ? (
            <img src={image} alt={`${personal?.name || 'Profile'} portrait`} />
          ) : (
            <span>
              {personal?.name?.split(/\s+/).map((part) => part[0]).join('').slice(0, 2)}
            </span>
          )}
        </motion.div>

        <div>
          {personal?.aboutKicker && (
            <p className="sinematic-kicker">{personal.aboutKicker}</p>
          )}

          {personal?.name && (
            <h2>
              {personal.name}
              {personal?.designation && (
                <>
                  <br />
                  <em>{personal.designation}</em>
                </>
              )}
            </h2>
          )}

          {(personal?.description || personal?.summary) && (
            <p className="sinematic-copy">{personal.description || personal.summary}</p>
          )}

          {rows.length > 0 && (
            <dl className="sinematic-record">
              {rows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {personal?.traits?.length > 0 && (
            <div className="sinematic-tags">
              {personal.traits.map((trait) => (
                <motion.span key={trait} {...sinematicCardMotion(reduced)}>
                  {trait}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

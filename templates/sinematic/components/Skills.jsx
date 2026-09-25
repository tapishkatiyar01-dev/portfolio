'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useClientRevealList } from '@/lib/usePaginatedSection';
import { sinematicCardMotion } from './motionConfig';

export default function Skills({ skills = [] }) {
  const reduced = useReducedMotion();
  const {
    visibleItems,
    total,
    allVisible,
    needsToggle,
    nextBatch,
    showMore,
    showLess,
  } = useClientRevealList(skills);

  return (
    <section className="sinematic-panel sinematic-skills">
      <div className="sinematic-panel-number">Props</div>

      <div className="sinematic-skills-head">
        <p className="sinematic-kicker">Skills</p>
        <h2>
          Core <em>instruments</em>
        </h2>
      </div>

      <div className="sinematic-skill-grid">
        {visibleItems.map((skill, index) => (
          <motion.div
            className="sinematic-skill"
            key={skill.name || index}
            {...sinematicCardMotion(reduced)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{skill.name}</strong>
            {skill.level && <small>{skill.level}</small>}
          </motion.div>
        ))}
      </div>

      {needsToggle ? (
        <div className="sinematic-show-more-wrap">
          {allVisible ? (
            <button
              type="button"
              className="sinematic-button sinematic-show-more"
              onClick={showLess}
              aria-expanded="true"
            >
              Show less <span aria-hidden="true">−</span>
            </button>
          ) : (
            <button
              type="button"
              className="sinematic-button sinematic-show-more"
              onClick={showMore}
              aria-expanded="false"
            >
              Show more · {nextBatch} more <span aria-hidden="true">+</span>
            </button>
          )}
          <span className="sinematic-show-more-meta">
            Showing {visibleItems.length} of {total}
          </span>
        </div>
      ) : null}
    </section>
  );
}

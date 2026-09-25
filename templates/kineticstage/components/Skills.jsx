'use client';

import { useRef } from 'react';
import {
  registerStageGsap,
  revealItems,
  useGSAP,
} from './gsapSetup';
import StageMotionItem from './ui/StageMotionItem';

registerStageGsap();

export default function Skills({ skills = [], index = 0 }) {
  const rootRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return undefined;
      const batch = revealItems(grid, '.kineticstage-skill-card', {
        y: 24,
        scale: 0.98,
        stagger: 0.05,
        start: 'top 90%',
        duration: 0.5,
        ease: 'power2.out',
      });
      return () => batch?.kill();
    },
    {
      scope: rootRef,
      dependencies: [skills.map((s) => s.name).join('|')],
      revertOnUpdate: true,
    },
  );

  return (
    <div className="kineticstage-panel" ref={rootRef}>
      <p className="kineticstage-eyebrow" data-reveal>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <i aria-hidden="true" />
        <span>Skills</span>
      </p>
      <h2 data-reveal>Tools in the stack</h2>
      <div className="kineticstage-skill-grid" ref={gridRef} data-ks-items>
        {skills.map((skill, skillIndex) => (
          <StageMotionItem
            key={skill.name || skillIndex}
            className="kineticstage-skill-card"
            lift={-8}
            scale={1.045}
          >
            <span>{String(skillIndex + 1).padStart(2, '0')}</span>
            <strong>{skill.name}</strong>
            {skill.level ? <small>{skill.level}</small> : null}
          </StageMotionItem>
        ))}
      </div>
    </div>
  );
}

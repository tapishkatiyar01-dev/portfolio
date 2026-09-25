'use client';

import { useRef } from 'react';
import {
  getGsap,
  prefersReducedMotion,
  registerKineticGsap,
  revealItems,
  useGSAP,
} from './gsapSetup';
import KineticMotionItem from './ui/KineticMotionItem';

registerKineticGsap();

export default function Skills({ skills = [], index = 0 }) {
  const rootRef = useRef(null);
  const gridRef = useRef(null);
  const headRef = useRef(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const grid = gridRef.current;
      const { gsap } = getGsap();
      if (!root) return undefined;

      const cleanups = [];

      if (gsap && headRef.current && !prefersReducedMotion()) {
        const headTl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 84%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        });
        headTl.from(headRef.current.children, {
          y: 24,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        cleanups.push(() => {
          headTl.scrollTrigger?.kill();
          headTl.kill();
        });
      }

      if (grid) {
        const batch = revealItems(grid, '.kinetic-skill-card', {
          y: 28,
          scale: 0.97,
          stagger: 0.045,
          start: 'top 90%',
          duration: 0.52,
          ease: 'power3.out',
        });
        cleanups.push(() => batch?.kill());
      }

      return () => cleanups.forEach((fn) => fn?.());
    },
    {
      scope: rootRef,
      dependencies: [skills.map((s) => s.name).join('|')],
      revertOnUpdate: true,
    },
  );

  return (
    <div className="kinetic-panel" ref={rootRef}>
      <div ref={headRef}>
        <p className="kinetic-eyebrow">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <i aria-hidden="true" />
          <span>Skills</span>
        </p>
        <h2>Tools in the stack</h2>
      </div>
      <div className="kinetic-skill-grid" ref={gridRef} data-kinetic-items>
        {skills.map((skill, skillIndex) => (
          <KineticMotionItem
            key={skill.name || skillIndex}
            className="kinetic-skill-card"
            lift={-8}
            scale={1.045}
          >
            <span>{String(skillIndex + 1).padStart(2, '0')}</span>
            <strong>{skill.name}</strong>
            {skill.level ? <small>{skill.level}</small> : null}
          </KineticMotionItem>
        ))}
      </div>
    </div>
  );
}

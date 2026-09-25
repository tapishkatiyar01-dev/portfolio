'use client';

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSinematicScene } from '../motionConfig';
import {
  resolveRecipe,
  SCENE_RECIPES,
  SCRUB_SPRING,
} from './sceneRecipes';

function useChannel(progress, recipe, channel, identity) {
  const map = recipe?.[channel];
  return useTransform(
    progress,
    map ? map[0] : [0, 1],
    map ? map[1] : [identity, identity],
  );
}

function useCompactViewport() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)');
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return compact;
}

/** Mobile / compact — opacity only, no spring (keeps scroll smooth). */
function LiteCamera({ trackRef, recipeMap, children }) {
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start end', 'end start'],
  });
  const opacity = useChannel(scrollYProgress, recipeMap, 'opacity', 1);

  return (
    <motion.div className="sn-cinematic-camera" style={{ opacity }}>
      {children}
    </motion.div>
  );
}

/** Desktop — spring-smoothed opacity + x/y travel. */
function RichCamera({ trackRef, recipeMap, children }) {
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start end', 'end start'],
  });
  const scrubProgress = useSpring(scrollYProgress, SCRUB_SPRING.desktop);
  const opacity = useChannel(scrubProgress, recipeMap, 'opacity', 1);
  const y = useChannel(scrubProgress, recipeMap, 'y', 0);
  const x = useChannel(scrubProgress, recipeMap, 'x', 0);

  return (
    <motion.div className="sn-cinematic-camera" style={{ opacity, x, y }}>
      {children}
    </motion.div>
  );
}

/**
 * Scene track with scroll-driven camera (document flow only — no sticky pin).
 */
export default function CinematicScene({
  id,
  index = 0,
  label,
  recipe = 'riseIn',
  anchor = true,
  children,
}) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const reduced = useReducedMotion();
  const compact = useCompactViewport();
  const { registerScene, unregisterScene } = useSinematicScene();

  const recipeName = resolveRecipe(recipe, { compact });
  const recipeMap = SCENE_RECIPES[recipeName] || SCENE_RECIPES.riseIn;

  useLayoutEffect(() => {
    registerScene({
      id,
      index,
      label,
      trackRef,
      stageRef,
    });
    return () => unregisterScene(id);
  }, [id, index, label, registerScene, unregisterScene]);

  const content =
    typeof children === 'function'
      ? children({ progress: null, mode: 'flow', compact })
      : children;

  return (
    <section
      ref={trackRef}
      id={anchor ? id : undefined}
      className={`sn-cinematic-scene sn-mode-flow${reduced ? ' is-reduced' : ''}${compact ? ' is-compact' : ''}`}
      data-scene={id}
      data-index={index}
      data-recipe={recipeName}
      aria-label={label || id}
    >
      <div ref={stageRef} className="sn-cinematic-stage">
        {reduced ? (
          <div className="sn-cinematic-camera">{content}</div>
        ) : compact ? (
          <LiteCamera trackRef={trackRef} recipeMap={recipeMap}>
            {content}
          </LiteCamera>
        ) : (
          <RichCamera trackRef={trackRef} recipeMap={recipeMap}>
            {content}
          </RichCamera>
        )}
      </div>
    </section>
  );
}

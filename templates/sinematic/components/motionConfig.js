'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { setPersistedSectionId, setPersistedTemplate } from '@/lib/portfolioCookies';

export const sinematicEase = [0.16, 1, 0.3, 1];

export const sinematicReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: sinematicEase },
  },
};

export const sinematicStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.12 },
  },
};

export const sinematicStaggerItem = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: sinematicEase },
  },
};

export const sinematicSlideIn = {
  hidden: { opacity: 0, x: -24 },
  visible: (index = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, delay: index * 0.05, ease: sinematicEase },
  }),
};

export const sinematicPanelVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: sinematicEase },
  },
};

const SinematicMotionContext = createContext(null);
const SinematicSceneContext = createContext(null);

export function SinematicMotionProvider({ children }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const smoothX = useSpring(pointerX, { stiffness: 190, damping: 16, mass: 0.28 });
  const smoothY = useSpring(pointerY, { stiffness: 190, damping: 16, mass: 0.28 });
  const rafRef = useRef(0);
  const pendingRef = useRef(null);

  const flushPointer = useCallback(() => {
    rafRef.current = 0;
    if (!pendingRef.current) return;
    const { x, y } = pendingRef.current;
    pendingRef.current = null;
    pointerX.set(x);
    pointerY.set(y);
  }, [pointerX, pointerY]);

  const queuePointer = useCallback(
    (x, y) => {
      if (reduced) return;
      pendingRef.current = { x, y };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(flushPointer);
      }
    },
    [flushPointer, reduced],
  );

  useEffect(() => {
    if (reduced) return undefined;

    const fineMq = window.matchMedia('(pointer: fine)');
    const touchState = { active: false, x: 0, y: 0, interactedAt: 0 };
    let orientEnabled = false;
    let permissionAsked = false;
    const TOUCH_GAIN = 2.6;
    const ORIENT_GAIN = 16;

    const clamp01 = (value) => Math.max(0, Math.min(1, value));

    const toNorm = (clientX, clientY) => ({
      x: clientX / Math.max(window.innerWidth, 1),
      y: clientY / Math.max(window.innerHeight, 1),
    });

    const amplifyTouch = (x, y) => ({
      x: clamp01(0.5 + (x - 0.5) * TOUCH_GAIN),
      y: clamp01(0.5 + (y - 0.5) * TOUCH_GAIN),
    });

    const onFinePointer = (event) => {
      if (event.pointerType === 'touch') return;
      const { x, y } = toNorm(event.clientX, event.clientY);
      queuePointer(x, y);
    };

    const onTouchPointer = (event) => {
      if (event.pointerType !== 'touch' && fineMq.matches) return;

      const raw = toNorm(event.clientX, event.clientY);
      const { x, y } = amplifyTouch(raw.x, raw.y);

      if (event.type === 'pointerdown') {
        touchState.active = true;
        touchState.x = event.clientX;
        touchState.y = event.clientY;
        touchState.interactedAt = performance.now();
        queuePointer(x, y);
        maybeEnableOrientation();
        return;
      }

      if (!touchState.active) return;

      if (event.type === 'pointermove') {
        const dx = Math.abs(event.clientX - touchState.x);
        const dy = Math.abs(event.clientY - touchState.y);
        touchState.x = event.clientX;
        touchState.y = event.clientY;
        if (dy > dx * 2.4 && dy > 22) return;
        touchState.interactedAt = performance.now();
        queuePointer(x, y);
        return;
      }

      if (event.type === 'pointerup' || event.type === 'pointercancel') {
        touchState.active = false;
      }
    };

    const onOrientation = (event) => {
      if (touchState.active) return;
      if (performance.now() - touchState.interactedAt < 600) return;
      const gamma = typeof event.gamma === 'number' ? event.gamma : 0;
      const beta = typeof event.beta === 'number' ? event.beta : 45;
      const x = clamp01(0.5 + Math.max(-1, Math.min(1, gamma / ORIENT_GAIN)) * 0.48);
      const y = clamp01(0.5 + Math.max(-1, Math.min(1, (beta - 45) / ORIENT_GAIN)) * 0.42);
      queuePointer(x, y);
    };

    async function maybeEnableOrientation() {
      if (orientEnabled || permissionAsked || fineMq.matches) return;
      if (typeof window.DeviceOrientationEvent !== 'function') return;

      permissionAsked = true;
      try {
        const request = window.DeviceOrientationEvent.requestPermission;
        if (typeof request === 'function') {
          const result = await request.call(window.DeviceOrientationEvent);
          if (result !== 'granted') return;
        }
        window.addEventListener('deviceorientation', onOrientation, { passive: true });
        orientEnabled = true;
      } catch {
        // Permission denied or unavailable
      }
    }

    window.addEventListener('pointermove', onFinePointer, { passive: true });
    window.addEventListener('pointerdown', onTouchPointer, { passive: true });
    window.addEventListener('pointermove', onTouchPointer, { passive: true });
    window.addEventListener('pointerup', onTouchPointer, { passive: true });
    window.addEventListener('pointercancel', onTouchPointer, { passive: true });

    if (!fineMq.matches && typeof window.DeviceOrientationEvent === 'function') {
      if (typeof window.DeviceOrientationEvent.requestPermission !== 'function') {
        window.addEventListener('deviceorientation', onOrientation, { passive: true });
        orientEnabled = true;
      }
    }

    return () => {
      window.removeEventListener('pointermove', onFinePointer);
      window.removeEventListener('pointerdown', onTouchPointer);
      window.removeEventListener('pointermove', onTouchPointer);
      window.removeEventListener('pointerup', onTouchPointer);
      window.removeEventListener('pointercancel', onTouchPointer);
      window.removeEventListener('deviceorientation', onOrientation);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [queuePointer, reduced]);

  const value = useMemo(
    () => ({
      reduced,
      scrollYProgress,
      pointerX: reduced ? pointerX : smoothX,
      pointerY: reduced ? pointerY : smoothY,
    }),
    [reduced, scrollYProgress, pointerX, pointerY, smoothX, smoothY],
  );

  return (
    <SinematicMotionContext.Provider value={value}>
      {children}
    </SinematicMotionContext.Provider>
  );
}

export function useSinematicMotion() {
  const context = useContext(SinematicMotionContext);
  if (!context) {
    throw new Error('useSinematicMotion must be used within SinematicMotionProvider');
  }
  return context;
}

/**
 * Navigation + active scene from scroll.
 * Uses a viewport focus-line spy so tall/short scenes and end sections all update the rail.
 */
export function SinematicSceneProvider({
  children,
  navItems = [],
}) {
  const { scrollYProgress } = useSinematicMotion();
  const validIds = useMemo(() => navItems.map((item) => item.id), [navItems]);
  const [activeId, setActiveId] = useState(() => navItems[0]?.id || 'home');
  const scenesRef = useRef(new Map());
  const rafRef = useRef(0);

  const total = navItems.length;
  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) => item.id === activeId),
  );

  useEffect(() => {
    setPersistedTemplate('sinematic');
  }, []);

  useEffect(() => {
    if (!activeId) return;
    setPersistedSectionId('sinematic', activeId);
  }, [activeId]);

  const syncActiveFromScroll = useCallback(() => {
    const viewportH = window.innerHeight || 1;
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

    // Title card owns the top of the page — never treat About as current here.
    if (scrollY <= 80 && validIds.includes('home')) {
      setActiveId((prev) => (prev === 'home' ? prev : 'home'));
      return;
    }

    const focusY = viewportH * 0.32;
    let bestId = null;
    let bestScore = -Infinity;

    scenesRef.current.forEach((entry) => {
      const node = entry.node || entry.trackRef?.current || entry.stageRef?.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= viewportH) return;

      const coversFocus = rect.top <= focusY && rect.bottom >= focusY;
      const mid = rect.top + Math.min(rect.height * 0.35, 120);
      const dist = Math.abs(mid - focusY);
      const visible = Math.min(rect.bottom, viewportH) - Math.max(rect.top, 0);
      const visibility = visible / Math.min(rect.height, viewportH);

      const score =
        (coversFocus ? 1000 : 0) + visibility * 100 - dist * 0.35;
      if (score > bestScore) {
        bestScore = score;
        bestId = entry.id;
      }
    });

    if (bestId) {
      setActiveId((prev) => (prev === bestId ? prev : bestId));
    }
  }, [validIds]);

  const scheduleSync = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;
      syncActiveFromScroll();
    });
  }, [syncActiveFromScroll]);

  const registerScene = useCallback(
    ({ id, index, label, trackRef, stageRef }) => {
      const node = trackRef?.current || stageRef?.current;
      scenesRef.current.set(id, { id, index, label, trackRef, stageRef, node });
      scheduleSync();
    },
    [scheduleSync],
  );

  const unregisterScene = useCallback((id) => {
    scenesRef.current.delete(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      scheduleSync();
    };
    const onResize = () => scheduleSync();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    scheduleSync();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleSync, navItems]);

  const selectNav = useCallback((id) => {
    const target =
      document.getElementById(id) ||
      document.querySelector(`[data-scene="${id}"]`);
    if (!target) return;
    setActiveId(id);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const value = useMemo(
    () => ({
      activeId,
      activeIndex,
      total,
      navItems,
      selectNav,
      setActiveId,
      registerScene,
      unregisterScene,
      scrollYProgress,
    }),
    [
      activeId,
      activeIndex,
      total,
      navItems,
      selectNav,
      registerScene,
      unregisterScene,
      scrollYProgress,
    ],
  );

  return (
    <SinematicSceneContext.Provider value={value}>
      {children}
    </SinematicSceneContext.Provider>
  );
}

export function useSinematicScene() {
  const context = useContext(SinematicSceneContext);
  if (!context) {
    throw new Error('useSinematicScene must be used within SinematicSceneProvider');
  }
  return context;
}

export function useSinematicReveal(amount = 0.18) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount, once: true });
  return { ref, isInView };
}

/** Map a scene progress MotionValue into staggered child opacity (camera-scrub reveal). */
export function useSceneStaggerOpacity(progress, index, total = 8) {
  const start = 0.22 + (index / Math.max(total, 1)) * 0.22;
  const mid = Math.min(start + 0.1, 0.55);
  return useTransform(progress, [start, mid, 0.7, 0.88], [0, 1, 1, 0.4]);
}

export function useSinematicParallax(speed = 0.15) {
  const { scrollYProgress, reduced } = useSinematicMotion();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  return reduced ? undefined : { y };
}

export function sinematicPressMotion(reduced) {
  if (reduced) return {};
  return {
    whileHover: { y: -2 },
    whileTap: { scale: 0.96, y: 0 },
    transition: { type: 'spring', stiffness: 420, damping: 28, mass: 0.4 },
  };
}

export function sinematicCardMotion(reduced) {
  if (reduced) return {};
  return {
    whileHover: { y: -3 },
    whileTap: { scale: 0.985, y: 0 },
    transition: { type: 'spring', stiffness: 380, damping: 26, mass: 0.45 },
  };
}

/** Tap-only feedback for rail dots / chips (no hover lift fighting scroll). */
export function sinematicTapMotion(reduced) {
  if (reduced) return {};
  return {
    whileTap: { scale: 0.94 },
    transition: { duration: 0.1 },
  };
}

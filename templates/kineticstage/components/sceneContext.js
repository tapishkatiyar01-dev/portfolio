'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const StageSceneContext = createContext({
  scene: 'home',
  setScene: () => {},
});

export function StageSceneProvider({ children, initialScene = 'home' }) {
  const [scene, setScene] = useState(initialScene || 'home');
  const value = useMemo(() => ({ scene, setScene }), [scene]);
  return (
    <StageSceneContext.Provider value={value}>{children}</StageSceneContext.Provider>
  );
}

export function useStageScene() {
  return useContext(StageSceneContext);
}

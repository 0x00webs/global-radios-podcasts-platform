import { createContext, useContext, useRef } from 'react';

type AudioType = 'radio' | 'podcast';

interface GlobalAudioManagerType {
  registerPlayer: (type: AudioType, pauseFn: () => void) => void;
  notifyPlayback: (type: AudioType) => void;
}

const GlobalAudioManagerContext = createContext<GlobalAudioManagerType | undefined>(undefined);

/**
 * Global Audio Manager
 * Ensures only one audio source plays at a time (radio OR podcast)
 */
export const GlobalAudioManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const playersRef = useRef<Map<AudioType, () => void>>(new Map());

  const registerPlayer = (type: AudioType, pauseFn: () => void) => {
    console.log(`[GlobalAudioManager] Registering ${type} player`);
    playersRef.current.set(type, pauseFn);
  };

  const notifyPlayback = (type: AudioType) => {
    console.log(`[GlobalAudioManager] ${type} started playing, pausing others...`);
    console.log(`[GlobalAudioManager] Registered players:`, Array.from(playersRef.current.keys()));
    // Pause all other players except the one that's playing
    playersRef.current.forEach((pauseFn, playerType) => {
      if (playerType !== type) {
        console.log(`[GlobalAudioManager] Calling pause for ${playerType}`);
        pauseFn();
        console.log(`[GlobalAudioManager] ${playerType} paused`);
      }
    });
  };

  return (
    <GlobalAudioManagerContext.Provider value={{ registerPlayer, notifyPlayback }}>
      {children}
    </GlobalAudioManagerContext.Provider>
  );
};

export const useGlobalAudioManager = () => {
  const context = useContext(GlobalAudioManagerContext);
  if (!context) {
    throw new Error('useGlobalAudioManager must be used within GlobalAudioManagerProvider');
  }
  return context;
};

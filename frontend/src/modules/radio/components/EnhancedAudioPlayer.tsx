import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
  Radio,
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { Button, Card } from '@/modules/shared/components/ui';

/**
 * Modern Enhanced Audio Player with full screen support
 * Note: Audio playback is handled by AudioContext, not this component
 */
export const EnhancedAudioPlayer: React.FC = () => {
  const { isPlaying, currentStation, volume, setVolume, togglePlay, error } = useAudio();
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!currentStation) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-800 text-white p-4 border-t border-slate-700">
        <p className="text-center text-sm text-slate-400">No station selected</p>
      </div>
    );
  }

  const showError = error && !isPlaying;

  return (
    <>
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700 text-white border-t border-slate-600 shadow-2xl z-40"
        animate={{ y: isFullScreen ? '100vh' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 cursor-pointer min-w-0" onClick={() => setIsFullScreen(true)}>
              <div className="flex items-center gap-3">
                {currentStation.favicon && (
                  <img
                    src={currentStation.favicon}
                    alt={currentStation.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{currentStation.name}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {currentStation.country} • {currentStation.language}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={togglePlay}
                className="hover:bg-slate-700"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setVolume(volume === 0 ? 50 : 0)}
                className="hover:bg-slate-700"
              >
                {volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsFullScreen(true)}
                className="hover:bg-slate-700"
              >
                <ChevronDown className="w-5 h-5 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-2 text-slate-400">
                <Radio className="w-5 h-5" />
                <span className="text-sm font-medium">Now Playing</span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsFullScreen(false)}
                className="text-slate-400 hover:text-white"
              >
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <div className="w-64 h-64 mb-8">
                  {currentStation.favicon ? (
                    <img
                      src={currentStation.favicon}
                      alt={currentStation.name}
                      className="w-full h-full rounded-2xl object-cover shadow-2xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-2xl">
                      <Radio className="w-24 h-24 text-slate-600" />
                    </div>
                  )}
                </div>
              </motion.div>

              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">{currentStation.name}</h2>
                <p className="text-lg text-slate-400 mb-4">
                  {currentStation.country} • {currentStation.language}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentStation.tags?.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={togglePlay}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center shadow-xl mb-12"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </motion.button>

              {showError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg"
                >
                  <p className="text-red-300 text-sm font-medium">{error}</p>
                </motion.div>
              )}

              <Card className="w-full max-w-md bg-slate-800 border-slate-700">
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bitrate</span>
                    <span className="font-medium text-white">{currentStation.bitrate || 'N/A'} kbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Codec</span>
                    <span className="font-medium text-white uppercase">{currentStation.codec || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Popularity</span>
                    <span className="font-medium text-white">{currentStation.votes || 0} votes</span>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronDown,
  Mic,
  List,
} from 'lucide-react';
import { usePodcastPlayer } from '../context/PodcastPlayerContext';
import { Button, Card } from '@/modules/shared/components/ui';

/**
 * Modern Podcast Player Component
 * Provides full playback controls with episode queue management
 */
export const PodcastPlayer: React.FC = () => {
  const {
    currentPodcast,
    currentEpisode,
    isPlaying,
    isLoading,
    error,
    duration,
    currentTime,
    volume,
    isMuted,
    playbackRate,
    queue,
    queueIndex,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    nextEpisode,
    previousEpisode,
  } = usePodcastPlayer();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  if (!currentEpisode || !currentPodcast) return null;

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Mini Player - Bottom Bar (overlay) */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            key="podcast-mini"
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700 text-white border-t border-slate-600 shadow-2xl z-60"
            animate={{ y: isFullScreen ? '100vh' : 0 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              {/* Progress Bar */}
              <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                seek(percent * duration);
              }}>
                <span className="text-xs text-slate-400">{formatTime(currentTime)}</span>
                <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{formatTime(duration)}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* Podcast & Episode Info */}
                <div className="flex-1 cursor-pointer min-w-0" onClick={() => setIsFullScreen(true)}>
                  <div className="flex items-center gap-3">
                    {currentPodcast.imageUrl && (
                      <img
                        src={currentPodcast.imageUrl}
                        alt={currentPodcast.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-400 truncate">{currentPodcast.title}</p>
                      <p className="text-sm font-semibold truncate text-white">{currentEpisode.title}</p>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={previousEpisode}
                    className="hover:bg-slate-700"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={togglePlayPause}
                    disabled={isLoading}
                    className="hover:bg-slate-700 bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? (
                      <div className="animate-spin">⏳</div>
                    ) : isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={nextEpisode}
                    className="hover:bg-slate-700"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleMute}
                    className="hover:bg-slate-700"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowQueue(!showQueue)}
                    className="hover:bg-slate-700"
                  >
                    <List className="w-5 h-5" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsFullScreen(true)}
                    className="hover:bg-slate-700"
                  >
                    <ChevronDown className="w-5 h-5 rotate-180" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsCollapsed(true)}
                    className="hover:bg-slate-700"
                    title="Minimize player"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Pill */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            key="podcast-pill"
            className="fixed bottom-4 right-4 z-70 px-3 py-2 bg-slate-900 text-white rounded-full shadow-2xl border border-slate-700 flex items-center gap-2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            <button onClick={() => setIsCollapsed(false)} className="text-xs text-slate-300 hover:text-white">
              <ChevronDown className="w-4 h-4 rotate-180" />
            </button>
            <button onClick={previousEpisode} className="text-slate-200 hover:text-white">
              <SkipBack className="w-4 h-4" />
            </button>
            <button onClick={togglePlayPause} className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center">
              {isLoading ? '⏳' : isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button onClick={nextEpisode} className="text-slate-200 hover:text-white">
              <SkipForward className="w-4 h-4" />
            </button>
            <button onClick={() => setIsFullScreen(true)} className="text-slate-200 hover:text-white" title="Open player">
              <Mic className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Player */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-2 text-slate-400">
                <Mic className="w-5 h-5" />
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

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
                {/* Podcast Cover */}
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mb-8">
                  <div className="w-48 h-48 md:w-64 md:h-64">
                    {currentPodcast.imageUrl ? (
                      <img
                        src={currentPodcast.imageUrl}
                        alt={currentPodcast.title}
                        className="w-full h-full rounded-2xl object-cover shadow-2xl"
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center shadow-2xl">
                        <Mic className="w-24 h-24 text-white/30" />
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Episode Info */}
                <div className="text-center mb-8 max-w-xl">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{currentEpisode.title}</h2>
                  <p className="text-lg text-slate-400 mb-4">{currentPodcast.title}</p>
                  {currentEpisode.description && (
                    <p className="text-sm text-slate-300 line-clamp-3">
                      {currentEpisode.description}
                    </p>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md mb-8">
                  <div
                    className="flex items-center gap-3 mb-3 cursor-pointer"
                    onClick={(e) => {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      seek(percent * duration);
                    }}
                  >
                    <span className="text-sm text-slate-400">{formatTime(currentTime)}</span>
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-400">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg"
                  >
                    <p className="text-red-300 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setPlaybackRate(playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1)}
                    className="text-slate-400 hover:text-white"
                  >
                    <span className="text-sm font-bold">{playbackRate}x</span>
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={previousEpisode}
                    className="text-slate-400 hover:text-white"
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>

                  <motion.button
                    onClick={togglePlayPause}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center shadow-xl disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin text-2xl">⏳</div>
                    ) : isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </motion.button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={nextEpisode}
                    className="text-slate-400 hover:text-white"
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleMute}
                    className="text-slate-400 hover:text-white"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6" />
                    )}
                  </Button>
                </div>

                {/* Volume Slider */}
                <div className="w-full max-w-md mb-8">
                  <div className="flex items-center gap-3">
                    <VolumeX className="w-4 h-4 text-slate-400" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${(isMuted ? 0 : volume) * 100}%, rgb(55, 65, 81) ${(isMuted ? 0 : volume) * 100}%, rgb(55, 65, 81) 100%)`
                      }}
                    />
                    <Volume2 className="w-4 h-4 text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Episode Queue Info */}
              {queue.length > 0 && (
                <Card className="m-6 p-4 bg-slate-800 border-slate-700">
                  <p className="text-sm text-slate-300">
                    Episode {queueIndex + 1} of {queue.length}
                  </p>
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

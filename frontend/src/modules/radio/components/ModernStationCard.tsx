import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, Radio, Wifi, Award, Globe, Music } from 'lucide-react';
import type { RadioStation } from '../types/radio.types';
import { useAudio } from '../context/AudioContext';
import { Button, Card } from '@/modules/shared/components/ui';

interface StationCardProps {
  station: RadioStation;
  onFavorite?: (station: RadioStation) => void;
  isFavorited?: boolean;
}

/**
 * Modern Station Card with hover effects and detailed information
 */
export const ModernStationCard: React.FC<StationCardProps> = ({
  station,
  onFavorite,
  isFavorited = false,
}) => {
  const { playStation, isPlaying, currentStation } = useAudio();
  const [imageError, setImageError] = useState(false);

  const isCurrentStation = currentStation?.id === station.id;
  const handlePlay = () => {
    playStation?.(station);
  };

  const getQualityBadge = () => {
    const bitrate = station.bitrate || 0;
    if (bitrate >= 192) return { label: 'HD', color: 'bg-emerald-500' };
    if (bitrate >= 128) return { label: 'High', color: 'bg-blue-500' };
    if (bitrate >= 64) return { label: 'Good', color: 'bg-amber-500' };
    return { label: 'Low', color: 'bg-slate-500' };
  };

  const quality = getQualityBadge();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-full flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
          {/* Favicon/Logo */}
          {station.favicon && !imageError ? (
            <div className="relative w-full h-full">
              <img
                src={station.favicon}
                alt={station.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
              <Radio className="w-20 h-20 text-white/30" />
            </div>
          )}

          {/* Quality Badge */}
          <div className="absolute top-2 left-2 flex gap-2">
            <span className={`${quality.color} text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex items-center gap-1`}>
              <Wifi className="w-3 h-3" />
              {quality.label}
            </span>
            {station.ssl && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                🔒 SSL
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2"
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onFavorite?.(station)}
              className="bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 backdrop-blur-sm rounded-full shadow-lg"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-700 dark:text-slate-300'
                }`}
              />
            </Button>
          </motion.div>

          {/* Play/Pause Button - Always Visible in Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              onClick={handlePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm transition-all ${
                isCurrentStation && isPlaying
                  ? 'bg-white/95 hover:bg-white'
                  : 'bg-white/90 hover:bg-white'
              }`}
            >
              {isCurrentStation && isPlaying ? (
                <Pause className="w-7 h-7 text-indigo-600" />
              ) : (
                <Play className="w-7 h-7 text-indigo-600 ml-0.5" />
              )}
            </motion.button>
          </div>

          {/* Playing Indicator */}
          {isCurrentStation && isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1"
            >
              <Music className="w-3 h-3 animate-pulse" />
              Now Playing
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Station Name */}
          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 mb-2 leading-tight">
            {station.name}
          </h3>

          {/* Location & Language */}
          <div className="flex items-center gap-2 mb-3 text-sm">
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Globe className="w-4 h-4" />
              <span className="font-medium">{station.country || 'Global'}</span>
            </div>
            {station.language && (
              <>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {station.language}
                </span>
              </>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Wifi className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                {station.bitrate || '–'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">kbps</p>
            </div>
            <div className="text-center border-x border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Music className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="font-bold text-sm text-slate-900 dark:text-white uppercase">
                {station.codec || '–'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">codec</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                {station.votes || 0}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">votes</p>
            </div>
          </div>

          {/* Tags */}
          {station.tags && station.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {station.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
              {station.tags.length > 3 && (
                <span className="inline-block px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full font-medium">
                  +{station.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

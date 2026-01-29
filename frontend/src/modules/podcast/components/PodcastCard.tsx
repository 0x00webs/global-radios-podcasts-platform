import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Mic, TrendingUp, Globe } from 'lucide-react';
import type { Podcast } from '../types/podcast.types';
import { usePodcastPlayer } from '../context/PodcastPlayerContext';
import { cleanDescription } from '@/modules/shared/lib/sanitize';
import { Button, Card } from '@/modules/shared/components/ui';

interface PodcastCardProps {
  podcast: Podcast;
  onSelect?: (podcast: Podcast) => void;
  onFavorite?: (podcast: Podcast) => void;
  isFavorited?: boolean;
}

/**
 * Modern Podcast Card Component
 * Matches radio station card design for consistency
 */
export const PodcastCard: React.FC<PodcastCardProps> = ({
  podcast,
  onSelect,
  onFavorite,
  isFavorited = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const { currentPodcast } = usePodcastPlayer();

  const isCurrentPodcast = currentPodcast?.id === podcast.id;

  const handleClick = () => {
    onSelect?.(podcast);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Just play the first episode or set first episode to queue
    // This will be handled by onSelect
    onSelect?.(podcast);
  };

  const getPopularityBadge = () => {
    const popularity = podcast.popularity || 0;
    if (popularity >= 1000) return { label: 'Trending', color: 'bg-red-500' };
    if (popularity >= 500) return { label: 'Popular', color: 'bg-pink-500' };
    return { label: 'New', color: 'bg-purple-500' };
  };

  const badge = getPopularityBadge();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <Card className={`overflow-hidden transition-all duration-300 h-full flex flex-col ${
        isCurrentPodcast
          ? 'bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-600 ring-2 ring-purple-500 shadow-2xl'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-2xl'
      }`}>
        <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
          {/* Podcast Cover */}
          {podcast.imageUrl && !imageError ? (
            <div className="relative w-full h-full">
              <img
                src={podcast.imageUrl}
                alt={podcast.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
              <Mic className="w-20 h-20 text-white/30" />
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-2 left-2 flex gap-2">
            <span className={`${badge.color} text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex items-center gap-1`}>
              <TrendingUp className="w-3 h-3" />
              {badge.label}
            </span>
          </div>

          {/* Favorite Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2"
            onClick={(e) => {
              e.stopPropagation();
              onFavorite?.(podcast);
            }}
          >
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 backdrop-blur-sm rounded-full shadow-lg"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-700 dark:text-slate-300'
                }`}
              />
            </Button>
          </motion.div>

          {/* Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full flex items-center justify-center bg-white/90 hover:bg-white backdrop-blur-sm shadow-2xl"
              onClick={handlePlay}
            >
              <Play className="w-7 h-7 text-purple-600 ml-0.5" />
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Podcast Title */}
          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 mb-2 leading-tight">
            {podcast.title}
          </h3>

          {/* Author & Location */}
          <div className="flex items-center gap-2 mb-3 text-sm">
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Mic className="w-4 h-4" />
              <span className="font-medium truncate">{podcast.authorName || 'Unknown'}</span>
            </div>
            {podcast.country && (
              <>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {podcast.country}
                </span>
              </>
            )}
          </div>

          {/* Description - Clean HTML and truncate */}
          {podcast.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
              {cleanDescription(podcast.description, 120)}
            </p>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                {podcast.episodeCount || '–'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">episodes</p>
            </div>
            <div className="text-center border-x border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Globe className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              </div>
              <p className="font-bold text-sm text-slate-900 dark:text-white uppercase">
                {podcast.language ? podcast.language.substring(0, 2).toUpperCase() : '–'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">lang</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-purple-600 dark:text-purple-400 text-lg">⭐</span>
              </div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                {podcast.popularity || 0}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">score</p>
            </div>
          </div>

          {/* Categories/Tags */}
          {podcast.categories && podcast.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {podcast.categories.slice(0, 3).map((category) => (
                <span
                  key={category}
                  className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium"
                >
                  #{category}
                </span>
              ))}
              {podcast.categories.length > 3 && (
                <span className="inline-block px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded-full font-medium">
                  +{podcast.categories.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

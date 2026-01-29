import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import type { Country, Tag } from '../types/radio.types';
import { Select } from '@/modules/shared/components/ui';

interface ModernFiltersProps {
  countries: Country[];
  tags: Tag[];
  selectedCountry: string;
  selectedTag: string;
  onCountryChange: (country: string) => void;
  onTagChange: (tag: string) => void;
  onClear?: () => void;
}

/**
 * Modern Filters Component with animations
 */
export const ModernFilters: React.FC<ModernFiltersProps> = ({
  countries,
  tags,
  selectedCountry,
  selectedTag,
  onCountryChange,
  onTagChange,
  onClear,
}) => {
  const hasActiveFilters = selectedCountry || selectedTag;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="w-full"
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Filters</h3>
          </div>
          {hasActiveFilters && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClear}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <X className="w-4 h-4" />
              Clear All
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Country Filter */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <label htmlFor="country-filter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Country ({countries.length})
            </label>
            <Select
              id="country-filter"
              value={selectedCountry}
              onChange={(e) => onCountryChange(e.target.value)}
              className="w-full"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name} ({country.stationCount})
                </option>
              ))}
            </Select>
          </motion.div>

          {/* Genre/Tag Filter */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <label htmlFor="tag-filter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Genre ({tags.length})
            </label>
            <Select
              id="tag-filter"
              value={selectedTag}
              onChange={(e) => onTagChange(e.target.value)}
              className="w-full"
            >
              <option value="">All Genres</option>
              {tags.slice(0, 100).map((tag) => (
                <option key={tag.name} value={tag.name}>
                  {tag.name} ({tag.stationCount})
                </option>
              ))}
            </Select>
          </motion.div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
          >
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Active:</span>
              {selectedCountry && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium flex items-center gap-2"
                >
                  {selectedCountry}
                  <button
                    onClick={() => onCountryChange('')}
                    className="hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </motion.div>
              )}
              {selectedTag && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium flex items-center gap-2"
                >
                  {selectedTag}
                  <button
                    onClick={() => onTagChange('')}
                    className="hover:text-purple-900 dark:hover:text-purple-100"
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PodcastEpisode } from './podcast-episode.entity';

/**
 * Podcast entity - stores podcast metadata from RSS feeds and Podcast Index
 * Links to multiple episodes via one-to-many relationship
 */
@Entity('podcasts')
export class Podcast {
  @PrimaryColumn({ type: 'uuid' })
  id: string; // Generated UUID

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'rss_url' })
  rssUrl: string; // Primary RSS feed URL

  @Column({ type: 'text', nullable: true })
  imageUrl: string; // Podcast artwork/logo

  @Column({ type: 'text', nullable: true })
  authorName: string;

  @Column({ nullable: true })
  language: string; // e.g., 'en', 'fr', 'sw' for Swahili

  @Column({ type: 'simple-array', nullable: true })
  categories: string[]; // e.g., 'news', 'music', 'comedy', 'education'

  @Column({ nullable: true })
  country: string; // Country of origin for discovery

  @Column({ type: 'int', default: 0 })
  episodeCount: number; // Total episodes

  @Column({ type: 'text', nullable: true })
  websiteUrl: string;

  @Column({ type: 'int', default: 0 })
  popularity: number; // For ranking

  @Column({ default: true })
  active: boolean; // Whether RSS feed is still active

  @CreateDateColumn({ name: 'added_at' })
  addedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true })
  lastFetchedAt: Date; // Last time RSS was updated

  // Relationship to episodes
  @OneToMany(() => PodcastEpisode, (episode) => episode.podcast)
  episodes: PodcastEpisode[];
}

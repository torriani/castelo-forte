import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const competitors = sqliteTable('competitors', {
  id: text('id').primaryKey(),
  handle: text('handle').notNull(),
  platform: text('platform').notNull().default('instagram'),
  market: text('market').notNull(), // BR, US
  niche: text('niche'),
  followersCount: integer('followers_count'),
  postsCount: integer('posts_count'),
  biography: text('biography'),
  postingFrequency: text('posting_frequency'),
  primaryFormat: text('primary_format'),
  tone: text('tone'),
  offer: text('offer'),
  relevanceScore: integer('relevance_score'),
  relevanceReason: text('relevance_reason'),
  status: text('status').default('active'),
  lastScrapedAt: text('last_scraped_at'),
  createdAt: text('created_at').default(''),
});

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  competitorId: text('competitor_id').references(() => competitors.id),
  postUrl: text('post_url'),
  postType: text('post_type'), // carrossel, reel, imagem, story
  caption: text('caption'),
  likesCount: integer('likes_count'),
  commentsCount: integer('comments_count'),
  savesCount: integer('saves_count'),
  sharesCount: integer('shares_count'),
  viewsCount: integer('views_count'),
  engagementRate: real('engagement_rate'),
  postedAt: text('posted_at'),
  hookText: text('hook_text'),
  hookType: text('hook_type'),
  postNarrativeType: text('post_narrative_type'),
  copyFramework: text('copy_framework'),
  ctaText: text('cta_text'),
  tone: text('tone'),
  slidesCount: integer('slides_count'),
  analysisStatus: text('analysis_status').default('pending'),
  createdAt: text('created_at').default(''),
});

export const transcriptions = sqliteTable('transcriptions', {
  id: text('id').primaryKey(),
  postId: text('post_id').references(() => posts.id),
  fullText: text('full_text'),
  hookText: text('hook_text'),
  retentionText: text('retention_text'),
  contentText: text('content_text'),
  ctaText: text('cta_text'),
  frameworkUsed: text('framework_used'),
  tone: text('tone'),
  triggerWords: text('trigger_words'), // JSON
  viralPattern: text('viral_pattern'),
  durationSeconds: integer('duration_seconds'),
  language: text('language'),
  createdAt: text('created_at').default(''),
});

export const analyses = sqliteTable('analyses', {
  id: text('id').primaryKey(),
  analysisType: text('analysis_type'),
  competitorId: text('competitor_id'),
  hookPatterns: text('hook_patterns'), // JSON
  structurePatterns: text('structure_patterns'), // JSON
  ctaPatterns: text('cta_patterns'), // JSON
  gaps: text('gaps'), // JSON
  opportunities: text('opportunities'), // JSON
  avgEngagementRate: real('avg_engagement_rate'),
  fullReport: text('full_report'),
  postsAnalyzed: integer('posts_analyzed'),
  createdAt: text('created_at').default(''),
});

export const suggestions = sqliteTable('suggestions', {
  id: text('id').primaryKey(),
  analysisId: text('analysis_id').references(() => analyses.id),
  theme: text('theme'),
  narrativeType: text('narrative_type'),
  copyFramework: text('copy_framework'),
  hookSuggestion: text('hook_suggestion'),
  format: text('format'),
  brief: text('brief'),
  sourceType: text('source_type'),
  sourceCompetitorId: text('source_competitor_id'),
  sourcePostId: text('source_post_id'),
  sourcePrinciple: text('source_principle'),
  sourceDescription: text('source_description'),
  status: text('status').default('pending'),
  priority: integer('priority').default(5),
  createdAt: text('created_at').default(''),
});

export const digests = sqliteTable('digests', {
  id: text('id').primaryKey(),
  periodType: text('period_type'),
  periodStart: text('period_start'),
  periodEnd: text('period_end'),
  summary: text('summary'),
  topPosts: text('top_posts'), // JSON
  trendingHooks: text('trending_hooks'), // JSON
  newGaps: text('new_gaps'), // JSON
  suggestionsCount: integer('suggestions_count'),
  fullReport: text('full_report'),
  createdAt: text('created_at').default(''),
});

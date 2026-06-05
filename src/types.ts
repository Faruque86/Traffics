export interface YouTubeVideo {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  tags: string[];
  publishedAt?: string;
}

export interface HighlightItem {
  timestamp: string;
  title: string;
  description: string;
}

export interface SentimentAnalysis {
  score: number; // 0 to 100
  label: 'Very Positive' | 'Positive' | 'Neutral' | 'Negative' | 'Strongly Mixed';
  breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  summary: string;
}

export interface KeywordItem {
  keyword: string;
  volume: number; // monthly search volume estimate
  competition: 'Low' | 'Medium' | 'High';
  score: number; // SEO overall score 0-100
}

export interface TitleSuggestion {
  text: string;
  score: number; // SEO power / clickability score
  reasoning: string;
}

export interface DescriptionSuggestion {
  text: string;
  conversionGoal: string;
  elements: string[];
}

export interface SEOOptimizedData {
  titleSuggestions: TitleSuggestion[];
  tagsSuggestions: string[];
  descriptionSuggestions: DescriptionSuggestion[];
}

export interface VideoAnalytics {
  videoId: string;
  videoTitle: string;
  channelTitle: string;
  thumbnailUrl: string;
  summary: string;
  highlights: HighlightItem[];
  sentiment: SentimentAnalysis;
  keywords: KeywordItem[];
  seoOptimized: SEOOptimizedData;
  rawTranscriptUsed?: string;
  wasAiGeneratedTranscript?: boolean;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  thumbnailUrl: string;
  videos: YouTubeVideo[];
}

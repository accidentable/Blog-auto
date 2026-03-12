export type NewsStatus = "new" | "analyzing" | "analyzed" | "posted" | "failed";

export interface NewsItem {
  id: string;
  telegramMsgId: number | null;
  channelId: string | null;
  channelTitle: string | null;
  originalContent: string;
  mediaUrls: string;
  status: NewsStatus;
  aiSummary: string | null;
  threadsContent: string | null;
  threadsPostId: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  type: string;
  message: string;
  newsId: string | null;
  createdAt: string;
}

export type AIProvider = "claude" | "openai";

export interface Settings {
  id: string;
  telegramBotToken: string | null;
  channelIds: string;
  aiProvider: AIProvider;
  claudeApiKey: string | null;
  openaiApiKey: string | null;
  threadsAccessToken: string | null;
  threadsUserId: string | null;
  automationEnabled: boolean;
}

export interface TokenUsage {
  id: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  newsId: string | null;
  createdAt: string;
}

export interface TokenStats {
  totalTokens: number;
  totalCost: number;
  todayTokens: number;
  todayCost: number;
  recentUsage: TokenUsage[];
}

export interface DashboardStats {
  totalNews: number;
  analyzedToday: number;
  postedToday: number;
  pendingReview: number;
}

export interface ThreadsPublishResult {
  id: string;
  permalink?: string;
}

interface TelegramMessage {
  message_id: number;
  chat: {
    id: number;
    title?: string;
    type: string;
  };
  date: number;
  text?: string;
  caption?: string;
  photo?: Array<{ file_id: string; file_unique_id: string; width: number; height: number }>;
  video?: { file_id: string; file_unique_id: string };
  document?: { file_id: string; file_name?: string };
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  channel_post?: TelegramMessage;
}

interface ParsedPost {
  messageId: number;
  channelId: string;
  channelTitle: string;
  content: string;
  mediaUrls: string[];
}

export function parseChannelPost(update: TelegramUpdate): ParsedPost | null {
  const post = update.channel_post || update.message;
  if (!post) return null;

  const content = post.text || post.caption || "";
  if (!content.trim()) return null;

  const mediaUrls: string[] = [];
  if (post.photo && post.photo.length > 0) {
    const largest = post.photo[post.photo.length - 1];
    mediaUrls.push(largest.file_id);
  }
  if (post.video) {
    mediaUrls.push(post.video.file_id);
  }

  return {
    messageId: post.message_id,
    channelId: String(post.chat.id),
    channelTitle: post.chat.title || "Unknown",
    content,
    mediaUrls,
  };
}

export async function setWebhook(botToken: string, webhookUrl: string, secret: string) {
  const url = `https://api.telegram.org/bot${botToken}/setWebhook`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secret,
      allowed_updates: ["channel_post", "message"],
    }),
  });
  return res.json();
}

export async function deleteWebhook(botToken: string) {
  const url = `https://api.telegram.org/bot${botToken}/deleteWebhook`;
  const res = await fetch(url, { method: "POST" });
  return res.json();
}

export async function getWebhookInfo(botToken: string) {
  const url = `https://api.telegram.org/bot${botToken}/getWebhookInfo`;
  const res = await fetch(url);
  return res.json();
}

export function verifyTelegramSecret(
  request: Request,
  secret: string
): boolean {
  const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");
  return headerSecret === secret;
}

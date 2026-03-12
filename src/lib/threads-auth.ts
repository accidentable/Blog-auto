const THREADS_AUTH_URL = "https://threads.net/oauth/authorize";
const THREADS_TOKEN_URL = "https://graph.threads.net/oauth/access_token";
const THREADS_EXCHANGE_URL = "https://graph.threads.net/access_token";

export function getAuthorizationUrl(): string {
  const appId = process.env.THREADS_APP_ID;
  const redirectUri = process.env.THREADS_REDIRECT_URI;

  if (!appId || !redirectUri) {
    throw new Error("Threads app configuration is missing");
  }

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: "threads_basic,threads_content_publish",
    response_type: "code",
  });

  return `${THREADS_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  user_id: string;
}> {
  const res = await fetch(THREADS_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.THREADS_APP_ID!,
      client_secret: process.env.THREADS_APP_SECRET!,
      grant_type: "authorization_code",
      redirect_uri: process.env.THREADS_REDIRECT_URI!,
      code,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return res.json();
}

export async function getLongLivedToken(shortToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    grant_type: "th_exchange_token",
    client_secret: process.env.THREADS_APP_SECRET!,
    access_token: shortToken,
  });

  const res = await fetch(`${THREADS_EXCHANGE_URL}?${params.toString()}`);

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Long-lived token exchange failed: ${error}`);
  }

  return res.json();
}

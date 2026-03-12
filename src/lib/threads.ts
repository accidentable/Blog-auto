const THREADS_API_URL = "https://graph.threads.net/v1.0";

interface CreateContainerResult {
  id: string;
}

interface PublishResult {
  id: string;
}

export async function createTextContainer(
  userId: string,
  accessToken: string,
  text: string
): Promise<CreateContainerResult> {
  const res = await fetch(`${THREADS_API_URL}/${userId}/threads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      media_type: "TEXT",
      text,
      access_token: accessToken,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create container: ${error}`);
  }

  return res.json();
}

export async function publishContainer(
  userId: string,
  accessToken: string,
  containerId: string
): Promise<PublishResult> {
  // Wait for container to be ready
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const res = await fetch(`${THREADS_API_URL}/${userId}/threads_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creation_id: containerId,
      access_token: accessToken,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to publish: ${error}`);
  }

  return res.json();
}

export async function publishToThreads(
  userId: string,
  accessToken: string,
  text: string
): Promise<{ id: string }> {
  const container = await createTextContainer(userId, accessToken, text);
  const published = await publishContainer(userId, accessToken, container.id);
  return published;
}

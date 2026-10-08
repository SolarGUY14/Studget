export type HealthResponse = { status: 'healthy' };

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

// Validate at runtime: a TypeScript type alone cannot validate a server response.
export async function getHealth(
  baseUrl = API_URL,
  timeoutMs = 5000,
): Promise<HealthResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/health`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('The service is unavailable.');
    const data: unknown = await response.json();
    if (
      typeof data !== 'object' ||
      data === null ||
      !('status' in data) ||
      data.status !== 'healthy'
    ) {
      throw new Error('The service returned an unexpected response.');
    }
    return { status: 'healthy' };
  } finally {
    clearTimeout(timer);
  }
}

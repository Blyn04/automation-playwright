const DEFAULT_WEB_URL = "https://www.sagradago.com";

export function getSagradaGoUrl(): string {
  const url = (process.env.SAGRADA_WEB_URL || process.env.WEB_URL || DEFAULT_WEB_URL).trim();
  if (!url) {
    throw new Error("SAGRADA_WEB_URL or WEB_URL is not set");
  }
  return url.replace(/\/$/, "");
}

export function getEnv(key: string): string {
  return process.env[key]?.trim() ?? "";
}

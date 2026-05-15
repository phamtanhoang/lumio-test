export const WORLD_MAP_URL =
  process.env.NEXT_PUBLIC_WORLD_MAP_URL ?? '';

export const FLAG_CDN_BASE =
  process.env.NEXT_PUBLIC_FLAG_CDN_BASE ?? '';

export function flagUrl(countryCode: string): string {
  return `${FLAG_CDN_BASE}/${countryCode.toLowerCase()}.png`;
}

export const ALLOWED_IMAGE_HOSTS = [
  'images.unsplash.com',
  'res.cloudinary.com',
  'hayatleather.com',
  'ik.imagekit.io',
] as const;

export function isOptimizableImage(src: string): boolean {
  if (!src) return false;
  if (src.startsWith('/')) return true;

  try {
    const hostname = new URL(src).hostname;
    return ALLOWED_IMAGE_HOSTS.includes(hostname as (typeof ALLOWED_IMAGE_HOSTS)[number]);
  } catch {
    return false;
  }
}

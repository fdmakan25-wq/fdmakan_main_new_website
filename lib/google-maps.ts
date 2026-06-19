export function buildPropertyMapQuery(property: {
  name: string;
  location: string;
  city?: string;
  address?: string;
}): string {
  if (property.address?.trim()) {
    return property.address.trim();
  }
  return [property.name, property.location, property.city, 'India'].filter(Boolean).join(', ');
}

export function getGoogleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function getGoogleMapsEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=15`;
}

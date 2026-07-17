export const EXTERNAL_AMENITIES = [
    { name: 'Swimming Pool', icon: '🏊' },
    { name: 'Club House', icon: '🏛️' },
    { name: 'Kids Play Area', icon: '🛝' },
    { name: 'Garden', icon: '🌳' },
    { name: 'Multi Purpose Court', icon: '🏀' },
    { name: 'Golf Course', icon: '⛳' },
    { name: 'Senior Citizen Area', icon: '👴' },
    { name: 'Squash Court', icon: '🎾' },
    { name: 'Pets Walking Area', icon: '🐾' },
    { name: 'Multi Purpose Lawn', icon: '🌱' },
    { name: 'Box Cricket', icon: '🏏' },
    { name: 'Library', icon: '📚' },
    { name: 'Open Gym', icon: '🏋️' },
    { name: 'Amphitheater', icon: '🎭' },
    { name: 'Banquet Hall', icon: '🎊' },
    { name: 'Toddlers Play Area', icon: '🧸' },
    { name: 'Seating Area', icon: '🪑' },
    { name: 'Creche Outdoor Play Area', icon: '🎈' },
    { name: 'Table Tennis', icon: '🏓' },
    { name: 'Pet Park', icon: '🐶' },
    { name: 'Indoor games', icon: '🎲' },
    { name: 'Star Gazing', icon: '✨' },
    { name: 'Badminton Court', icon: '🏸' },
    { name: 'Skating Ring', icon: '⛸️' },
    { name: 'Gymnasium', icon: '💪' },
    { name: 'Mini Theatre', icon: '🎬' },
    { name: 'Multi purpose hall', icon: '🏢' },
];

export interface AmenityOption {
  id: string;
  name: string;
  icon: string;
}

const defaultAmenityNames = new Set(
  EXTERNAL_AMENITIES.map((item) => item.name.trim().toLowerCase())
);

export function isDefaultAmenityName(name: string): boolean {
  return defaultAmenityNames.has(name.trim().toLowerCase());
}

/** Default amenities plus any custom ones added in the dashboard (no duplicates). */
export function mergeAmenityOptions(
  customAmenities: Array<{ _id?: string; name: string; icon?: string }>
): AmenityOption[] {
  const merged: AmenityOption[] = EXTERNAL_AMENITIES.map((item) => ({
    id: `default-${item.name}`,
    name: item.name,
    icon: item.icon,
  }));

  for (const item of customAmenities) {
    const name = item.name?.trim();
    if (!name || isDefaultAmenityName(name)) continue;
    merged.push({
      id: item._id || `custom-${name}`,
      name,
      icon: item.icon?.trim() || '',
    });
  }

  return merged;
}

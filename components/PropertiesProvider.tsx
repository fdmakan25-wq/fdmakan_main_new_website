'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface PropertyListItem {
  _id: string;
  name: string;
  title?: string;
  price: number;
  developer?: string;
  city?: string;
  location: string;
  listingFor?: string;
  propertyCategory?: string;
  propertyType?: string;
  subCategory?: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  available?: boolean;
  showInTopSelling?: boolean;
  showInPremium?: boolean;
  showInNewlyLaunched?: boolean;
  images?: string[];
  image?: string;
  pricing?: Array<{ type?: string; carpetArea?: string; price?: string }>;
  description?: string;
  createdAt?: string;
}

interface PropertiesContextValue {
  properties: PropertyListItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const PropertiesContext = createContext<PropertiesContextValue>({
  properties: [],
  loading: true,
  error: null,
  refresh: async () => {},
});

// Module-level in-memory cache to share across unmounts/navigation
let cachedData: PropertyListItem[] | null = null;
let inFlightPromise: Promise<PropertyListItem[]> | null = null;

async function fetchPropertiesOnce(): Promise<PropertyListItem[]> {
  if (cachedData) return cachedData;
  if (inFlightPromise) return inFlightPromise;

  inFlightPromise = (async () => {
    try {
      const res = await fetch('/api/properties', {
        // Next.js client-side fetch options
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) throw new Error(`Failed to load properties (${res.status})`);
      const data: PropertyListItem[] = await res.json();
      cachedData = Array.isArray(data) ? data : [];
      return cachedData;
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<PropertyListItem[]>(cachedData || []);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    if (force) cachedData = null;
    try {
      if (!cachedData) setLoading(true);
      const data = await fetchPropertiesOnce();
      setProperties(data);
      setError(null);
    } catch (err: any) {
      console.error('Error in PropertiesProvider:', err);
      setError(err?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load(true);
  }, [load]);

  return (
    <PropertiesContext.Provider value={{ properties, loading, error, refresh }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  return useContext(PropertiesContext);
}


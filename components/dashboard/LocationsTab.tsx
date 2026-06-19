'use client';

import { useState, useEffect } from 'react';

interface LocationItem {
  _id: string;
  name: string;
  cityId: string | null;
}

interface CityWithLocations {
  _id: string;
  name: string;
  locations: LocationItem[];
}

type ModalType = 'city' | 'location' | null;

export default function LocationsTab() {
  const [cities, setCities] = useState<CityWithLocations[]>([]);
  const [uncategorized, setUncategorized] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingCity, setEditingCity] = useState<CityWithLocations | null>(null);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cities', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch cities');
      const data = await response.json();
      setCities(data.cities || []);
      setUncategorized(data.uncategorized || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
      setUncategorized([]);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setEditingCity(null);
    setEditingLocation(null);
    setSelectedCityId('');
    setName('');
  };

  const openAddCity = () => {
    setEditingCity(null);
    setName('');
    setModalType('city');
  };

  const openEditCity = (city: CityWithLocations) => {
    setEditingCity(city);
    setName(city.name);
    setModalType('city');
  };

  const openAddLocation = (cityId: string) => {
    setEditingLocation(null);
    setSelectedCityId(cityId);
    setName('');
    setModalType('location');
  };

  const openEditLocation = (location: LocationItem, cityId: string) => {
    setEditingLocation(location);
    setSelectedCityId(cityId);
    setName(location.name);
    setModalType('location');
  };

  const handleDeleteCity = async (id: string) => {
    if (!confirm('Delete this city and all locations under it?')) return;
    try {
      const response = await fetch(`/api/cities/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete city');
      fetchData();
    } catch (error) {
      console.error('Error deleting city:', error);
      alert('Failed to delete city');
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm('Delete this location?')) return;
    try {
      const response = await fetch(`/api/locations/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete location');
      fetchData();
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Failed to delete location');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert(`Please enter a ${modalType === 'city' ? 'city' : 'location'} name`);
      return;
    }

    setSubmitting(true);
    try {
      if (modalType === 'city') {
        const url = editingCity ? `/api/cities/${editingCity._id}` : '/api/cities';
        const method = editingCity ? 'PUT' : 'POST';
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim() }),
        });
        const data = await response.json();
        if (!response.ok) {
          alert(data.error || 'Failed to save city');
          return;
        }
      } else if (modalType === 'location') {
        if (!selectedCityId) {
          alert('Please select a city');
          return;
        }
        const url = editingLocation
          ? `/api/locations/${editingLocation._id}`
          : '/api/locations';
        const method = editingLocation ? 'PUT' : 'POST';
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), cityId: selectedCityId }),
        });
        const data = await response.json();
        if (!response.ok) {
          alert(data.error || 'Failed to save location');
          return;
        }
      }

      closeModal();
      fetchData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading cities & locations...</div>
      </div>
    );
  }

  const isEmpty = cities.length === 0 && uncategorized.length === 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cities & Locations</h1>
          <p className="text-gray-600 mt-2">
            Add cities first, then add locations under each city for the property form
          </p>
        </div>
        <button
          onClick={openAddCity}
          className="bg-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-red-dark transition shadow-lg"
        >
          + Add City
        </button>
      </div>

      {isEmpty ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🏙️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No cities yet</h3>
          <p className="text-gray-600 mb-6">
            Start by adding a city, then add locations like Kharghar, Panvel under it
          </p>
          <button
            onClick={openAddCity}
            className="bg-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-red-dark transition"
          >
            Add Your First City
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cities.map((city) => (
            <div
              key={city._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏙️</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{city.name}</h3>
                    <p className="text-sm text-gray-500">
                      {city.locations.length} location{city.locations.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openAddLocation(city._id)}
                    className="text-sm bg-brand-teal/10 text-brand-teal px-3 py-1.5 rounded-lg font-medium hover:bg-brand-teal/20 transition"
                  >
                    + Add Location
                  </button>
                  <button
                    onClick={() => openEditCity(city)}
                    className="text-sm text-brand-teal font-medium hover:text-brand-teal-dark"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCity(city._id)}
                    className="text-sm text-red-600 font-medium hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {city.locations.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500 text-sm">
                  No locations in this city yet. Click &quot;Add Location&quot; above.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {city.locations.map((location) => (
                    <li
                      key={location._id}
                      className="flex items-center justify-between px-6 py-3 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📍</span>
                        <span className="text-sm font-medium text-gray-900">{location.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => openEditLocation(location, city._id)}
                          className="text-sm text-brand-teal font-medium hover:text-brand-teal-dark"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(location._id)}
                          className="text-sm text-red-600 font-medium hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {uncategorized.length > 0 && (
            <div className="bg-amber-50 rounded-xl border border-amber-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-200">
                <h3 className="font-bold text-amber-900">Uncategorized Locations</h3>
                <p className="text-sm text-amber-700">Old locations without a city — edit to assign a city</p>
              </div>
              <ul className="divide-y divide-amber-100">
                {uncategorized.map((location) => (
                  <li
                    key={location._id}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <span className="text-sm font-medium text-gray-900">{location.name}</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          setEditingLocation(location);
                          setSelectedCityId(cities[0]?._id || '');
                          setName(location.name);
                          setModalType('location');
                        }}
                        className="text-sm text-brand-teal font-medium"
                      >
                        Assign City
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(location._id)}
                        className="text-sm text-red-600 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {modalType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {modalType === 'city'
                  ? editingCity
                    ? 'Edit City'
                    : 'Add City'
                  : editingLocation
                    ? 'Edit Location'
                    : 'Add Location'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {modalType === 'location' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    required
                    value={selectedCityId}
                    onChange={(e) => setSelectedCityId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {modalType === 'city' ? 'City Name *' : 'Location Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    modalType === 'city'
                      ? 'e.g. Navi Mumbai'
                      : 'e.g. Kharghar, Sector 10'
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-brand-red text-white rounded-lg font-semibold hover:bg-brand-red-dark disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingCity || editingLocation ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

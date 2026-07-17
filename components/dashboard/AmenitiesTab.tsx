'use client';

import { useState, useEffect } from 'react';

interface Amenity {
  _id: string;
  name: string;
  icon: string;
}

export default function AmenitiesTab() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/amenities', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch amenities');
      const data = await response.json();
      setAmenities(data);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      setAmenities([]);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingAmenity(null);
    setName('');
    setIcon('');
    setShowModal(true);
  };

  const openEdit = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setName(amenity.name);
    setIcon(amenity.icon);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAmenity(null);
    setName('');
    setIcon('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this amenity? It will no longer appear when adding properties.')) return;
    try {
      const response = await fetch(`/api/amenities/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete amenity');
      fetchAmenities();
    } catch (error) {
      console.error('Error deleting amenity:', error);
      alert('Failed to delete amenity');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter an amenity name');
      return;
    }

    setSubmitting(true);
    try {
      const url = editingAmenity ? `/api/amenities/${editingAmenity._id}` : '/api/amenities';
      const method = editingAmenity ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), icon: icon.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to save amenity');
        return;
      }
      closeModal();
      fetchAmenities();
    } catch (error) {
      console.error('Error saving amenity:', error);
      alert('Failed to save amenity');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading amenities...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Amenities</h1>
          <p className="text-gray-600 mt-2">
            Add extra amenities here. Default amenities are always available when adding a property.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="bg-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-red-dark transition shadow-lg"
        >
          + Add Amenity
        </button>
      </div>

      {amenities.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No extra amenities yet</h3>
          <p className="text-gray-600 mb-6">
            Default amenities (Swimming Pool, Gym, etc.) are already available in the property form.
            Add any additional ones here.
          </p>
          <button
            type="button"
            onClick={openAdd}
            className="bg-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-red-dark transition"
          >
            Add Your First Amenity
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {amenities.map((amenity) => (
              <li
                key={amenity._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl w-8 text-center">{amenity.icon || '🏷️'}</span>
                  <span className="text-sm font-medium text-gray-900">{amenity.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => openEdit(amenity)}
                    className="text-sm text-brand-teal font-medium hover:text-brand-teal-dark"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(amenity._id)}
                    className="text-sm text-red-600 font-medium hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAmenity ? 'Edit Amenity' : 'Add Amenity'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenity Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Swimming Pool"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (optional emoji)
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="e.g. 🏊"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">Shown next to the name in the property form</p>
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
                  {submitting ? 'Saving...' : editingAmenity ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

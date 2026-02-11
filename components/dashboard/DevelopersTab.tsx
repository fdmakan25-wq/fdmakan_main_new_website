'use client';

import { useState, useEffect } from 'react';

interface Developer {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  establishedYear?: number;
  totalProjects?: number;
  rating?: number;
}

export default function DevelopersTab() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/developers', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch developers');
      const data = await response.json();
      console.log('Fetched developers:', data.length);
      setDevelopers(data);
    } catch (error) {
      console.error('Error fetching developers:', error);
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeveloper = () => {
    setEditingDeveloper(null);
    setShowModal(true);
  };

  const handleEditDeveloper = (developer: Developer) => {
    setEditingDeveloper(developer);
    setShowModal(true);
  };

  const handleDeleteDeveloper = async (id: string) => {
    if (!confirm('Are you sure you want to delete this developer?')) {
      return;
    }

    try {
      const response = await fetch(`/api/developers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete developer');

      alert('Developer deleted successfully!');
      fetchDevelopers();
    } catch (error) {
      console.error('Error deleting developer:', error);
      alert('Failed to delete developer');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading developers...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Developers</h1>
          <p className="text-gray-600 mt-2">Manage property developers and builders</p>
        </div>
        <button
          onClick={handleAddDeveloper}
          className="bg-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-red-dark transition shadow-lg"
        >
          + Add Developer
        </button>
      </div>

      {developers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No developers yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first developer</p>
          <button
            onClick={handleAddDeveloper}
            className="bg-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-red-dark transition"
          >
            Add Your First Developer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((developer) => (
            <div
              key={developer._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {developer.logo ? (
                <div className="w-full h-32 bg-white border-2 border-gray-200 rounded-lg mb-4 flex items-center justify-center p-4">
                  <img
                    src={developer.logo}
                    alt={developer.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-brand-teal to-brand-red rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{developer.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{developer.name}</h3>
              {developer.rating && (
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= (developer.rating || 0) ? 'text-orange-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}
              {developer.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{developer.description}</p>
              )}
              <div className="text-xs text-gray-500 mb-2">
                {developer.establishedYear && <span>Est. {developer.establishedYear}</span>}
                {developer.establishedYear && developer.totalProjects && <span> • </span>}
                {developer.totalProjects && <span>{developer.totalProjects} Projects</span>}
              </div>
              {developer.website && (
                <a
                  href={developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-teal hover:text-brand-teal-dark"
                >
                  Visit Website →
                </a>
              )}
              <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditDeveloper(developer)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => handleDeleteDeveloper(developer._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Developer Form Modal */}
      {showModal && (
        <DeveloperFormModal
          developer={editingDeveloper}
          onClose={() => {
            setShowModal(false);
            setEditingDeveloper(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingDeveloper(null);
            fetchDevelopers();
          }}
        />
      )}
    </div>
  );
}

// Developer Form Modal Component
function DeveloperFormModal({
  developer,
  onClose,
  onSuccess,
}: {
  developer: Developer | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: developer?.name || '',
    logo: developer?.logo || '',
    description: developer?.description || '',
    website: developer?.website || '',
    establishedYear: developer?.establishedYear || '',
    totalProjects: developer?.totalProjects || '',
    rating: developer?.rating || 5,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = developer
        ? `/api/developers/${developer._id}`
        : '/api/developers';
      const method = developer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save developer');
      }

      alert(developer ? 'Developer updated successfully!' : 'Developer created successfully!');
      // Small delay to ensure database is updated
      setTimeout(() => {
        onSuccess();
      }, 100);
    } catch (error: any) {
      console.error('Error saving developer:', error);
      alert(error.message || 'Failed to save developer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {developer ? 'Edit Developer' : 'Add New Developer'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Developer Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Godrej Properties, Lodha Group"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL (Optional)
            </label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
            />
            {formData.logo && (
              <div className="mt-2">
                <div className="w-full h-24 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center p-4">
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description about the developer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL (Optional)
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Established Year (Optional)
              </label>
              <input
                type="number"
                value={formData.establishedYear}
                onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value ? parseInt(e.target.value) : '' })}
                placeholder="e.g., 2007"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Projects (Optional)
              </label>
              <input
                type="number"
                value={formData.totalProjects}
                onChange={(e) => setFormData({ ...formData, totalProjects: e.target.value ? parseInt(e.target.value) : '' })}
                placeholder="e.g., 23"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (1-5 stars) (Optional)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Math.min(5, Math.max(1, parseInt(e.target.value) || 5)) })}
                min="1"
                max="5"
                className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
              />
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= formData.rating ? 'text-orange-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Default: 5 stars (can be changed later)</p>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-brand-red text-white rounded-lg font-semibold hover:bg-brand-red-dark disabled:opacity-50"
            >
              {submitting ? 'Saving...' : developer ? 'Update Developer' : 'Add Developer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


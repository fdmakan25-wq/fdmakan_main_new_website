'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastProvider';
import DeveloperModal, { Developer } from '@/components/dashboard/DeveloperModal';

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

  const toast = useToast();

  const handleDeleteDeveloper = async (id: string) => {
    if (!confirm('Are you sure you want to delete this developer?')) {
      return;
    }

    try {
      const response = await fetch(`/api/developers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete developer');

      toast.success('Developer deleted successfully!');
      fetchDevelopers();
    } catch (error: any) {
      console.error('Error deleting developer:', error);
      toast.error(error.message || 'Failed to delete developer');
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
        <DeveloperModal
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


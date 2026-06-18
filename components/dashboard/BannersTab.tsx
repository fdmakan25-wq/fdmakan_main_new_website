'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  active?: boolean;
  order?: number;
}

export default function BannersTab() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/banners', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch banners');
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hero banner slide?')) return;
    try {
      const response = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      alert('Banner deleted!');
      fetchBanners();
    } catch (error) {
      console.error(error);
      alert('Failed to delete banner');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading banners...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Banners</h1>
          <p className="text-gray-600 mt-2">
            Manage homepage hero slides — each banner shows as a sliding background with title & subtitle
          </p>
        </div>
        <button
          onClick={() => { setEditingBanner(null); setShowModal(true); }}
          className="px-6 py-3 bg-brand-red text-white rounded-lg font-semibold hover:bg-brand-red-dark transition"
        >
          + Add Banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">🖼️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hero banners yet</h3>
          <p className="text-gray-600 mb-6">Add slides to rotate in the homepage hero section</p>
          <button
            onClick={() => { setEditingBanner(null); setShowModal(true); }}
            className="px-6 py-3 bg-brand-red text-white rounded-lg font-semibold hover:bg-brand-red-dark transition"
          >
            Add Your First Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner, index) => (
            <div key={banner._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="relative h-44 bg-gray-100">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="font-bold text-lg line-clamp-1">{banner.title}</p>
                  <p className="text-white/80 text-sm line-clamp-1">{banner.subtitle}</p>
                </div>
                <span className="absolute top-3 left-3 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Slide {index + 1}
                </span>
                {banner.active === false && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Hidden
                  </span>
                )}
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <span className="text-xs text-gray-400">Order: {banner.order ?? index}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingBanner(banner); setShowModal(true); }}
                    className="px-4 py-2 text-sm font-medium text-brand-teal border border-brand-teal rounded-lg hover:bg-brand-teal/5 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <BannerFormModal
          banner={editingBanner}
          nextOrder={banners.length}
          onClose={() => { setShowModal(false); setEditingBanner(null); }}
          onSuccess={() => { setShowModal(false); setEditingBanner(null); fetchBanners(); }}
        />
      )}
    </div>
  );
}

function BannerFormModal({
  banner,
  nextOrder,
  onClose,
  onSuccess,
}: {
  banner: Banner | null;
  nextOrder: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    image: banner?.image || '',
    active: banner?.active !== false,
    order: banner?.order ?? nextOrder,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'fdmakan/banners');

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || err.error || 'Upload failed');
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, image: data.url }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subtitle.trim() || !formData.image.trim()) {
      alert('Please fill title, subtitle, and upload a banner image');
      return;
    }

    setSubmitting(true);
    try {
      const url = banner ? `/api/banners/${banner._id}` : '/api/banners';
      const method = banner ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || err.error || 'Failed to save');
      }

      alert(banner ? 'Banner updated!' : 'Banner created!');
      onSuccess();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save banner';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {banner ? 'Edit Hero Banner' : 'Add Hero Banner'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Find Your Dream Home"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle *</label>
            <textarea
              required
              rows={3}
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. Discover premium properties across India with FD MAKAN"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image *</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-brand-red hover:bg-brand-red/5 transition">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-600">
                  {uploading ? 'Uploading...' : 'Click to upload banner'}
                </span>
                <span className="text-xs text-gray-400 mt-1">1920×1080 recommended</span>
              </label>
            </div>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Or paste image URL"
              className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red text-gray-900 bg-white text-sm"
            />
            {formData.image && (
              <div className="relative mt-3 h-40 rounded-xl overflow-hidden border border-gray-200">
                <Image src={formData.image} alt="Preview" fill className="object-cover" sizes="400px" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slide Order</label>
              <input
                type="number"
                min={0}
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red text-gray-900 bg-white"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-brand-red rounded"
                />
                <span className="text-sm font-medium text-gray-700">Show on homepage</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-6 py-2 bg-brand-red text-white rounded-lg font-semibold hover:bg-brand-red-dark disabled:opacity-50"
            >
              {submitting ? 'Saving...' : banner ? 'Update Banner' : 'Add Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

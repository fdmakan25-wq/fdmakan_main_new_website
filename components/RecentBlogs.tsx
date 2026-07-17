'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';

interface Blog {
  _id: string;
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image?: string;
}

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop';

export default function RecentBlogs() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        if (!response.ok) return;
        const data = await response.json();
        const formatted: Blog[] = data.slice(0, 3).map(
          (blog: {
            _id: string;
            title: string;
            author: string;
            date: string;
            excerpt: string;
            image?: string;
          }) => ({
            _id: blog._id,
            id: blog._id,
            title: blog.title,
            author: blog.author,
            date: blog.date,
            excerpt: blog.excerpt,
            image: blog.image || PLACEHOLDER_IMAGE,
          })
        );
        setBlogs(formatted);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (!loading && blogs.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % blogs.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + blogs.length) % blogs.length);
  };

  const currentBlog = blogs[currentIndex];
  const prevBlog = blogs[(currentIndex - 1 + blogs.length) % blogs.length];
  const nextBlog = blogs[(currentIndex + 1) % blogs.length];

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Recent Blogs
            </h2>
            <p className="text-gray-600 text-lg">
              Stay updated with the latest insights and trends in real estate.
            </p>
          </div>
          <Link href="/blogs" className="inline-flex items-center gap-2 text-brand-teal font-bold hover:text-brand-red transition text-sm shrink-0">
            View All Blogs
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading blogs...</div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3 relative">
                <div className="bg-brand-red/10 rounded-2xl p-4 shadow-lg h-full relative">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition z-10"
                    aria-label="Previous"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="mt-2 space-y-1">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{prevBlog.title}</h4>
                    <p className="text-gray-600 text-xs line-clamp-2">{prevBlog.excerpt}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                      <div className="text-gray-500 text-xs">
                        <span className="font-semibold">{prevBlog.author}</span>
                      </div>
                      <div className="text-gray-400 text-xs">{prevBlog.date}</div>
                    </div>
                    <Link
                      href={`/blogs/${prevBlog._id}`}
                      className="w-full bg-brand-red text-white py-1.5 px-3 rounded-lg font-semibold hover:bg-brand-red-dark transition mt-2 text-sm text-center block"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <Link href={`/blogs/${currentBlog._id}`} className="block relative h-[300px] rounded-2xl overflow-hidden shadow-2xl group">
                  {currentBlog.image ? (
                    <SafeImage src={currentBlog.image} alt={currentBlog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="50vw" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 flex flex-col justify-end">
                    <h3 className="font-bold text-white text-xl md:text-2xl leading-tight mb-3 line-clamp-2">
                      {currentBlog.title}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
                      {currentBlog.excerpt}
                    </p>
                  </div>
                </Link>
              </div>

              <div className="lg:col-span-3 relative">
                <div className="bg-brand-red/10 rounded-2xl p-4 shadow-lg h-full relative">
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition z-10"
                    aria-label="Next"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <div className="mt-2 space-y-1">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{nextBlog.title}</h4>
                    <p className="text-gray-600 text-xs line-clamp-2">{nextBlog.excerpt}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                      <div className="text-gray-500 text-xs">
                        <span className="font-semibold">{nextBlog.author}</span>
                      </div>
                      <div className="text-gray-400 text-xs">{nextBlog.date}</div>
                    </div>
                    <Link
                      href={`/blogs/${nextBlog._id}`}
                      className="w-full bg-brand-red text-white py-1.5 px-3 rounded-lg font-semibold hover:bg-brand-red-dark transition mt-2 text-sm text-center block"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

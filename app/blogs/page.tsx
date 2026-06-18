'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Blog {
  _id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image?: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-to-br from-navy-blue via-[#1e4a7a] to-brand-teal text-white pt-28 pb-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Blogs & Insights</h1>
          <p className="text-lg text-white/80">
            Latest real estate news, tips, and market insights from FD MAKAN
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="text-center text-gray-400 py-16">Loading blogs...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-2">No blogs published yet.</p>
              <p className="text-gray-400 text-sm">Check back soon for new articles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog._id}`}
                  className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 hover:shadow-soft-lg hover:border-brand-teal/20 transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={blog.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                      <span>{blog.date}</span>
                      <span>•</span>
                      <span>{blog.author}</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-teal transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                    <span className="inline-flex items-center gap-1 mt-4 text-brand-teal font-semibold text-sm">
                      Read More
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

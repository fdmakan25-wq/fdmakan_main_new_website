'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';

interface Blog {
  _id?: string;
  id?: string | number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image?: string;
}

export default function RecentBlogs() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [databaseBlogs, setDatabaseBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo data (fallback)
  const demoBlogs = [
    {
      id: 1,
      title: "10 Tips for First-Time Home Buyers",
      author: "John Smith",
      date: "November 15, 2024",
      excerpt: "Buying your first home can be overwhelming. Here are essential tips to guide you through the process and make informed decisions.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Real Estate Investment Strategies for 2024",
      author: "Sarah Johnson",
      date: "November 12, 2024",
      excerpt: "Discover the latest trends and strategies in real estate investment that can help you maximize your returns this year.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Understanding Property Valuation",
      author: "Michael Brown",
      date: "November 10, 2024",
      excerpt: "Learn how property values are determined and what factors influence the market price of real estate properties.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
    }
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const data = await response.json();
        // Take first 3 blogs
        const formatted: Blog[] = data.slice(0, 3).map((blog: any) => ({
          _id: blog._id,
          id: blog._id,
          title: blog.title,
          author: blog.author,
          date: blog.date,
          excerpt: blog.excerpt,
          image: blog.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
        }));
        setDatabaseBlogs(formatted);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Merge database blogs with demo data (database first, then demo)
  const blogs = [
    ...databaseBlogs,
    ...demoBlogs.slice(databaseBlogs.length)
  ].slice(0, 3);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % blogs.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + blogs.length) % blogs.length);
  };

  const currentBlog = blogs[currentIndex];

  const blogHref = (blog: Blog) => (blog._id ? `/blogs/${blog._id}` : '/blogs');

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

        {/* Main Content Area */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Blog Card */}
            <div className="lg:col-span-3 relative">
              <div className="bg-brand-red/10 rounded-2xl p-4 shadow-lg h-full relative">
                {/* Navigation Arrow - Left */}
                <button
                  onClick={prevSlide}
                  className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition z-10"
                  aria-label="Previous"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Blog Image with Content Overlay */}
                <div className="mb-2">
                  <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden relative">
                    {/* Background Image Placeholder */}
                    <div className="w-full h-full flex items-center justify-center opacity-30">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {/* Text Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3 flex flex-col justify-end">
                      <h4 className="font-bold text-white text-xs leading-tight mb-1 line-clamp-1">
                        {blogs[(currentIndex - 1 + blogs.length) % blogs.length].title}
                      </h4>
                      <p className="text-white/90 text-[10px] leading-tight line-clamp-2">
                        {blogs[(currentIndex - 1 + blogs.length) % blogs.length].excerpt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Blog Details */}
                <div className="mt-2 space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm leading-tight">
                    {blogs[(currentIndex - 1 + blogs.length) % blogs.length].title}
                  </h4>
                  <p className="text-gray-600 text-xs line-clamp-2">
                    {blogs[(currentIndex - 1 + blogs.length) % blogs.length].excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                    <div className="text-gray-500 text-xs">
                      <span className="font-semibold">{blogs[(currentIndex - 1 + blogs.length) % blogs.length].author}</span>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {blogs[(currentIndex - 1 + blogs.length) % blogs.length].date}
                    </div>
                  </div>
                  <Link
                    href={blogHref(blogs[(currentIndex - 1 + blogs.length) % blogs.length])}
                    className="w-full bg-brand-red text-white py-1.5 px-3 rounded-lg font-semibold hover:bg-brand-red-dark transition mt-2 text-sm text-center block"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>

            {/* Central Large Image */}
            <div className="lg:col-span-6 relative">
              <Link href={blogHref(currentBlog)} className="block relative h-[300px] rounded-2xl overflow-hidden shadow-2xl group">
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

              {/* Top Right Thumbnail */}
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-2 z-10 max-w-[120px]">
                <div className="w-full h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded overflow-hidden mb-1">
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-700 text-center leading-tight">
                  {currentBlog.title}
                </p>
              </div>
            </div>

            {/* Right Blog Card */}
            <div className="lg:col-span-3 relative">
              <div className="bg-brand-red/10 rounded-2xl p-4 shadow-lg h-full relative">
                {/* Navigation Arrow - Right */}
                <button
                  onClick={nextSlide}
                  className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition z-10"
                  aria-label="Next"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Blog Image with Content Overlay */}
                <div className="mb-2">
                  <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden relative">
                    {/* Background Image Placeholder */}
                    <div className="w-full h-full flex items-center justify-center opacity-30">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {/* Text Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3 flex flex-col justify-end">
                      <h4 className="font-bold text-white text-xs leading-tight mb-1 line-clamp-1">
                        {blogs[(currentIndex + 1) % blogs.length].title}
                      </h4>
                      <p className="text-white/90 text-[10px] leading-tight line-clamp-2">
                        {blogs[(currentIndex + 1) % blogs.length].excerpt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Blog Details */}
                <div className="mt-2 space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm leading-tight">
                    {blogs[(currentIndex + 1) % blogs.length].title}
                  </h4>
                  <p className="text-gray-600 text-xs line-clamp-2">
                    {blogs[(currentIndex + 1) % blogs.length].excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                    <div className="text-gray-500 text-xs">
                      <span className="font-semibold">{blogs[(currentIndex + 1) % blogs.length].author}</span>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {blogs[(currentIndex + 1) % blogs.length].date}
                    </div>
                  </div>
                  <Link
                    href={blogHref(blogs[(currentIndex + 1) % blogs.length])}
                    className="w-full bg-brand-red text-white py-1.5 px-3 rounded-lg font-semibold hover:bg-brand-red-dark transition mt-2 text-sm text-center block"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


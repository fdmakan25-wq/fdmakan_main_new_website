'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  content?: string;
  image?: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          router.push('/blogs');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        router.push('/blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 pb-20 text-center text-gray-400">Loading article...</div>
        <Footer />
      </main>
    );
  }

  if (!blog) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <article>
        <div className="relative h-[45vh] min-h-[320px] mt-16">
          <Image
            src={blog.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop'}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 max-w-4xl pb-10">
            <Link href="/blogs" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blogs
            </Link>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">{blog.title}</h1>
            <div className="flex items-center gap-3 mt-4 text-white/70 text-sm">
              <span className="font-semibold text-white">{blog.author}</span>
              <span>•</span>
              <span>{blog.date}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-3xl py-12">
          <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-brand-teal pl-5">
            {blog.excerpt}
          </p>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {blog.content || blog.excerpt}
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}

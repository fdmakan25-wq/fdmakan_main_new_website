import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET - Fetch all blogs
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const blogs = await db.collection('blogs').find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(blogs, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs', message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create blog
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();

    const { title, author, date, excerpt, content, image } = body;

    if (!title || !author || !excerpt) {
      return NextResponse.json(
        { error: 'Title, author, and excerpt are required' },
        { status: 400 }
      );
    }

    const blog = {
      title,
      author,
      date: date || new Date().toLocaleDateString(),
      excerpt,
      content: content || excerpt,
      image: image || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('blogs').insertOne(blog);

    return NextResponse.json(
      { success: true, blog: { ...blog, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog', message: error.message },
      { status: 500 }
    );
  }
}



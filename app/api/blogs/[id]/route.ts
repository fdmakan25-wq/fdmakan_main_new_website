import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch single blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid blog ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const blog = await db.collection('blogs').findOne({
      _id: new ObjectId(params.id),
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog', message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid blog ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const body = await request.json();

    const { title, author, date, excerpt, content, image } = body;

    if (!title || !author || !excerpt) {
      return NextResponse.json(
        { error: 'Title, author, and excerpt are required', message: 'Title, author, and excerpt are required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      title,
      author,
      date: date || new Date().toLocaleDateString(),
      excerpt,
      content: content || excerpt,
      image: image || undefined,
      updatedAt: new Date(),
    };

    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Blog updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid blog ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection('blogs').deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Blog deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog', message: error.message },
      { status: 500 }
    );
  }
}



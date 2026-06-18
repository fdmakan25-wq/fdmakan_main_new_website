import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch single banner
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const banner = await db.collection('banners').findOne({
      _id: new ObjectId(params.id),
    });

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json(banner, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch banner', message },
      { status: 500 }
    );
  }
}

// PUT - Update banner
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { title, subtitle, image, active, order } = body;

    if (!title?.trim() || !subtitle?.trim() || !image?.trim()) {
      return NextResponse.json(
        { error: 'Title, subtitle, and banner image are required' },
        { status: 400 }
      );
    }

    const updateData = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      image: image.trim(),
      active: active !== false,
      order: typeof order === 'number' ? order : 0,
      updatedAt: new Date(),
    };

    const result = await db.collection('banners').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'Banner updated successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to update banner', message },
      { status: 500 }
    );
  }
}

// DELETE - Delete banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const result = await db.collection('banners').deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'Banner deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to delete banner', message },
      { status: 500 }
    );
  }
}

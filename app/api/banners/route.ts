import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET - Fetch all hero banners (active only for public via query)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const query = activeOnly ? { active: { $ne: false } } : {};
    const banners = await db
      .collection('banners')
      .find(query)
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    return NextResponse.json(banners, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners', message },
      { status: 500 }
    );
  }
}

// POST - Create banner
export async function POST(request: NextRequest) {
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

    const count = await db.collection('banners').countDocuments();
    const banner = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      image: image.trim(),
      active: active !== false,
      order: typeof order === 'number' ? order : count,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('banners').insertOne(banner);

    return NextResponse.json(
      { success: true, banner: { ...banner, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Failed to create banner', message },
      { status: 500 }
    );
  }
}

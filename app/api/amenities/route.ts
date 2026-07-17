import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { isDefaultAmenityName } from '@/lib/constants';

export async function GET() {
  try {
    const db = await getDatabase();
    const amenities = await db.collection('amenities').find({}).sort({ name: 1 }).toArray();

    const formatted = amenities
      .filter((item) => !isDefaultAmenityName(item.name))
      .map((item) => ({
        _id: item._id.toString(),
        name: item.name,
        icon: item.icon || '',
      }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching amenities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch amenities', message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { name, icon } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Amenity name is required' }, { status: 400 });
    }

    const trimmedName = name.trim();

    if (isDefaultAmenityName(trimmedName)) {
      return NextResponse.json(
        { error: 'This amenity is already in the default list' },
        { status: 409 }
      );
    }

    const existing = await db.collection('amenities').findOne({ name: trimmedName });
    if (existing) {
      return NextResponse.json({ error: 'This amenity already exists' }, { status: 409 });
    }

    const amenity = {
      name: trimmedName,
      icon: icon?.trim() || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('amenities').insertOne(amenity);

    return NextResponse.json(
      {
        success: true,
        amenity: { ...amenity, _id: result.insertedId.toString() },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating amenity:', error);
    return NextResponse.json(
      { error: 'Failed to create amenity', message },
      { status: 500 }
    );
  }
}

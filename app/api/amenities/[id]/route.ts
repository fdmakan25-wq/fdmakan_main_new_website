import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { isDefaultAmenityName } from '@/lib/constants';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const duplicate = await db.collection('amenities').findOne({
      name: trimmedName,
      _id: { $ne: new ObjectId(params.id) },
    });
    if (duplicate) {
      return NextResponse.json({ error: 'This amenity already exists' }, { status: 409 });
    }

    const result = await db.collection('amenities').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          name: trimmedName,
          icon: icon?.trim() || '',
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Amenity not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'Amenity updated successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating amenity:', error);
    return NextResponse.json(
      { error: 'Failed to update amenity', message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const result = await db.collection('amenities').deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Amenity not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'Amenity deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting amenity:', error);
    return NextResponse.json(
      { error: 'Failed to delete amenity', message },
      { status: 500 }
    );
  }
}

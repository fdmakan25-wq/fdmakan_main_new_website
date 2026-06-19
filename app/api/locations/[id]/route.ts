import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { name, cityId } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Location name is required' }, { status: 400 });
    }
    if (!cityId) {
      return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    const city = await db.collection('cities').findOne({ _id: new ObjectId(cityId) });
    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    const trimmedName = name.trim();
    const duplicate = await db.collection('locations').findOne({
      name: trimmedName,
      cityId: new ObjectId(cityId),
      _id: { $ne: new ObjectId(params.id) },
    });
    if (duplicate) {
      return NextResponse.json(
        { error: 'This location already exists in this city' },
        { status: 409 }
      );
    }

    const result = await db.collection('locations').updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          name: trimmedName,
          cityId: new ObjectId(cityId),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'Location updated successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Failed to update location', message },
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
    const result = await db.collection('locations').deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'Location deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting location:', error);
    return NextResponse.json(
      { error: 'Failed to delete location', message },
      { status: 500 }
    );
  }
}

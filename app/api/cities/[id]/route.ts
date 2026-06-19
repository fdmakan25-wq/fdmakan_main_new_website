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
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'City name is required' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const duplicate = await db.collection('cities').findOne({
      name: trimmedName,
      _id: { $ne: new ObjectId(params.id) },
    });
    if (duplicate) {
      return NextResponse.json({ error: 'This city already exists' }, { status: 409 });
    }

    const result = await db.collection('cities').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { name: trimmedName, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'City updated successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating city:', error);
    return NextResponse.json(
      { error: 'Failed to update city', message },
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
    const cityId = new ObjectId(params.id);

    const result = await db.collection('cities').deleteOne({ _id: cityId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    await db.collection('locations').deleteMany({ cityId });

    return NextResponse.json(
      { success: true, message: 'City and its locations deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting city:', error);
    return NextResponse.json(
      { error: 'Failed to delete city', message },
      { status: 500 }
    );
  }
}

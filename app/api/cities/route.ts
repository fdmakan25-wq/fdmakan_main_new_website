import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    const cities = await db.collection('cities').find({}).sort({ name: 1 }).toArray();
    const locations = await db.collection('locations').find({}).sort({ name: 1 }).toArray();

    const grouped = cities.map((city) => ({
      _id: city._id.toString(),
      name: city.name,
      locations: locations
        .filter((loc) => loc.cityId?.toString() === city._id.toString())
        .map((loc) => ({
          _id: loc._id.toString(),
          name: loc.name,
          cityId: city._id.toString(),
        })),
    }));

    const uncategorized = locations
      .filter((loc) => !loc.cityId)
      .map((loc) => ({
        _id: loc._id.toString(),
        name: loc.name,
        cityId: null,
      }));

    return NextResponse.json({ cities: grouped, uncategorized }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities', message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'City name is required' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const existing = await db.collection('cities').findOne({ name: trimmedName });
    if (existing) {
      return NextResponse.json({ error: 'This city already exists' }, { status: 409 });
    }

    const city = {
      name: trimmedName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('cities').insertOne(city);

    return NextResponse.json(
      { success: true, city: { ...city, _id: result.insertedId.toString(), locations: [] } },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating city:', error);
    return NextResponse.json(
      { error: 'Failed to create city', message },
      { status: 500 }
    );
  }
}

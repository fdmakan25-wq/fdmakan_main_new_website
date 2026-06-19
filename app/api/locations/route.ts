import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    const locations = await db.collection('locations').find({}).sort({ name: 1 }).toArray();
    const cities = await db.collection('cities').find({}).toArray();
    const cityMap = new Map(cities.map((c) => [c._id.toString(), c.name]));

    const enriched = locations.map((loc) => ({
      _id: loc._id.toString(),
      name: loc.name,
      cityId: loc.cityId?.toString() || null,
      cityName: loc.cityId ? cityMap.get(loc.cityId.toString()) || null : null,
    }));

    return NextResponse.json(enriched, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations', message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const existing = await db.collection('locations').findOne({
      name: trimmedName,
      cityId: new ObjectId(cityId),
    });
    if (existing) {
      return NextResponse.json(
        { error: 'This location already exists in this city' },
        { status: 409 }
      );
    }

    const location = {
      name: trimmedName,
      cityId: new ObjectId(cityId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('locations').insertOne(location);

    return NextResponse.json(
      {
        success: true,
        location: {
          ...location,
          _id: result.insertedId.toString(),
          cityId,
          cityName: city.name,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Failed to create location', message },
      { status: 500 }
    );
  }
}

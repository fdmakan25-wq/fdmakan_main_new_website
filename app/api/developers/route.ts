import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET - Fetch all developers
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const developers = await db.collection('developers').find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(developers, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (error: any) {
    console.error('Error fetching developers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch developers', message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create developer
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const body = await request.json();

    const { name, logo, description, website, establishedYear, totalProjects, rating } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Developer name is required' },
        { status: 400 }
      );
    }

    const developer = {
      name,
      logo: logo || undefined,
      description: description || undefined,
      website: website || undefined,
      establishedYear: establishedYear ? parseInt(establishedYear) : undefined,
      totalProjects: totalProjects ? parseInt(totalProjects) : undefined,
      rating: rating ? parseInt(rating) : 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('developers').insertOne(developer);

    return NextResponse.json(
      { success: true, developer: { ...developer, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating developer:', error);
    return NextResponse.json(
      { error: 'Failed to create developer', message: error.message },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch single developer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid developer ID' }, { status: 400 });
    }

    const db = await getDatabase();
    const developer = await db.collection('developers').findOne({
      _id: new ObjectId(params.id),
    });

    if (!developer) {
      return NextResponse.json(
        { error: 'Developer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(developer, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching developer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch developer', message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update developer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid developer ID' }, { status: 400 });
    }

    const db = await getDatabase();
    const body = await request.json();

    const { name, logo, description, website, establishedYear, totalProjects, rating } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Developer name is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      logo: logo || undefined,
      description: description || undefined,
      website: website || undefined,
      establishedYear: establishedYear ? parseInt(establishedYear) : undefined,
      totalProjects: totalProjects ? parseInt(totalProjects) : undefined,
      rating: rating ? parseInt(rating) : undefined,
      updatedAt: new Date(),
    };

    const result = await db.collection('developers').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Developer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Developer updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating developer:', error);
    return NextResponse.json(
      { error: 'Failed to update developer', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete developer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid developer ID' }, { status: 400 });
    }

    const db = await getDatabase();
    const result = await db.collection('developers').deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Developer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Developer deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting developer:', error);
    return NextResponse.json(
      { error: 'Failed to delete developer', message: error.message },
      { status: 500 }
    );
  }
}


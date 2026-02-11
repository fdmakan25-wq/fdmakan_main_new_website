import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch single property by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const property = await db.collection('properties').findOne({
      _id: new ObjectId(params.id),
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property', message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const body = await request.json();

    const {
      name,
      description,
      price,
      developer,
      location,
      bedrooms,
      bathrooms,
      area,
      available,
      images,
      videos,
      showInTopSelling,
      showInPremium,
      showInNewlyLaunched,
      // Highlights
      highlights,
      // Overview
      storeys,
      projectArea,
      possessionStatus,
      advertiserReraNumber,
      possessionDate,
      projectReraNumber,
      address,
      // Pricing
      pricing,
      // Amenities & Facilities
      amenities,
      facilities,
      // Specifications
      specifications,
      // Connectivity
      connectivity,
    } = body;

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (developer) updateData.developer = developer;
    if (location) updateData.location = location;
    if (bedrooms !== undefined) updateData.bedrooms = parseInt(bedrooms);
    if (bathrooms !== undefined) updateData.bathrooms = parseInt(bathrooms);
    if (area !== undefined) updateData.area = parseInt(area);
    if (available !== undefined) updateData.available = available;
    if (images) updateData.images = images;
    if (videos) updateData.videos = videos;
    if (showInTopSelling !== undefined) updateData.showInTopSelling = showInTopSelling;
    if (showInPremium !== undefined) updateData.showInPremium = showInPremium;
    if (showInNewlyLaunched !== undefined) updateData.showInNewlyLaunched = showInNewlyLaunched;
    // Highlights
    if (highlights !== undefined) updateData.highlights = highlights;
    // Overview
    if (storeys !== undefined) updateData.storeys = storeys;
    if (projectArea !== undefined) updateData.projectArea = projectArea;
    if (possessionStatus !== undefined) updateData.possessionStatus = possessionStatus;
    if (advertiserReraNumber !== undefined) updateData.advertiserReraNumber = advertiserReraNumber;
    if (possessionDate !== undefined) updateData.possessionDate = possessionDate;
    if (projectReraNumber !== undefined) updateData.projectReraNumber = projectReraNumber;
    if (address !== undefined) updateData.address = address;
    // Pricing
    if (pricing !== undefined) updateData.pricing = pricing;
    // Amenities & Facilities
    if (amenities !== undefined) updateData.amenities = amenities;
    if (facilities !== undefined) updateData.facilities = facilities;
    // Specifications
    if (specifications !== undefined) updateData.specifications = specifications;
    // Connectivity
    if (connectivity !== undefined) updateData.connectivity = connectivity;
    if (body.reraQrCode !== undefined) updateData.reraQrCode = body.reraQrCode;

    const result = await db.collection('properties').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Property updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();
    const result = await db.collection('properties').deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Property deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property', message: error.message },
      { status: 500 }
    );
  }
}


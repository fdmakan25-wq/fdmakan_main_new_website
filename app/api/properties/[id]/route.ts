import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { PropertyInputSchema } from '@/lib/validations';

// GET - Fetch single property by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid property ID format' },
        { status: 400 }
      );
    }

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
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid property ID format' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const rawBody = await request.json();

    // Validate update payload with Zod partial schema
    const parseResult = PropertyInputSchema.partial().safeParse(rawBody);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json(
        { 
          error: firstError, 
          message: firstError,
          details: parseResult.error.issues.map(i => ({ path: i.path.join('.'), message: i.message }))
        },
        { status: 400 }
      );
    }

    const {
      name,
      description,
      price,
      developer,
      city,
      location,
      listingCity,
      locality,
      listingFor,
      propertyCategory,
      propertyType,
      categoryFields,
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
    } = parseResult.data;

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (developer !== undefined) updateData.developer = developer;
    if (city !== undefined) updateData.city = city;
    if (location !== undefined) updateData.location = location;
    if (listingCity !== undefined) updateData.listingCity = listingCity;
    if (locality !== undefined) updateData.locality = locality;
    if (listingFor !== undefined) updateData.listingFor = listingFor;
    if (propertyCategory !== undefined) updateData.propertyCategory = propertyCategory;
    if (propertyType !== undefined) updateData.propertyType = propertyType;
    if (categoryFields !== undefined) updateData.categoryFields = categoryFields;
    if (bedrooms !== undefined) updateData.bedrooms = bedrooms;
    if (bathrooms !== undefined) updateData.bathrooms = bathrooms;
    if (area !== undefined) updateData.area = area;
    if (available !== undefined) updateData.available = available;
    if (images !== undefined) updateData.images = images;
    if (videos !== undefined) updateData.videos = videos;
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
    if (rawBody.reraQrCode !== undefined) updateData.reraQrCode = rawBody.reraQrCode;

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
    if (!params.id || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid property ID format' },
        { status: 400 }
      );
    }

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


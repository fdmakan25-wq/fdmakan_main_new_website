import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { uploadImage, uploadVideo } from '@/lib/cloudinary';
import { PropertyInputSchema } from '@/lib/validations';

// GET - Fetch properties (supports optional pagination and filter queries)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const searchParams = request.nextUrl.searchParams;

    // Filters
    const query: Record<string, any> = {};
    const city = searchParams.get('city');
    const category = searchParams.get('propertyCategory') || searchParams.get('category');
    const featured = searchParams.get('featured');

    if (city && city.trim() !== '') {
      query.city = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
    }
    if (category && category.trim() !== '') {
      query.propertyCategory = category.trim();
    }
    if (featured === 'topSelling') {
      query.showInTopSelling = true;
    } else if (featured === 'premium') {
      query.showInPremium = true;
    } else if (featured === 'newlyLaunched') {
      query.showInNewlyLaunched = true;
    }

    // Pagination (optional to preserve existing full array calls)
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    if (pageParam || limitParam) {
      const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(limitParam || '20', 10) || 20));
      const skip = (page - 1) * limit;

      const [properties, total] = await Promise.all([
        db.collection('properties').find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
        db.collection('properties').countDocuments(query),
      ]);

      return NextResponse.json({
        properties,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }, { status: 200 });
    }

    // Default: fetch all properties with sort
    const properties = await db.collection('properties').find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(properties, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties', message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new property
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const rawBody = await request.json();

    // Validate request body using Zod schema
    const parseResult = PropertyInputSchema.safeParse(rawBody);
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
      reraQrCode,
    } = parseResult.data;

    // Upload images to Cloudinary (if they are files, not URLs)
    const uploadedImages: string[] = [];
    for (const image of images) {
      if (image.startsWith('http://') || image.startsWith('https://')) {
        // It's a URL, use as-is or upload from URL
        uploadedImages.push(image);
      } else {
        // It's a base64 or file data, upload to Cloudinary
        // Note: In a real implementation, you'd handle file uploads properly
        uploadedImages.push(image);
      }
    }

    // Upload videos to Cloudinary (if provided)
    const uploadedVideos: string[] = [];
    if (videos && videos.length > 0) {
      for (const video of videos) {
        if (video.startsWith('http://') || video.startsWith('https://')) {
          uploadedVideos.push(video);
        } else {
          uploadedVideos.push(video);
        }
      }
    }

    // Create property document
    const property = {
      name,
      description,
      price,
      developer,
      city,
      location,
      listingCity: listingCity || undefined,
      locality: locality || undefined,
      listingFor: listingFor || undefined,
      propertyCategory: propertyCategory || undefined,
      propertyType: propertyType || undefined,
      categoryFields: categoryFields && Object.keys(categoryFields).length > 0 ? categoryFields : undefined,
      bedrooms: bedrooms ?? undefined,
      bathrooms: bathrooms ?? undefined,
      area: area ?? undefined,
      available: available !== false,
      images: uploadedImages,
      videos: uploadedVideos.length > 0 ? uploadedVideos : undefined,
      showInTopSelling: showInTopSelling || false,
      showInPremium: showInPremium || false,
      showInNewlyLaunched: showInNewlyLaunched || false,
      // Highlights
      highlights: highlights || undefined,
      // Overview
      storeys: storeys || undefined,
      projectArea: projectArea || undefined,
      possessionStatus: possessionStatus || undefined,
      advertiserReraNumber: advertiserReraNumber || undefined,
      possessionDate: possessionDate || undefined,
      projectReraNumber: projectReraNumber || undefined,
      address: address || undefined,
      // Pricing
      pricing: pricing || undefined,
      // Amenities & Facilities
      amenities: amenities || undefined,
      facilities: facilities || undefined,
      // Specifications
      specifications: specifications || undefined,
      // Connectivity
      connectivity: connectivity || undefined,
      reraQrCode: reraQrCode || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await db.collection('properties').insertOne(property);

    return NextResponse.json(
      { success: true, property: { ...property, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property', message: error.message },
      { status: 500 }
    );
  }
}


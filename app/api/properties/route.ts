import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { uploadImage, uploadVideo } from '@/lib/cloudinary';

// GET - Fetch all properties
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const properties = await db.collection('properties').find({}).sort({ createdAt: -1 }).toArray();

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
      reraQrCode,
    } = body;

    // Validate required fields with specific error messages
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Property name is required', message: 'Property name is required' },
        { status: 400 }
      );
    }
    if (!description || description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required', message: 'Description is required' },
        { status: 400 }
      );
    }
    if (!price || price === 0 || isNaN(price)) {
      return NextResponse.json(
        { error: 'Price is required and must be greater than 0', message: 'Price is required and must be greater than 0' },
        { status: 400 }
      );
    }
    if (!developer || developer.trim() === '') {
      return NextResponse.json(
        { error: 'Developer is required', message: 'Developer is required' },
        { status: 400 }
      );
    }
    if (!location || location.trim() === '') {
      return NextResponse.json(
        { error: 'Location is required', message: 'Location is required' },
        { status: 400 }
      );
    }

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required', message: 'At least one image is required' },
        { status: 400 }
      );
    }

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
      price: parseFloat(price),
      developer,
      location,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      area: area ? parseInt(area) : undefined,
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


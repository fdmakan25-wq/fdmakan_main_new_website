import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET - Fetch all orders (with optional status filter)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query = status && status !== 'all' ? { status } : {};
    const orders = await db
      .collection('orders')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new enquiry/order
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const data = await request.json();

    // Basic validation
    if (!data.type || !data.customer) {
      return NextResponse.json(
        { error: 'Invalid data', message: 'Type and customer details are required' },
        { status: 400 }
      );
    }

    // Generate a unique identifier for the inquiry
    const prefix = data.type === 'call_back' ? 'CB' : data.type === 'site_visit' ? 'SV' : 'ORD';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `${prefix}-${Date.now().toString().slice(-4)}${randomNum}`;

    const newEnquiry = {
      ...data,
      orderNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('orders').insertOne(newEnquiry);

    return NextResponse.json(
      { message: 'Inquiry submitted successfully', id: result.insertedId, orderNumber },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry', message: error.message },
      { status: 500 }
    );
  }
}

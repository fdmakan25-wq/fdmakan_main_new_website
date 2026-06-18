import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { sendEnquiryEmail, EnquiryType } from '@/lib/send-enquiry-email';

function getOrderPrefix(type: string) {
  if (type === 'call_back') return 'CB';
  if (type === 'site_visit') return 'SV';
  if (type === 'presentation') return 'PR';
  if (type === 'contact') return 'CF';
  return 'ORD';
}

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

// POST - Create a new enquiry/order and email via Resend
export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    const data = await request.json();

    if (!data.type || !data.customer) {
      return NextResponse.json(
        { error: 'Invalid data', message: 'Type and customer details are required' },
        { status: 400 }
      );
    }

    const prefix = getOrderPrefix(data.type);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `${prefix}-${Date.now().toString().slice(-4)}${randomNum}`;

    const propertyName = data.items?.[0]?.property || data.propertyName;
    const enquiryType = data.type as EnquiryType;

    const newEnquiry = {
      ...data,
      orderNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('orders').insertOne(newEnquiry);

    const emailResult = await sendEnquiryEmail({
      type: enquiryType,
      orderNumber,
      propertyName,
      customerName: data.customer?.name,
      customerEmail: data.customer?.email,
      customerPhone: data.customer?.phone,
      visitDate: data.metadata?.date,
      rideType: data.metadata?.rideType,
      subject: data.subject,
      message: data.message || data.notes,
      notes: data.notes,
    });

    if (!emailResult.sent) {
      console.warn('Enquiry saved but email not sent:', emailResult.error);
    }

    return NextResponse.json(
      {
        message: emailResult.sent
          ? 'Inquiry submitted successfully'
          : 'Inquiry saved. Email delivery is pending — our team will still follow up.',
        id: result.insertedId,
        orderNumber,
        emailSent: emailResult.sent,
        ...(process.env.NODE_ENV === 'development' && !emailResult.sent
          ? { emailError: emailResult.error }
          : {}),
      },
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

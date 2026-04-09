// src/app/api/admin/pricing/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    const pricingLists = await db.collection('pricing_lists').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: pricingLists });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    const newPricingList = {
      ...body,
      status: 'Draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('pricing_lists').insertOne(newPricingList);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("portfolio");

    const result = await db.collection('pricing_lists').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, matchedCount: result.matchedCount });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("portfolio");

    const result = await db.collection('pricing_lists').deleteOne({
      _id: new ObjectId(id)
    });

    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}
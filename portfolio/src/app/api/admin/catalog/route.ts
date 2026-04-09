import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch both collections at once to populate your frontend efficiently
    const services = await db.collection('catalog_services').find({}).toArray();
    const bundles = await db.collection('catalog_bundles').find({}).toArray();

    return NextResponse.json({ services, bundles }, { status: 200 });
  } catch (error) {
    console.error('Catalog GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const body = await req.json();
    
    // itemType tells us whether to save to the services collection or bundles collection
    const { itemType, ...data } = body; 

    if (itemType === 'service') {
      const result = await db.collection('catalog_services').insertOne(data);
      return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
    } else if (itemType === 'bundle') {
      const result = await db.collection('catalog_bundles').insertOne(data);
      return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid itemType' }, { status: 400 });
  } catch (error) {
    console.error('Catalog POST Error:', error);
    return NextResponse.json({ error: 'Failed to save item' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const body = await req.json();
    const { id, itemType, _id, ...data } = body;

    if (!id || !itemType) {
      return NextResponse.json({ error: 'Missing ID or itemType' }, { status: 400 });
    }

    const objectId = new ObjectId(id);

    if (itemType === 'service') {
      await db.collection('catalog_services').updateOne({ _id: objectId }, { $set: data });
      return NextResponse.json({ success: true }, { status: 200 });
    } else if (itemType === 'bundle') {
      await db.collection('catalog_bundles').updateOne({ _id: objectId }, { $set: data });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid itemType' }, { status: 400 });
  } catch (error) {
    console.error('Catalog PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const body = await req.json();
    const { id, itemType } = body;

    if (!id || !itemType) {
      return NextResponse.json({ error: 'Missing ID or itemType' }, { status: 400 });
    }

    const objectId = new ObjectId(id);

    if (itemType === 'service') {
      await db.collection('catalog_services').deleteOne({ _id: objectId });
      return NextResponse.json({ success: true }, { status: 200 });
    } else if (itemType === 'bundle') {
      await db.collection('catalog_bundles').deleteOne({ _id: objectId });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid itemType' }, { status: 400 });
  } catch (error) {
    console.error('Catalog DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
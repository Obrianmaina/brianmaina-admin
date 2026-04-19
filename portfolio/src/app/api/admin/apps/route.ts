import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI as string;

// Explicitly declare the global variable for TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Correctly structure the promise assignment to satisfy the linter
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const apps = await db.collection("apps").find({}).sort({ _id: -1 }).toArray();
    
    return NextResponse.json({ success: true, data: apps }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch apps" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();
    
    const newApp = {
      name: body.name,
      description: body.description,
      image: body.image,
      link: body.link,
      isVisible: body.isVisible ?? true,
      createdAt: new Date(),
    };

    const result = await db.collection("apps").insertOne(newApp);
    
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create app" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection("apps").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );
    
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update app" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    await db.collection("apps").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete app" }, { status: 500 });
  }
}
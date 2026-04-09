import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import crypto from "crypto";

// Secure session validation
async function isAuthenticated() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  const expectedToken = process.env.ADMIN_SESSION_TOKEN;

  if (!sessionCookie || !expectedToken) return false;

  const cookieBuffer = Buffer.from(sessionCookie);
  const tokenBuffer = Buffer.from(expectedToken);

  return cookieBuffer.length === tokenBuffer.length && crypto.timingSafeEqual(cookieBuffer, tokenBuffer);
}

// GET all corporate projects
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    // Sort by order first, then fallback to newest
    const corporateProjects = await db.collection("corporate").find({}).sort({ order: 1, _id: -1 }).toArray();
    
    return NextResponse.json(corporateProjects, { status: 200 });
  } catch (error) {
    console.error("Fetch Corporate API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST a new corporate entry
export async function POST(req: Request) {
  try {
    if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    const count = await db.collection("corporate").countDocuments();
    // Insert new company with initial order
    const result = await db.collection("corporate").insertOne({ ...data, order: count });
    
    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Create Corporate API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT (edit) an existing corporate project (Company info or its nested projects)
export async function PUT(req: Request) {
  try {
    if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { _id, ...updateFields } = data;

    if (!_id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("portfolio");

    const result = await db.collection("corporate").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateFields }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Update Corporate API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH (Reorder) in bulk
export async function PATCH(req: Request) {
  try {
    if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await req.json();
    if (!Array.isArray(items)) return NextResponse.json({ error: "Invalid data format" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("portfolio");

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: new ObjectId(item._id) },
        update: { $set: { order: item.order } }
      }
    }));

    await db.collection("corporate").bulkWrite(bulkOps);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Reorder Corporate API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE an entire corporate project
export async function DELETE(req: Request) {
  try {
    if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("corporate").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete Corporate API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
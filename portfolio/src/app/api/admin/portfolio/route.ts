import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import crypto from "crypto";

// Helper function to securely validate the session token
async function isAuthenticated() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session")?.value;
  const expectedToken = process.env.ADMIN_SESSION_TOKEN;

  if (!sessionCookie || !expectedToken) return false;

  const cookieBuffer = Buffer.from(sessionCookie);
  const tokenBuffer = Buffer.from(expectedToken);

  return cookieBuffer.length === tokenBuffer.length && crypto.timingSafeEqual(cookieBuffer, tokenBuffer);
}

// GET all portfolio items (Sorted by custom order, then newest)
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    const projects = await db.collection("showcases").find({}).sort({ order: 1, _id: -1 }).toArray();
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Fetch Portfolio API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST a new portfolio item
export async function POST(req: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    // Assign a default order value based on current count
    const count = await db.collection("showcases").countDocuments();
    const result = await db.collection("showcases").insertOne({ ...data, order: count, createdAt: new Date() });
    return NextResponse.json({ success: true, id: result.insertedId }, { status: 200 });
  } catch (error) {
    console.error("Create Portfolio API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT (edit) an existing portfolio item
export async function PUT(req: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...data } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing project ID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("portfolio");

    const result = await db.collection("showcases").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Update Portfolio API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE a portfolio item
export async function DELETE(req: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("showcases").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete Portfolio API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH (Reorder) portfolio items in bulk
export async function PATCH(req: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await req.json(); // Expecting an array of { _id, order }
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    // Prepare bulk write operations for MongoDB
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: new ObjectId(item._id) },
        update: { $set: { order: item.order } }
      }
    }));

    await db.collection("showcases").bulkWrite(bulkOps);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Reorder Portfolio API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
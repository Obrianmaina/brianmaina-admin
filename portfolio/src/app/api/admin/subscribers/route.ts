import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

// GET method to fetch all subscribers
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session");

    if (!adminCookie) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    // Fetch subscribers, newest first
    const subscribers = await db.collection("subscribers").find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(subscribers, { status: 200 });
  } catch (error) {
    console.error("Fetch Subscribers API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE method to remove a subscriber manually
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session");

    if (!adminCookie) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Subscriber ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    await db.collection("subscribers").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete Subscriber API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
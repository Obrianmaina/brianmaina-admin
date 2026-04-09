import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

interface QuoteUpdateData {
  updatedAt: Date;
  status?: string;
  notes?: string;
  lastContactedDate?: string;
}

// GET all quotes
export async function GET() {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session"))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("portfolio");

    const quotes = await db
      .collection("quotes")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(quotes, { status: 200 });
  } catch (error) {
    console.error("Fetch Quotes Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH to update quote status, notes, and last contacted date
export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session"))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, status, notes, lastContactedDate } = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    const updateData: QuoteUpdateData = { updatedAt: new Date() };

    if (status != null) updateData.status = status;
    if (notes != null) updateData.notes = notes;       // handles "", "some text", but not null/undefined
    if (lastContactedDate != null) updateData.lastContactedDate = lastContactedDate;

    await db.collection("quotes").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Update Quote Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST to manually add a new lead/quote from the admin dashboard
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session"))
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");

    const result = await db.collection("quotes").insertOne({
      name: body.name,
      email: body.email, 
      service: body.service,
      budget: body.budget,
      message: body.message,
      status: body.status || "New",
      createdAt: new Date(),
      lastContactedDate: new Date(), 
      notes: "",
    });

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Add Manual Lead Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
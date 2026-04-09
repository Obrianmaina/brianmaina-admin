import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

// GET all resume data (Publicly accessible)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    // Fetch all three collections concurrently for speed
    const [experience, education, skills] = await Promise.all([
      db.collection("experience").find({}).sort({ order: 1, _id: -1 }).toArray(),
      db.collection("education").find({}).sort({ order: 1, _id: -1 }).toArray(),
      db.collection("skills").find({}).toArray()
    ]);

    // Format skills to match your frontend expectation (just an array of strings, with the AI tool tip logic)
    const formattedSkills = skills.map(s => s.name);

    return NextResponse.json({ experience, education, skills: formattedSkills }, { status: 200 });
  } catch (error) {
    console.error("Fetch Resume API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST a new entry (Requires admin)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { section, ...payload } = data; // section determines which collection to use ('experience', 'education', or 'skills')
    
    const client = await clientPromise;
    const db = client.db("portfolio");

    const result = await db.collection(section).insertOne(payload);
    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Create Resume Entry API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT (Update) an existing entry (Requires admin)
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { id, section, ...payload } = data;
    
    if (!id || !section) {
      return NextResponse.json({ error: "Missing ID or section" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    // Update the specific document by its ObjectId
    const result = await db.collection(section).updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Update Resume Entry API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE an entry (Requires admin)
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, section, name } = await req.json(); // if name is provided, it's a skill
    const client = await clientPromise;
    const db = client.db("portfolio");

    if (section === 'skills') {
      await db.collection("skills").deleteOne({ name: name });
    } else {
      await db.collection(section).deleteOne({ _id: new ObjectId(id) });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete Resume Entry API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
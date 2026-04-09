import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = "portfolio";

// Fetch all comments for the admin dashboard
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Fetching all comments, sorted by newest first
    const comments = await db.collection("comments")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// Update comment status or add an admin reply
// Update comment status or add an admin reply
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { _id, status, adminReply } = body;

    if (!_id) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Define the exact shape of our update object
    interface UpdateFields {
      status?: string;
      adminReply?: string | null;
    }

    const updateFields: UpdateFields = {};
    
    if (status) updateFields.status = status;
    if (adminReply !== undefined) updateFields.adminReply = adminReply;

    const result = await db.collection("comments").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
       return NextResponse.json({ error: "No changes made or comment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Comment updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}
// Delete a comment completely
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection("comments").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
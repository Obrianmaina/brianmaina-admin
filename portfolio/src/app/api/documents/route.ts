import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");

    if (!ref) {
      return NextResponse.json({ error: "Reference number required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    // Search the transactions collection for the specific reference number
    const document = await db.collection("transactions").findOne({ referenceNumber: ref.toUpperCase() });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    console.error("Document Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
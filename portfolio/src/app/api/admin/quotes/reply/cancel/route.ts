import { NextResponse } from "next/server";
import { Resend } from "resend";
import clientPromise from "@/lib/mongodb";
import { ObjectId, Document, UpdateFilter } from "mongodb";
import { cookies } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. Define the shape of the email records to avoid 'any'
interface EmailRecord {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  resendId?: string | null;
  status: "draft" | "scheduled" | "sent";
}

// 2. Replace any[] with EmailRecord[]
interface QuoteDoc extends Document {
  emailHistory?: EmailRecord[];
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quoteId, resendId, emailId } = await req.json();

    if (!quoteId || !resendId || !emailId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Cancel in Resend (We wrap this in a try-catch so it never breaks the DB update)
    try {
      await resend.emails.cancel(resendId);
    } catch (err) {
      console.warn("Resend Cancel Notice (Ignored):", err);
    }

    // 2. Force the database to convert this email to a draft using its exact emailId
    const client = await clientPromise;
    const db = client.db("portfolio");

    const updateOperation: UpdateFilter<Document> = {
      $set: {
        "emailHistory.$.status": "draft",
        "emailHistory.$.resendId": null
      }
    };

    await db.collection<QuoteDoc>("quotes").updateOne(
      { _id: new ObjectId(quoteId), "emailHistory.id": emailId },
      updateOperation
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Email cancel error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
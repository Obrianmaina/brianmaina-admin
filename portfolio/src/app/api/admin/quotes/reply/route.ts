import { NextResponse } from "next/server";
import { Resend } from "resend";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { buildLeadReplyHtml } from "@/emails/leadReplyTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailRecord {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  resendId?: string | null;
  status: "draft" | "scheduled" | "sent";
}

interface QuoteDoc {
  _id?: ObjectId;
  status?: string;
  lastContactedDate?: string;
  emailHistory?: EmailRecord[];
}
// Add this right above the POST function
export async function GET() {
  return NextResponse.json({ 
    status: "success", 
    message: "The Inbound Email Webhook route is officially live!" 
  });
}


export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_session")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, email, subject, message, action, emailId } = await req.json();

    if (!id || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let resendData = null;
    const isDraft = action === "draft";

    if (!isDraft) {
      const sendAt = new Date(Date.now() + 60 * 1000).toISOString();
      const htmlContent: string = buildLeadReplyHtml(message);

      const { data, error } = await resend.emails.send({
        from: "Brian Maina <brian@brianmaina.de>",
        to: email,
        // Using your custom subdomain with the Name Mask for a clean look
        replyTo: `Brian Maina <reply+${id}@reply.brianmaina.de>`, 
        subject: subject,
        html: htmlContent,
        text: message,
        scheduledAt: sendAt,
      });

      if (error) {
        console.error("Resend API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      resendData = data;
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    const collection = db.collection<QuoteDoc>("quotes");

    const recordId = emailId || new ObjectId().toString();

    const emailRecord: EmailRecord = {
      id: recordId,
      subject,
      body: message,
      sentAt: new Date().toISOString(),
      resendId: resendData?.id ?? null,
      status: isDraft ? "draft" : "scheduled",
    };

    if (emailId) {
      const setFields: Record<string, unknown> = {
        "emailHistory.$": emailRecord,
      };

      if (!isDraft) {
        setFields["status"] = "Contacted";
        setFields["lastContactedDate"] = new Date().toISOString();
      }

      await collection.updateOne(
        { _id: new ObjectId(id), "emailHistory.id": emailId },
        { $set: setFields }
      );
    } else {
      if (!isDraft) {
        await collection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: "Contacted",
              lastContactedDate: new Date().toISOString(),
            },
            $push: { emailHistory: emailRecord },
          }
        );
      } else {
        await collection.updateOne(
          { _id: new ObjectId(id) },
          { $push: { emailHistory: emailRecord } }
        );
      }
    }

    return NextResponse.json({ success: true, emailRecord }, { status: 200 });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
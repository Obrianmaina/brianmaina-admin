import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
import { SentEmail } from "@/types";
import { Document, ObjectId } from "mongodb";
import { Resend } from 'resend';
import EmailReplyParser from 'email-reply-parser'; // NEW: Import the parser

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("Missing RESEND_WEBHOOK_SECRET in environment variables");
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
    }

    // 1. Get raw text body and headers for Svix verification
    const payloadString = await req.text();
    const headersList = await headers();
    
    const svix_id = headersList.get("svix-id");
    const svix_timestamp = headersList.get("svix-timestamp");
    const svix_signature = headersList.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json({ success: false, message: "Missing svix headers - Unauthorized" }, { status: 400 });
    }

    // 2. Verify the cryptographic signature
    const wh = new Webhook(webhookSecret);
    try {
      wh.verify(payloadString, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Webhook signature verification failed.", err);
      return NextResponse.json({ success: false, message: "Invalid signature - Unauthorized" }, { status: 401 });
    }

    // 3. Parse the verified JSON
    const payload = JSON.parse(payloadString);
    
    // Ensure we are processing the correct event type
    if (payload.type !== 'email.received') {
      return NextResponse.json({ success: true, message: "Ignored non-email event" });
    }

    const emailData = payload.data;
    const toAddress = Array.isArray(emailData.to) ? emailData.to[0] : emailData.to;
    const fromAddress = emailData.from;
    const subject = emailData.subject || "Re: Your Quote";
    
    // 4. Fetch the full email content from Resend using the email_id
    const resend = new Resend(process.env.RESEND_API_KEY);
    const emailId = emailData.email_id;
    let textBody = "No content provided.";

    if (emailId) {
      // Use .receiving.get() for inbound emails
      const { data: fullEmail, error } = await resend.emails.receiving.get(emailId);
      
      if (fullEmail) {
        // Use the parser to extract only the visible reply text
        const rawText = fullEmail.text || "No content provided.";
        // FIX: Added 'new' and '()' to instantiate the class
        textBody = new EmailReplyParser().read(rawText).getVisibleText();
      } else if (error) {
        console.error("Failed to fetch full email body from Resend:", error);
      }
    }

    // 5. Extract the Quote ID from the To address (e.g., reply+60f1b... @reply.brianmaina.de)
    const match = toAddress.match(/reply\+(.+)@/);
    const quoteId = match ? match[1] : null;

    const client = await clientPromise;
    const db = client.db("portfolio");

    let targetQuote = null;

    // 6. Try to find the quote using the extracted ID
    if (quoteId && ObjectId.isValid(quoteId)) {
       targetQuote = await db.collection("quotes").findOne({ _id: new ObjectId(quoteId) });
    }

    // 7. Fallback: Match by sender's email address if plus-addressing failed
    if (!targetQuote) {
        const emailMatch = fromAddress.match(/<(.+)>/);
        const cleanEmail = emailMatch ? emailMatch[1] : fromAddress;

        targetQuote = await db.collection("quotes").findOne(
            { email: cleanEmail },
            { sort: { createdAt: -1 } }
        );
    }

    if (targetQuote) {
        // Strictly type the incoming message
        const incomingMessage: SentEmail = {
            id: crypto.randomUUID(),
            subject: subject,
            body: textBody,
            sentAt: new Date().toISOString(),
            status: "received", 
        };

        // Create a strict interface WITHOUT extending the generic Document
        interface QuoteDocument {
            _id?: ObjectId;
            emailHistory: SentEmail[]; // Strictly an array, no question mark
            status: string;
        }

        // Push the client's reply into the existing email thread safely
        await db.collection<QuoteDocument>("quotes").updateOne(
            { _id: targetQuote._id },
            { 
                $push: { emailHistory: incomingMessage },
                $set: { status: "Contacted" } 
            }
        );
        
        return NextResponse.json({ success: true, message: "Reply logged successfully" });
    }

    return NextResponse.json({ success: false, message: "Quote not found for this reply" }, { status: 404 });

  } catch (error) {
    console.error("Inbound Email Webhook Error:", error);
    return NextResponse.json({ success: false, error: "Failed to process inbound email" }, { status: 500 });
  }
}
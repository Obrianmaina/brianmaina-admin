import { NextResponse } from "next/server";
import { Resend } from "resend";
import VerificationEmail from "@/emails/VerificationEmail";
import clientPromise from "@/lib/mongodb";
import { randomUUID } from "crypto";
import AdminQuoteNotificationEmail from "@/emails/AdminQuoteNotificationEmail";
import ClientThankYouEmail from "@/emails/ClientThankYouEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, service, details, newsletter, nickname } = await req.json();

    if (!email || !service || !nickname) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const verificationToken = randomUUID();
    const client = await clientPromise;
    const db = client.db("portfolio");

    // 1. SAVE THE QUOTE TO THE DATABASE FIRST
    await db.collection("quotes").insertOne({
      name: nickname,
      email: email,
      service: service,
      message: details || "None provided",
      budget: "TBD", 
      status: 'New',
      createdAt: new Date()
    });

    // 2. HANDLE NEWSLETTER SUBSCRIPTION
    if (newsletter) {
      await db.collection("subscribers").updateOne(
        { email: email },
        { 
          $set: { 
            email: email, 
            nickname: nickname,
            subscribed: false, 
            verified: false,   
            verificationToken: verificationToken, 
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        { upsert: true }
      );
    }

    // 3. COMPILE ALL EMAILS INTO AN ARRAY
    const emailsToSend = [
      {
        from: "Portfolio Form <noreply@brianmaina.de>", 
        to: "request@brianmaina.de",
        subject: `New Freelance Inquiry: ${service}`,
        react: AdminQuoteNotificationEmail({ 
          nickname: nickname, 
          email: email, 
          service: service, 
          details: details || "" 
        }),
      }
    ];

    // 4. CONDITIONALLY ADD THE CORRECT CLIENT EMAIL
    if (newsletter) {
      // User opted in: Send the combined Thank You + Verification email
      emailsToSend.push({
        from: "Brian Maina <hello@brianmaina.de>",
        to: email,
        subject: "Thanks for reaching out! (Action Required)",
        react: VerificationEmail({ 
          userEmail: email, 
          nickname: nickname, 
          token: verificationToken,
          service: service // Passing the service name to the template
        }), 
      });
    } else {
      // User did not opt in: Send the standard Thank You email
      emailsToSend.push({
        from: "Brian Maina <hello@brianmaina.de>", 
        to: email,
        subject: "Thanks for reaching out!",
        react: ClientThankYouEmail({ 
          nickname: nickname, 
          service: service 
        }),
      });
    }

    // 5. SEND EMAILS IN ONE BATCH REQUEST
    const { error } = await resend.batch.send(emailsToSend);

    if (error) {
      console.error("Resend Batch Error:", error);
      return NextResponse.json({ error: "Failed to deliver emails" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Quote API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { Resend } from "resend";
import GoodbyeEmail from "@/emails/GoodbyeEmail";
import clientPromise from "@/lib/mongodb";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    // 1. Fetch the user to get their nickname before we unsubscribe them
    const user = await db.collection("subscribers").findOne({ email: email });
    const userNickname = user?.nickname || "there"; // Fallback to "there" if not found

    // 2. Update their status
    await db.collection("subscribers").updateOne(
      { email: email },
      { 
        $set: { 
          subscribed: false,
          updatedAt: new Date()
        } 
      }
    );

    // 3. Send the personalized goodbye email
    await resend.emails.send({
      from: "Brian Maina <hello@brianmaina.de>", 
      to: email,
      subject: "You have been unsubscribed",
      react: GoodbyeEmail({ nickname: userNickname }),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Unsubscribe API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
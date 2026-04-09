import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import SubscriptionConfirmedEmail from '@/emails/SubscriptionConfirmedEmail';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    console.log("RECEIVED TOKEN FOR VERIFICATION:", token);

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid token.' }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db("portfolio");

    // Look for the user with this exact verification token
    const subscriber = await db.collection("subscribers").findOne({ verificationToken: token.trim() });

    if (!subscriber) {
      console.log("COULD NOT FIND SUBSCRIBER WITH THIS TOKEN IN DB");
      return NextResponse.json({ success: false, message: 'Invalid or expired verification link.' }, { status: 404 });
    }

    console.log("FOUND SUBSCRIBER:", subscriber.email);

    // Mark as verified and remove the token
    await db.collection("subscribers").updateOne(
      { _id: subscriber._id },
      { 
        $set: { 
          verified: true, 
          subscribed: true, 
          updatedAt: new Date() 
        },
        $unset: { verificationToken: "" }
      }
    );

    // Send the Welcome / Confirmation Email with the required props
    try {
      await resend.emails.send({
        from: 'Brian Maina <hello@brianmaina.de>', // Ensure this matches your verified Resend domain
        to: subscriber.email,
        subject: 'Subscription Confirmed! 🎉',
        react: SubscriptionConfirmedEmail({
          nickname: subscriber.nickname || subscriber.email.split('@')[0],
          userEmail: subscriber.email
        }), 
      });
      console.log("Welcome email sent to:", subscriber.email);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // We log the error but don't fail the whole request since the DB update worked
    }

    return NextResponse.json({ success: true, message: 'Subscription verified successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Error verifying subscription token:', error);
    return NextResponse.json({ success: false, message: 'An internal error occurred.' }, { status: 500 });
  }
}
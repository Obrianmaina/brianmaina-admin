import { Resend } from 'resend';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
import VerificationEmail from '@/emails/VerificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, nickname, subscriptionType } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ message: 'Invalid email address provided.' }, { status: 400 });
    }

    // Generate a unique token for the email verification link
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const mongoClient = await clientPromise;
    const db = mongoClient.db("portfolio");
    
    // Provide a fallback just in case, though the frontend requires it
    const finalNickname = nickname || email.split('@')[0];

    // Insert or update the subscriber as unverified
    await db.collection("subscribers").updateOne(
      { email: email },
      { 
        $set: { 
          email: email,
          nickname: finalNickname,
          verified: false,
          subscribed: false,
          subscriptionType: subscriptionType || 'blog',
          verificationToken: verificationToken,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    // Create the verification URL (update the domain for production)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const verifyLink = `${baseUrl}/verify?token=${verificationToken}`;

    // Send the verification email
    await resend.emails.send({
      from: 'Brian Maina <hello@brianmaina.de>', 
      to: email,
      subject: 'Please verify your blog subscription',
      react: VerificationEmail({ verifyLink: verifyLink, nickname: finalNickname }), 
    });

    return Response.json({ message: 'Verification email sent successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Subscription error:', error);
    return Response.json({ message: 'An internal error occurred.' }, { status: 500 });
  }
}
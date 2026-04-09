import { Resend } from 'resend';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
import AccessCodeEmail from '@/emails/AccessCodeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
// IMPORTANT: Make sure this DB name is what you want to use in Atlas
const DB_NAME = "portfolio_db"; 
const COLLECTION_NAME = "access_requests";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ message: 'Invalid email address provided.' }, { status: 400 });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expires_at = new Date(Date.now() + 15 * 60 * 1000); // Code expires in 15 minutes

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    
    await db.collection(COLLECTION_NAME).insertOne({
      email,
      code,
      expires_at,
      created_at: new Date(),
      used_at: null,
    });

    await resend.emails.send({
      from: 'Portfolio Access <noreply@brianmaina.de>', // Replace with your verified domain in production
      to: email,
      subject: 'Your Access Code for Brian Maina\'s Portfolio',
      react: AccessCodeEmail({ validationCode: code }),
    });

    return Response.json({ message: 'Access code sent successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Request code error:', error);
    return Response.json({ message: 'An internal error occurred.' }, { status: 500 });
  }
}

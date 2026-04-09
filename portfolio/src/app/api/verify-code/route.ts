import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = "portfolio_db";
const COLLECTION_NAME = "access_requests";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (typeof code !== 'string' || code.length === 0) {
      return Response.json({ success: false, message: 'Invalid code format.' }, { status: 400 });
    }

    const mongoClient = await clientPromise;
    const db = mongoClient.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Find a matching, un-used, and non-expired code
    const requestLog = await collection.findOne({
      code: code,
      used_at: { $eq: null },
      expires_at: { $gt: new Date() }
    });

    if (!requestLog) {
      return Response.json({ success: false, message: 'Invalid or expired code.' }, { status: 401 });
    }

    // Mark the code as used to prevent re-use
    await collection.updateOne(
      { _id: new ObjectId(requestLog._id) },
      { $set: { used_at: new Date() } }
    );
    
    // NEW: Log the email to the analytics database
    try {
      // We use the "portfolio" DB to match where your analytics page fetches data
      const analyticsDb = mongoClient.db("portfolio");
      await analyticsDb.collection("access_logs").insertOne({
        clientEmail: requestLog.email || 'Unknown Email',
        accessedAt: new Date()
      });
    } catch (logError) {
      console.error('Failed to log CV reference access:', logError);
    }

    // Parse the references from the secure environment variable
    const referencesData = process.env.SECRET_REFERENCES 
      ? JSON.parse(process.env.SECRET_REFERENCES) 
      : [];

    return Response.json({ 
      success: true, 
      message: 'Access granted',
      references: referencesData
    }, { status: 200 });

  } catch (error) {
    console.error('Error verifying code:', error);
    return Response.json({ success: false, message: 'An internal error occurred.' }, { status: 500 });
  }
}
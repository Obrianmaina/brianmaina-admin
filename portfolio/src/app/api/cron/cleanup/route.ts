import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  // Security Check: Ensure only your automated cron system can trigger this route
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    // Calculate the time for 24 hours ago
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() - 24);

    // Find and delete users who are NOT verified AND were created before the expiration date
    const result = await db.collection("subscribers").deleteMany({
      verified: false,
      createdAt: { $lt: expirationDate } // $lt means "less than" (older than)
    });

    console.log(`Cleaned up ${result.deletedCount} unverified users.`);

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    }, { status: 200 });

  } catch (error) {
    console.error("Cron Cleanup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
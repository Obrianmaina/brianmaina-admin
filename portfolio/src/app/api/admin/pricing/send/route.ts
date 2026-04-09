import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import PricingListEmail from '@/emails/PricingListEmail'; // Import the new template

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { listId } = await req.json();

    const client = await clientPromise;
    const db = client.db("portfolio"); // Use consistent DB name
    
    const pricingList = await db.collection('pricing_lists').findOne({ _id: new ObjectId(listId) });

    if (!pricingList) {
      return NextResponse.json({ error: 'Pricing list not found' }, { status: 404 });
    }

    // Send using React Email template
    await resend.emails.send({
      from: "Brian Maina <hello@brianmaina.de>",
      to: pricingList.clientEmail,
      subject: `Pricing Estimate: ${pricingList.title}`,
      react: PricingListEmail({
        clientName: pricingList.clientName,
        title: pricingList.title,
        currency: pricingList.currency,
        items: pricingList.items,
        subtotal: pricingList.subtotal,
        tax: pricingList.tax,
        totalAmount: pricingList.totalAmount,
      }),
    });

    await db.collection('pricing_lists').updateOne(
      { _id: new ObjectId(listId) },
      { $set: { status: 'Sent', updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pricing Email Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Resend } from 'resend';
import TransactionEmail from '@/emails/TransactionEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // 1. Verify the request came from Paystack
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error("Missing PAYSTACK_SECRET_KEY in Vercel environment.");
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error("Invalid Paystack Signature. The keys in Vercel might not match the Paystack environment.");
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // 2. Process the successful payment
    if (event.event === 'charge.success') {
      const paymentData = event.data;
      const reference = paymentData.reference;
      
      const invoiceId = reference.split('_')[1]; 

      // 3. Connect to MongoDB
      const client = await clientPromise;
      const db = client.db("portfolio"); 

      // 4. Fetch the original pending invoice
      const transaction = await db.collection('transactions').findOne({ 
        _id: new ObjectId(invoiceId) 
      });

      if (!transaction) {
        console.error('Transaction not found for invoice:', invoiceId);
        return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
      }

      // --- ADD THIS IDEMPOTENCY CHECK ---
      // If the webhook is a duplicate and we already processed it, stop here.
      if (transaction.status === 'paid') {
        console.log(`Invoice ${invoiceId} is already marked as paid. Ignoring duplicate webhook.`);
        return NextResponse.json({ message: 'Webhook already processed' }, { status: 200 });
      }
      // ----------------------------------
      // 5. Generate an automatic payment confirmation message
      const channel = paymentData.authorization?.channel || 'secure gateway';
      const last4 = paymentData.authorization?.last4 ? ` ending in ${paymentData.authorization.last4}` : '';
      const autoPaymentMessage = `Payment successfully processed via ${channel.toUpperCase()}${last4}. Transaction Reference: ${paymentData.reference}`;

      // Convert Paystack cents back to the exact KES amount charged
      const actualAmountPaidKES = paymentData.amount / 100;

      // 6. Update the invoice status
      await db.collection('transactions').updateOne(
        { _id: new ObjectId(invoiceId) },
        { 
          $set: { 
            status: 'paid',
            paidAt: new Date(),
            mpesaMessage: autoPaymentMessage,
            amountPaidKES: actualAmountPaidKES // Lock in the final KES value
          } 
        }
      );
      
      // 7. Send the branded receipt via Resend with strict error catching
      const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/documents`;

      const { data, error } = await resend.emails.send({
        from: "Brian Maina <hello@brianmaina.de>",
        to: transaction.clientEmail,
        subject: `Receipt from Brian Maina (#${transaction.referenceNumber})`,
        react: TransactionEmail({ 
          clientName: transaction.clientName, 
          amount: transaction.amount, 
          currency: transaction.currency || "KES",
          description: transaction.description, 
          type: 'receipt',
          referenceNumber: transaction.referenceNumber,
          downloadLink,
          mpesaMessage: autoPaymentMessage 
        }),
      });

      // If Resend rejected the email, this will log the exact reason why
      if (error) {
        console.error("Resend API rejected the email:", error);
      } else {
        console.log("Resend successfully dispatched receipt:", data);
      }
    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
    
  } catch (error) {
    console.error('Fatal Webhook Error:', error);
    return NextResponse.json({ message: 'Webhook error' }, { status: 500 });
  }
}
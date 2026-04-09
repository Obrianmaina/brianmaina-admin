import { NextResponse } from "next/server";
import { Resend } from "resend";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import TransactionEmail from "@/emails/TransactionEmail";
import crypto from 'crypto';
import { ObjectId } from 'mongodb'; 

const resend = new Resend(process.env.RESEND_API_KEY);

// GET: Fetches all transactions to display on the dashboard
export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session");

    if (!adminCookie) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const transactions = await db
      .collection("transactions")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Fetch Transactions Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Creates a new transaction and conditionally sends an email
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session");

    if (!adminCookie) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { 
        clientName, 
        clientEmail, 
        clientPhone, 
        amount, 
        currency, 
        description, 
        type, 
        mpesaMessage, 
        expenseCategory, 
        withholdingTax, 
        isCashPayment,
        disablePaystack
    } = await req.json();

    if (!clientName || !amount || !description || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type !== 'expense' && !clientEmail && !clientPhone) {
      return NextResponse.json({ error: "Client email or phone number is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    const referenceNumber = crypto.randomBytes(3).toString('hex').toUpperCase();

    const transaction = {
      clientName, 
      clientEmail: type === 'expense' ? null : (clientEmail || null),
      clientPhone: type === 'expense' ? null : (clientPhone || null),
      isCashPayment: isCashPayment || false,
      disablePaystack: disablePaystack || false,
      amount,
      currency: currency || "EUR", 
      description,
      type,
      referenceNumber,
      status: type === 'invoice' ? 'pending' : 'paid',
      date: new Date(),
      mpesaMessage: type === 'receipt' ? mpesaMessage : null,
      expenseCategory: type === 'expense' ? expenseCategory : null,
      withholdingTax: type !== 'expense' ? (withholdingTax || 0) : 0, 
    };

    const result = await db.collection("transactions").insertOne(transaction);

    // Only trigger Resend API if it is an external facing document AND an email exists
    if ((type === 'invoice' || type === 'receipt') && clientEmail) {
      const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/documents`;

      await resend.emails.send({
        from: "Brian Maina <hello@brianmaina.de>",
        to: clientEmail,
        subject: type === 'invoice' ? `Invoice from Brian Maina (#${referenceNumber})` : `Receipt from Brian Maina (#${referenceNumber})`,
        react: TransactionEmail({ 
          clientName, 
          amount, 
          currency: currency || "EUR", 
          description, 
          type, 
          referenceNumber,
          downloadLink,
          mpesaMessage: type === 'receipt' ? mpesaMessage : undefined
        }),
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Accounts API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT: Manually marks a transaction as paid and triggers a receipt
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session");

    if (!adminCookie) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Extract the new mpesaMessage property
    const { id, mpesaMessage } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");

    // Fetch the original transaction to get client details for the email
    const transaction = await db.collection("transactions").findOne({ 
      _id: new ObjectId(id) 
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Update the transaction status to paid AND save the message
    await db.collection("transactions").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'paid',
          paidAt: new Date(),
          mpesaMessage: mpesaMessage || null // Save the M-Pesa message if provided
        } 
      }
    );

    // If it was an invoice and the client has an email, send the receipt
    if (transaction.type === 'invoice' && transaction.clientEmail) {
      const downloadLink = `${process.env.NEXT_PUBLIC_BASE_URL}/documents`;

      await resend.emails.send({
        from: "Brian Maina <hello@brianmaina.de>",
        to: transaction.clientEmail,
        subject: `Receipt from Brian Maina (#${transaction.referenceNumber})`,
        react: TransactionEmail({ 
          clientName: transaction.clientName, 
          amount: transaction.amount, 
          currency: transaction.currency || "EUR", 
          description: transaction.description, 
          type: 'receipt', // Renders the email as a receipt instead of an invoice
          referenceNumber: transaction.referenceNumber,
          downloadLink,
          mpesaMessage: mpesaMessage || undefined // Pass the message to the email template
        }),
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Update Transaction Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // We only trust the email and invoiceId from the client
    const { email, invoiceId } = body;

    if (!invoiceId) {
        return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    // Connect to the database to securely fetch the true transaction details
    const client = await clientPromise;
    const db = client.db("portfolio");
    const transaction = await db.collection('transactions').findOne({ 
      _id: new ObjectId(invoiceId) 
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Retrieve original amount and currency from the database
    const originalAmount = transaction.amount;
    const originalCurrency = transaction.currency || 'KES';
    
    let amountInKES = originalAmount;
    let conversionMessage = undefined; // Will remain undefined if the currency is already KES

    // If the currency is not KES, fetch the live exchange rate and create a message
    if (originalCurrency !== 'KES') {
      try {
        const rateRes = await fetch(`https://api.exchangerate-api.com/v4/latest/${originalCurrency}`);
        const rateData = await rateRes.json();
        
        if (rateData && rateData.rates && rateData.rates.KES) {
          const conversionRate = rateData.rates.KES;
          amountInKES = originalAmount * conversionRate;
          
          // Create the transparency message for the frontend
          conversionMessage = `Your invoice of ${originalCurrency} ${originalAmount} will be processed as KES ${amountInKES.toFixed(2)}.\n\nExchange Rate used: 1 ${originalCurrency} = ${conversionRate} KES.`;
        } else {
          console.error("Exchange rate not found in API response");
          return NextResponse.json({ error: 'Currency conversion failed' }, { status: 500 });
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate during checkout:', error);
        return NextResponse.json({ error: 'Failed to process currency conversion' }, { status: 500 });
      }
    }

    // Initialize Paystack transaction STRICTLY in KES
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amountInKES * 100), // Paystack requires the lowest denomination
        currency: 'KES', 
        reference: `INV_${invoiceId}_${Date.now()}`,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`, 
      }),
    });

    const data = await response.json();

    if (data.status) {
      return NextResponse.json({ 
        checkoutUrl: data.data.authorization_url,
        conversionMessage // Pass the transparency message to the client
      });
    }

    return NextResponse.json({ error: data.message }, { status: 400 });
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
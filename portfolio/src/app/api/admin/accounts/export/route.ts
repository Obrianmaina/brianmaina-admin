import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get("admin_session");

    if (!adminCookie) {
      return new NextResponse("Unauthorized access", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") || new Date().getFullYear().toString();

    const client = await clientPromise;
    const db = client.db("portfolio");

    // Fetch transactions strictly for the requested year
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    const transactions = await db
      .collection("transactions")
      .find({
        date: { $gte: startDate, $lte: endDate },
        status: 'paid' 
      })
      .sort({ date: 1 })
      .toArray();

    // Fetch live exchange rates for fallback calculations on old transactions
    const [usdRes, eurRes, gbpRes] = await Promise.all([
      fetch('https://api.exchangerate-api.com/v4/latest/USD'),
      fetch('https://api.exchangerate-api.com/v4/latest/EUR'),
      fetch('https://api.exchangerate-api.com/v4/latest/GBP')
    ]);
    
    const usd = await usdRes.json();
    const eur = await eurRes.json();
    const gbp = await gbpRes.json();

    const rates: Record<string, number> = {
      USD: usd.rates?.KES || 1,
      EUR: eur.rates?.KES || 1,
      GBP: gbp.rates?.KES || 1,
      KES: 1
    };

    // Define KRA CSV Headers
    const headers = [
      "Date", 
      "Transaction Type", 
      "Client / Vendor Name", 
      "Description", 
      "Expense Category", 
      "Original Currency", 
      "Original Amount",
      "Amount (KES)",
      "Original WHT",
      "WHT (KES)"
    ];

    let totalGrossIncomeKES = 0;
    let totalExpensesKES = 0;
    let totalWhtKES = 0;

    // Map transactions to CSV rows
    const rows = transactions.map(tx => {
      const txDate = new Date(tx.date).toLocaleDateString('en-KE');
      const type = tx.type === 'expense' ? 'Deductible Expense' : 'Gross Income';
      
      const name = `"${(tx.clientName || '').replace(/"/g, '""')}"`;
      const desc = `"${(tx.description || '').replace(/"/g, '""')}"`;
      
      const cat = tx.type === 'expense' ? (tx.expenseCategory || 'General') : 'Service Revenue';
      const currency = tx.currency || 'EUR';
      const originalAmount = parseFloat(tx.amount || 0);
      const originalWht = parseFloat(tx.withholdingTax || 0); 
      
      const txRate = rates[currency] || 1;
      
      // Use locked KES amount if available, otherwise calculate using the rate
      const amountKES = tx.amountPaidKES ? tx.amountPaidKES : (originalAmount * txRate);
      const whtKES = originalWht * txRate;

      // Add to running totals
      if (tx.type === 'expense') {
        totalExpensesKES += amountKES;
      } else {
        totalGrossIncomeKES += amountKES;
        totalWhtKES += whtKES;
      }

      return [
        txDate, 
        type, 
        name, 
        desc, 
        cat, 
        currency, 
        originalAmount.toFixed(2), 
        amountKES.toFixed(2), 
        originalWht.toFixed(2), 
        whtKES.toFixed(2)
      ].join(",");
    });

    // Calculate final tax figures matching your dashboard logic
    const netProfit = totalGrossIncomeKES - totalExpensesKES;
    const TAX_EXEMPT_CLAUSE = 288000; // Updated to 24,000 * 12
    const taxableIncome = Math.max(0, netProfit - TAX_EXEMPT_CLAUSE);
    const grossTax = taxableIncome * 0.30; 
    const estimatedTaxDue = Math.max(0, grossTax - totalWhtKES);

    // Create summary rows at the bottom of the CSV
    const summaryRows = [
      "", // Empty row for visual spacing
      [",,,,,,", "TOTAL GROSS INCOME (KES)", totalGrossIncomeKES.toFixed(2), ""].join(","),
      [",,,,,,", "TOTAL DEDUCTIBLE EXPENSES (KES)", totalExpensesKES.toFixed(2), ""].join(","),
      [",,,,,,", "TOTAL WHT CREDITS (KES)", totalWhtKES.toFixed(2), ""].join(","),
      [",,,,,,", "NET TAXABLE INCOME (KES)", taxableIncome.toFixed(2), ""].join(","),
      [",,,,,,", "ESTIMATED FINAL TAX DUE (KES)", estimatedTaxDue.toFixed(2), ""].join(",")
    ];

    const csvContent = [headers.join(","), ...rows, ...summaryRows].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="KRA_Tax_Report_${year}.csv"`,
      },
    });

  } catch (error) {
    console.error("Export Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
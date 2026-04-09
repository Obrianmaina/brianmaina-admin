import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    
    // If your data is in a specific database, you can specify it here like client.db("portfolio")
    // Otherwise, it uses the default DB from your connection string.
    const db = client.db("portfolio");
    
    if (!db) {
      throw new Error("Database connection not established");
    }

    // DEBUG: Auto-detect correct collection casing
    let collectionNames: string[] = [];
    try {
      const collections = await db.listCollections().toArray();
      collectionNames = collections.map(c => c.name);
      console.log("✅ Connected to DB:", db.databaseName);
      console.log("📂 Found Collections:", collectionNames);
    } catch (e) {
      console.log("⚠️ Could not list collections, falling back to exact strings.");
    }

    // Helper to find the exact collection name regardless of capitalization
    const getCol = (name: string) => {
      return collectionNames.find(c => c.toLowerCase() === name.toLowerCase()) || name;
    };

    // 1. Fetch Traffic & Access Logs
    const stats = await db.collection(getCol('analytics')).find({}).toArray();
    const accessLogs = await db.collection(getCol('access_logs')).find({}).sort({ accessedAt: -1 }).limit(10).toArray();

    // 2. Fetch CRM / Lead Stats
    const crmAggregation = await db.collection(getCol('quotes')).aggregate([
      { 
        $group: { 
          _id: "$status", 
          count: { $sum: 1 } 
        } 
      }
    ]).toArray() as { _id: string | null; count: number }[];
    
    const crmStats = {
      new: crmAggregation.find((s) => s._id === 'New')?.count || 0,
      contacted: crmAggregation.find((s) => s._id === 'Contacted')?.count || 0,
      inProgress: crmAggregation.find((s) => s._id === 'In Progress')?.count || 0,
      won: crmAggregation.find((s) => s._id === 'Closed Won')?.count || 0,
      lost: crmAggregation.find((s) => s._id === 'Closed Lost')?.count || 0,
    };

    // 3. Fetch Audience / Subscriber Stats
    const totalSubscribers = await db.collection(getCol('subscribers')).countDocuments();
    const activeSubscribers = await db.collection(getCol('subscribers')).countDocuments({ verified: true, subscribed: true });

    // 4. Fetch Financial Stats (Grouping by Month)
    const financialAggregation = await db.collection(getCol('transactions')).aggregate([
      {
        $match: {
          $or: [
            { type: 'expense' },
            { type: 'receipt' },
            { type: 'invoice', status: 'paid' }
          ]
        }
      },
      {
        $group: {
          _id: { 
            // Handle dates whether they are saved as Date objects or Strings
            year: { $year: { $toDate: "$date" } }, 
            month: { $month: { $toDate: "$date" } } 
          },
          revenue: {
            $sum: {
              $cond: [
                { $in: ["$type", ["receipt", "invoice"]] }, 
                // Handle amounts whether they are saved as Numbers or Strings
                { $convert: { input: "$amount", to: "double", onError: 0, onNull: 0 } }, 
                0
              ]
            }
          },
          expenses: {
            $sum: {
              $cond: [
                { $eq: ["$type", "expense"] }, 
                { $convert: { input: "$amount", to: "double", onError: 0, onNull: 0 } }, 
                0
              ]
            }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]).toArray() as { _id: { year: number; month: number }; revenue: number; expenses: number }[];

    // Format financial data for Recharts
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const financialChartData = financialAggregation.map((item) => ({
      name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      Revenue: item.revenue,
      Expenses: item.expenses,
      Profit: item.revenue - item.expenses
    }));

    const totalRevenue = financialChartData.reduce((acc: number, curr: { Revenue: number }) => acc + curr.Revenue, 0);
    const totalExpenses = financialChartData.reduce((acc: number, curr: { Expenses: number }) => acc + curr.Expenses, 0);

    return NextResponse.json({
      success: true,
      traffic: { stats, accessLogs },
      crm: crmStats,
      audience: { total: totalSubscribers, active: activeSubscribers },
      financials: {
        chartData: financialChartData,
        totalRevenue,
        totalExpenses
      }
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}
import PayInvoiceButton from '@/components/PayInvoiceButton';
import { Invoice } from '@/types';

export default function TestPaymentPage() {
  // Dummy invoice data mimicking what would come from your MongoDB
  const dummyInvoice: Invoice = {
    _id: "64a1b2c3d4e5f6a7b8c9d0e1", // Example MongoDB ObjectId format
    clientName: "Test Client",
    clientEmail: "test@example.com",
    amount: 100, // 100 KES or USD depending on what you set below
    currency: "KES",
    isInternational: false,
    status: "pending",
    createdAt: new Date(),
  };

  return (
    <div className="p-10 max-w-md mx-auto mt-20 bg-white border rounded-xl shadow-sm text-center">
      <h1 className="text-2xl font-bold mb-4">Invoice #TEST-001</h1>
      <p className="text-gray-600 mb-2">Billed to: {dummyInvoice.clientEmail}</p>
      <p className="text-xl font-semibold mb-6">
        Total Due: {dummyInvoice.currency} {dummyInvoice.amount}
      </p>
      
      <PayInvoiceButton invoice={dummyInvoice} />
    </div>
  );
}
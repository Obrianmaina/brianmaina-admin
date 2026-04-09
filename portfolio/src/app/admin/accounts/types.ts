export type Transaction = {
    _id: string;
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
    date: string;
    type: 'invoice' | 'receipt' | 'expense';
    amount: string | number;
    currency?: string;
    status: 'paid' | 'pending';
    description: string;
    mpesaMessage?: string;
    expenseCategory?: string;
    withholdingTax?: number;
    amountPaidKES?: number;
    isCashPayment?: boolean;
    disablePaystack?: boolean;
};

export type DocType = 'invoice' | 'receipt' | 'expense';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'KES';
export type ActiveTab = 'dashboard' | 'report';

export type ModalState = {
    show: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
};

export type Rates = Record<string, number>;

export type TaxSummary = {
    grossRevenueKES: number;
    totalExpensesKES: number;
    netProfit: number;
    taxableIncome: number;
    totalWithheldTaxKES: number;
    estimatedTaxDue: number;
    totalTitheKES: number;
    freeToSpendKES: number;
};

export type MonthlyStats = {
    billed: number;
    collected: number;
    pending: number;
    expenses: number;
    wht: number;           // WHT already deducted by clients this month
    spendableNet: number;  // netProfit minus WHT (cash actually received)
    estimatedTax: number;  // progressive tax provision (advisory)
    tithe: number;
    freeToSpend: number;
};

export type ChartDataPoint = { date: string; revenue: number };
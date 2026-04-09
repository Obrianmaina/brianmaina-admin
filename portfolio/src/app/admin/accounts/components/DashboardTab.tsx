"use client";

import RevenueChart from "./RevenueChart";
import CreateRecordForm from "./CreateRecordForm";
import GeneralLedger from "./GeneralLedger";
import YearHealthBar from "./YearHealthBar";
import { Transaction, DocType, CurrencyCode, Rates, ChartDataPoint, TaxSummary } from "../types";

interface DashboardTabProps {
    allChartData: ChartDataPoint[];
    transactions: Transaction[];
    taxSummary: TaxSummary;
    markingPaid: string | null;
    onMarkAsPaid: (id: string) => void;
    // Form props
    docType: DocType; setDocType: (t: DocType) => void;
    clientName: string; setClientName: (v: string) => void;
    clientEmail: string; setClientEmail: (v: string) => void;
    clientPhone: string; setClientPhone: (v: string) => void;
    isCashPayment: boolean; setIsCashPayment: (v: boolean) => void;
    disablePaystack: boolean; setDisablePaystack: (v: boolean) => void; // Added here
    amount: string; setAmount: (v: string) => void;
    currency: CurrencyCode; setCurrency: (v: CurrencyCode) => void;
    serviceDescription: string; setServiceDescription: (v: string) => void;
    mpesaMessage: string; setMpesaMessage: (v: string) => void;
    expenseCategory: string; setExpenseCategory: (v: string) => void;
    hasWHT: boolean; setHasWHT: (v: boolean) => void;
    rates: Rates;
    isFetchingRates: boolean;
    estimatedPayoutKES: number;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export default function DashboardTab({
    allChartData, transactions, taxSummary, markingPaid, onMarkAsPaid,
    ...formProps
}: DashboardTabProps) {
    return (
        <div className="transition-colors duration-300">
            {/* Annual tax health - always shown once there's revenue */}
            <YearHealthBar taxSummary={taxSummary} />

            {/* All-time revenue chart */}
            {allChartData.length > 0 && (
                <div className="mb-8">
                    <RevenueChart
                        data={allChartData}
                        title="All-Time Revenue Volume"
                        color="#10b981"
                        gradientId="colorAllRevenue"
                        iconColor="text-emerald-500"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <CreateRecordForm {...formProps} />
                </div>
                <GeneralLedger
                    transactions={transactions}
                    markingPaid={markingPaid}
                    onMarkAsPaid={onMarkAsPaid}
                />
            </div>
        </div>
    );
}
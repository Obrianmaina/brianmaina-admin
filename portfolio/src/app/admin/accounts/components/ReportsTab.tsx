"use client";

import { Calculator, Download, Calendar, FileText, CheckCircle, Clock } from "lucide-react";
import RevenueChart from "./RevenueChart";
import { Transaction, TaxSummary, MonthlyStats, ChartDataPoint, Rates } from "../types";
import { getCurrencySymbol } from "../utils";
import DownloadDocumentBtn from "@/components/DownloadDocumentBtn";
import { DocumentData } from "@/components/pdf/DocumentTemplate";

interface ReportsTabProps {
    taxSummary: TaxSummary;
    monthlyStats: MonthlyStats;
    monthlyTransactions: Transaction[];
    monthlyChartData: ChartDataPoint[];
    reportMonth: string;
    setReportMonth: (v: string) => void;
    rates: Rates;
    markingPaid: string | null;
    onMarkAsPaid: (id: string) => void;
    onDownloadKRA: () => void;
}

export default function ReportsTab({
    taxSummary, monthlyStats, monthlyTransactions, monthlyChartData,
    reportMonth, setReportMonth, rates, markingPaid, onMarkAsPaid, onDownloadKRA
}: ReportsTabProps) {
    const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const netMonthly = monthlyStats.collected - monthlyStats.expenses;

    const getActiveBand = (netProfit: number): string => {
        if (netProfit <= 24_000) return '10%';
        if (netProfit <= 32_333) return '25%';
        if (netProfit <= 500_000) return '30%';
        if (netProfit <= 800_000) return '32.5%';
        return '35%';
    };
    const activeBand = getActiveBand(netMonthly);

    const annualTrueTax = taxSummary.estimatedTaxDue;
    const savingsBuffer = Math.max(0, monthlyStats.estimatedTax - (annualTrueTax / 12));

    const statCardsTheme = [
        { 
            icon: FileText, label: 'Total Billed Vol.', value: monthlyStats.billed, note: 'Invoices sent this month',
            theme: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-900/50', icon: 'text-amber-500 dark:text-amber-400', title: 'text-amber-800 dark:text-amber-400', val: 'text-amber-600 dark:text-amber-500', note: 'text-amber-700/70 dark:text-amber-500/70' }
        },
        { 
            icon: CheckCircle, label: 'Total Collected Vol.', value: monthlyStats.collected, note: 'Receipts issued this month',
            theme: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-900/50', icon: 'text-emerald-500 dark:text-emerald-400', title: 'text-emerald-800 dark:text-emerald-400', val: 'text-emerald-600 dark:text-emerald-500', note: 'text-emerald-700/70 dark:text-emerald-500/70' }
        },
        { 
            icon: Clock, label: 'Pending Value', value: monthlyStats.pending, note: 'Expected vs Collected',
            theme: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-900/50', icon: 'text-blue-500 dark:text-blue-400', title: 'text-blue-800 dark:text-blue-400', val: 'text-blue-600 dark:text-blue-500', note: 'text-blue-700/70 dark:text-blue-500/70' }
        },
    ];

    return (
        <div className="fade-in space-y-8 transition-colors duration-300">

            {/* Annual Summary */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm mt-8 transition-colors">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-800 pb-4 gap-4 transition-colors">
                    <div className="flex items-center">
                        <Calculator size={24} className="text-gray-800 dark:text-gray-200 mr-3 transition-colors" />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
                            Annual Financial & Allocation Summary ({new Date().getFullYear()})
                        </h3>
                    </div>
                    <button
                        onClick={onDownloadKRA}
                        className="flex items-center justify-center w-full sm:w-auto text-sm bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 py-2 px-4 rounded-xl font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        <Download size={16} className="mr-2" /> Export CSV
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    {[
                        { label: 'Gross Revenue', value: taxSummary.grossRevenueKES },
                        { label: 'Deductible Expenses', value: taxSummary.totalExpensesKES },
                        { label: 'Net Profit', value: taxSummary.netProfit },
                        { label: 'WHT Credits', value: taxSummary.totalWithheldTaxKES },
                    ].map(({ label, value }) => (
                        <div key={label} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 transition-colors">{label}</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors">KSh {fmt(value)}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 border-l-4 border-l-indigo-500 dark:border-l-indigo-500 transition-colors">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 transition-colors">Final Tax Payable</p>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 transition-colors">KSh {fmt(taxSummary.estimatedTaxDue)}</p>
                    </div>
                    <div className="p-5 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 border-l-4 border-l-purple-500 dark:border-l-purple-500 transition-colors">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 transition-colors">10% Tithe Allocation</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors">KSh {fmt(taxSummary.totalTitheKES)}</p>
                    </div>
                    <div className="p-5 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 border-l-4 border-l-emerald-500 dark:border-l-emerald-500 transition-colors">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 transition-colors">Free to Spend</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors">KSh {fmt(taxSummary.freeToSpendKES)}</p>
                    </div>
                </div>
            </div>

            {/* Month Picker */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm gap-4 transition-colors">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Monthly Snapshot</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">Select a month to view detailed statistics.</p>
                </div>
                <div className="relative w-full sm:w-auto">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                        <Calendar size={18} />
                    </div>
                    <input
                        type="month" value={reportMonth} onChange={e => setReportMonth(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-2.5 outline-none font-medium transition-colors"
                    />
                </div>
            </div>

            {/* Monthly Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCardsTheme.map(({ icon: Icon, label, value, note, theme }) => (
                    <div key={label} className={`${theme.bg} border ${theme.border} p-6 rounded-2xl transition-colors`}>
                        <div className="flex items-center mb-2">
                            <Icon size={20} className={`${theme.icon} mr-2 transition-colors`} />
                            <h4 className={`font-semibold ${theme.title} transition-colors`}>{label}</h4>
                        </div>
                        <p className={`text-3xl font-bold ${theme.val} transition-colors`}>
                            KSh {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={`text-xs ${theme.note} mt-2 transition-colors`}>{note}</p>
                    </div>
                ))}
            </div>

            {/* Monthly Chart */}
            {monthlyChartData.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 transition-colors">
                    <RevenueChart
                        data={monthlyChartData}
                        title="Monthly Revenue Trend"
                        color="#3b82f6"
                        gradientId="colorMonthlyRevenue"
                        iconColor="text-blue-500"
                    />
                </div>
            )}

            {/* Monthly Ledger Table */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors overflow-hidden">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4 transition-colors">Monthly Ledger</h3>
                {monthlyTransactions.length > 0 ? (
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 pb-4">
                        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 uppercase text-xs transition-colors">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Date</th>
                                    <th className="px-4 py-3">Vendor / Client</th>
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Orig. Amount</th>
                                    <th className="px-4 py-3 text-right">Amount (KES)</th>
                                    <th className="px-4 py-3 text-center rounded-r-lg">PDF</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyTransactions.map(tx => {
                                    const amt = parseFloat(String(tx.amount));
                                    const txRate = rates[tx.currency || 'EUR'] || 1;
                                    const kesAmount = tx.amountPaidKES ?? amt * txRate;
                                    return (
                                        <tr key={tx._id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {new Date(tx.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 transition-colors">
                                                {tx.clientName}
                                            </td>
                                            <td className="px-4 py-3">
                                                {tx.description}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
                                                        tx.type === 'expense' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                                                            : tx.status === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                                        }`}>
                                                        {tx.type === 'expense' ? 'EXPENSE' : tx.status.toUpperCase()}
                                                    </span>
                                                    {tx.type === 'invoice' && tx.status === 'pending' && (
                                                        <button
                                                            onClick={() => onMarkAsPaid(tx._id)}
                                                            disabled={markingPaid === tx._id}
                                                            className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded font-semibold transition-colors disabled:opacity-50"
                                                        >
                                                            {markingPaid === tx._id ? "..." : "Mark Paid"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`font-medium transition-colors ${
                                                    tx.type === 'receipt' ? 'text-green-600 dark:text-green-400'
                                                        : tx.type === 'expense' ? 'text-rose-600 dark:text-rose-400'
                                                            : 'text-gray-900 dark:text-gray-100'
                                                    }`}>
                                                    {tx.type === 'expense' ? '-' : ''}
                                                    {getCurrencySymbol(tx.currency || 'EUR')}{amt.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-800 dark:text-gray-200 transition-colors">
                                                {tx.type === 'expense' ? '-' : ''}KSh {fmt(kesAmount)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <DownloadDocumentBtn
                                                    data={tx as DocumentData}
                                                    type={tx.type === 'expense' ? 'expense' : (tx.status === 'paid' || tx.type === 'receipt' ? 'receipt' : 'invoice')}
                                                    iconOnly
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                            <tfoot className="border-t-2 border-gray-200 dark:border-gray-800 transition-colors">
                                <tr className="bg-gray-50 dark:bg-gray-800/50 transition-colors">
                                    <td colSpan={4} className="px-4 py-3 text-right uppercase text-xs tracking-wider font-bold text-gray-700 dark:text-gray-300">
                                        Total Income (Collected)
                                    </td>
                                    <td colSpan={2} className="px-4 py-3 text-right text-base font-bold text-emerald-600 dark:text-emerald-500">
                                        KSh {fmt(monthlyStats.collected)}
                                    </td>
                                    <td />
                                </tr>
                                <tr className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 transition-colors">
                                    <td colSpan={4} className="px-4 py-3 text-right uppercase text-xs tracking-wider font-bold text-gray-700 dark:text-gray-300">
                                        Total Expenses
                                    </td>
                                    <td colSpan={2} className="px-4 py-3 text-right text-base font-bold text-rose-600 dark:text-rose-500">
                                        - KSh {fmt(monthlyStats.expenses)}
                                    </td>
                                    <td />
                                </tr>
                                <tr className="border-t border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 transition-colors">
                                    <td colSpan={4} className="px-4 py-3 text-right uppercase text-sm tracking-wider font-normal text-gray-900 dark:text-gray-100">
                                        Net Monthly Result
                                    </td>
                                    <td colSpan={2} className={`px-4 py-3 text-right text-lg font-normal transition-colors ${netMonthly >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                        KSh {fmt(netMonthly)}
                                    </td>
                                    <td />
                                </tr>
                                {monthlyStats.wht > 0 && (
                                    <tr className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 transition-colors">
                                        <td colSpan={4} className="px-4 py-3 text-right uppercase text-xs tracking-wider font-bold text-gray-500 dark:text-gray-400">
                                            WHT Already Deducted by Clients
                                            <span className="ml-1 normal-case font-normal text-gray-400 dark:text-gray-500">(real money withheld)</span>
                                        </td>
                                        <td colSpan={2} className="px-4 py-3 text-right text-base font-bold text-gray-500 dark:text-gray-400">
                                            - KSh {fmt(monthlyStats.wht)}
                                        </td>
                                        <td />
                                    </tr>
                                )}
                                <tr className="border-t border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-900/50 transition-colors">
                                    <td colSpan={4} className="px-4 py-3 text-right uppercase text-xs tracking-wider font-bold text-slate-700 dark:text-slate-300">
                                        Spendable Net
                                        <span className="ml-1 normal-case font-normal text-slate-400 dark:text-slate-500">(cash in your account)</span>
                                    </td>
                                    <td colSpan={2} className="px-4 py-3 text-right text-base font-bold text-slate-700 dark:text-slate-300">
                                        KSh {fmt(monthlyStats.spendableNet)}
                                    </td>
                                    <td />
                                </tr>
                                <tr className="border-t-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 transition-colors">
                                    <td colSpan={4} className="px-4 py-3 text-right uppercase text-xs tracking-wider font-bold text-amber-700 dark:text-amber-500">
                                        Tax Provision
                                        <span className="ml-1 normal-case font-normal text-amber-500 dark:text-amber-600/70"> set aside monthly, see Annual Summary for true liability</span>
                                    </td>
                                    <td colSpan={2} className="px-4 py-3 text-right text-base font-bold text-amber-700 dark:text-amber-500">
                                        ~ KSh {fmt(monthlyStats.estimatedTax)}
                                    </td>
                                    <td />
                                </tr>
                                <tr className="border-t border-amber-200 dark:border-amber-900/50 bg-purple-50 dark:bg-purple-900/20 transition-colors">
                                    <td colSpan={4} className="px-4 py-3 text-right uppercase text-xs tracking-wider font-normal text-purple-900 dark:text-purple-400">
                                        10% Tithe Allocation
                                    </td>
                                    <td colSpan={2} className="px-4 py-3 text-right text-base font-normal text-purple-700 dark:text-purple-400">
                                        KSh {fmt(monthlyStats.tithe)}
                                    </td>
                                    <td />
                                </tr>
                                <tr className="border-t border-purple-200 dark:border-purple-900/50 bg-emerald-100 dark:bg-emerald-900/30 transition-colors">
                                    <td colSpan={4} className="px-4 py-4 text-right uppercase text-sm tracking-wider font-normal text-emerald-900 dark:text-emerald-400">
                                        Free to Spend
                                    </td>
                                    <td colSpan={2} className="px-4 py-4 text-right text-xl font-normal text-emerald-700 dark:text-emerald-500">
                                        KSh {fmt(monthlyStats.freeToSpend)}
                                    </td>
                                    <td />
                                </tr>
                            </tfoot>
                        </table>

                        <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-xl overflow-hidden transition-colors">
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-amber-200 dark:border-amber-900/50 bg-amber-100/60 dark:bg-amber-900/40 transition-colors">
                                <span className="text-amber-600 dark:text-amber-500 text-sm">⚠</span>
                                <p className="text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wide transition-colors">
                                    Why does Free to Spend differ from the Annual Summary?
                                </p>
                            </div>
                            <div className="px-4 py-3 space-y-2">
                                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed transition-colors">
                                    This ledger uses Kenya&apos;s <span className="font-bold">monthly tax bands</span> as a saving discipline,
                                    treating this month as if it were recurring. With{" "}
                                    <span className="font-bold text-amber-900 dark:text-amber-200">KSh {fmt(monthlyStats.collected)}</span> collected and{" "}
                                    <span className="font-bold text-amber-900 dark:text-amber-200">KSh {fmt(netMonthly)}</span> net profit, income is taxed
                                    progressively across all bands, reaching a top rate of{" "}
                                    <span className="font-bold text-amber-900 dark:text-amber-200">{activeBand}</span>, pushing the monthly tax provision to{" "}
                                    <span className="font-bold text-amber-900 dark:text-amber-200">~KSh {fmt(monthlyStats.estimatedTax)}</span>.
                                </p>
                                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed transition-colors">
                                    The <span className="font-bold text-amber-900 dark:text-amber-200">Annual Summary</span> applies the annual bands to your actual
                                    YTD total of <span className="font-bold text-amber-900 dark:text-amber-200">KSh {fmt(taxSummary.grossRevenueKES)}</span>, giving a true
                                    KRA liability of <span className="font-bold text-amber-900 dark:text-amber-200">KSh {fmt(annualTrueTax)}</span>{" "}
                                    (~KSh {fmt(annualTrueTax / 12)}/mo equivalent). That number is always lower
                                    unless you earn this exact amount every month all year.
                                </p>
                                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1 bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800/50 rounded-lg px-3 py-2 transition-colors">
                                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-0.5">Monthly Provision</p>
                                        <p className="text-sm font-normal text-amber-700 dark:text-amber-400">KSh {fmt(monthlyStats.estimatedTax)}</p>
                                        <p className="text-[10px] text-amber-500 dark:text-amber-600 mt-0.5">Set aside this month</p>
                                    </div>
                                    <div className="flex items-center justify-center text-amber-400 dark:text-amber-700 font-bold text-sm px-1">vs</div>
                                    <div className="flex-1 bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800/50 rounded-lg px-3 py-2 transition-colors">
                                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-0.5">Annual ÷ 12</p>
                                        <p className="text-sm font-normal text-amber-700 dark:text-amber-400">KSh {fmt(annualTrueTax / 12)}</p>
                                        <p className="text-[10px] text-amber-500 dark:text-amber-600 mt-0.5">True KRA liability per month</p>
                                    </div>
                                    <div className="flex items-center justify-center text-amber-400 dark:text-amber-700 font-bold text-sm px-1">=</div>
                                    <div className="flex-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg px-3 py-2 transition-colors">
                                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider mb-0.5">Buffer Saved</p>
                                        <p className="text-sm font-normal text-emerald-700 dark:text-emerald-400">KSh {fmt(savingsBuffer)}</p>
                                        <p className="text-[10px] text-emerald-500 dark:text-emerald-600/70 mt-0.5">Extra cushion vs KRA bill</p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-amber-700 dark:text-amber-500/80 pt-2 mt-2 border-t border-amber-200 dark:border-amber-900/50 transition-colors">
                                    <span className="font-bold text-amber-900 dark:text-amber-400">Use the Annual Summary</span> for what you actually owe KRA.
                                    Use this monthly provision to stay disciplined, the KSh {fmt(savingsBuffer)} buffer
                                    each month compounds into a <span className="font-bold text-amber-900 dark:text-amber-400">KSh {fmt(savingsBuffer * 12)} annual cushion</span> if income stays consistent.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-6 transition-colors">No transactions recorded in this month.</p>
                )}
            </div>
        </div>
    );
}
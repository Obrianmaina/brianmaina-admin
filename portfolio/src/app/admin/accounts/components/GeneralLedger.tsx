"use client";

import { Receipt } from "lucide-react";
import { Transaction } from "../types";
import { getCurrencySymbol } from "../utils";
import DownloadDocumentBtn from "@/components/DownloadDocumentBtn";
import { DocumentData } from "@/components/pdf/DocumentTemplate";

interface GeneralLedgerProps {
    transactions: Transaction[];
    markingPaid: string | null;
    onMarkAsPaid: (id: string) => void;
}

export default function GeneralLedger({ transactions, markingPaid, onMarkAsPaid }: GeneralLedgerProps) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-2xl flex flex-col h-full shadow-lg dark:shadow-none max-h-[600px] transition-colors duration-300">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-6 shrink-0 transition-colors">
                <Receipt size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 shrink-0 transition-colors">General Ledger</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 shrink-0 transition-colors">Your recent transaction history.</p>

            <div className="mt-auto space-y-2 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                {transactions.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center transition-colors">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No transactions recorded yet.</p>
                    </div>
                ) : (
                    transactions.slice(0, 10).map(tx => {
                        const amt = parseFloat(String(tx.amount)).toFixed(2);
                        const amtColor = tx.type === 'receipt' ? 'text-green-600 dark:text-green-400'
                            : tx.type === 'expense' ? 'text-rose-600 dark:text-rose-400'
                            : 'text-gray-900 dark:text-gray-100';
                        const amtPrefix = tx.type === 'receipt' ? '+' : tx.type === 'expense' ? '-' : '';
                        const statusColor = tx.type === 'expense' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                            : tx.status === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
                        const statusLabel = tx.type === 'expense' ? 'EXPENSE'
                            : tx.status.toUpperCase();

                        return (
                            <div
                                key={tx._id}
                                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 rounded-xl px-4 py-3 flex items-center gap-3 transition-colors"
                            >
                                {/* Left: name + date - now wider */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm transition-colors">
                                        {tx.clientName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 transition-colors">
                                        {new Date(tx.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>

                                {/* Right: status on top, amount below, actions beside */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${statusColor}`}>
                                            {statusLabel}
                                        </span>
                                        <span className={`text-sm font-bold tabular-nums transition-colors ${amtColor}`}>
                                            {amtPrefix}{getCurrencySymbol(tx.currency || 'EUR')}{amt}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-2 transition-colors">
                                        {tx.type === 'invoice' && tx.status === 'pending' && (
                                            <button
                                                onClick={() => onMarkAsPaid(tx._id)}
                                                disabled={markingPaid === tx._id}
                                                className="text-[10px] bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg transition-colors disabled:opacity-50 font-medium whitespace-nowrap"
                                            >
                                                {markingPaid === tx._id ? "…" : "Mark paid"}
                                            </button>
                                        )}

                                        <DownloadDocumentBtn
                                            data={tx as DocumentData}
                                            type={tx.type === 'expense' ? 'expense' : (tx.status === 'paid' || tx.type === 'receipt' ? 'receipt' : 'invoice')}
                                            iconOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
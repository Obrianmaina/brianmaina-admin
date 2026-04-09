"use client";

import { TaxSummary } from "../types";
import { AlertTriangle, TrendingUp, ShieldCheck, Landmark, ChevronRight } from "lucide-react";

interface YearHealthBarProps {
    taxSummary: TaxSummary;
}

export default function YearHealthBar({ taxSummary }: YearHealthBarProps) {
    if (taxSummary.grossRevenueKES === 0) return null;

    const fmt = (n: number) =>
        n.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

    const year = new Date().getFullYear();

    const whtCoverage = taxSummary.estimatedTaxDue === 0
        ? 100
        : Math.min(100, Math.round(
            (taxSummary.totalWithheldTaxKES /
                (taxSummary.estimatedTaxDue + taxSummary.totalWithheldTaxKES)) * 100
          ));

    const fullyCovered = taxSummary.estimatedTaxDue === 0;
    const instalmentDue = taxSummary.estimatedTaxDue > 40_000;

    // Year progress — how far through the year are we
    const now = new Date();
    const yearProgress = Math.round(
        ((now.getMonth() * 30 + now.getDate()) / 365) * 100
    );

    return (
        <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">

            {/* ── Dark header ── */}
            <div className="bg-gray-900 dark:bg-gray-950 px-6 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                        <Landmark size={17} className="text-amber-400" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-base leading-tight transition-colors">{year} Tax Overview</p>
                        <p className="text-gray-400 text-xs mt-0.5 transition-colors">Year-to-date · KRA annual return</p>
                    </div>
                </div>

                {/* Status pill */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    fullyCovered
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-amber-400'
                        : instalmentDue
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>
                    {fullyCovered
                        ? <><ShieldCheck size={12} /> WHT fully covers liability</>
                        : instalmentDue
                        ? <><AlertTriangle size={12} /> Instalment tax required</>
                        : <><TrendingUp size={12} /> Tax provision on track</>
                    }
                </div>
            </div>

            {/* ── Dual progress bars ── */}
            <div className="bg-gray-800 dark:bg-gray-900 px-6 py-4 space-y-3 transition-colors">

                {/* WHT coverage bar */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest transition-colors">WHT Coverage</p>
                        <p className="text-[11px] font-bold text-gray-300 transition-colors">{whtCoverage}%</p>
                    </div>
                    <div className="h-1.5 bg-gray-700 dark:bg-gray-800 rounded-full overflow-hidden transition-colors">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ${fullyCovered ? 'bg-emerald-400' : 'bg-indigo-400'}`}
                            style={{ width: `${whtCoverage}%` }}
                        />
                    </div>
                </div>

                {/* Year elapsed bar */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest transition-colors">Year Elapsed</p>
                        <p className="text-[11px] font-bold text-gray-300 transition-colors">{yearProgress}%</p>
                    </div>
                    <div className="h-1.5 bg-gray-700 dark:bg-gray-800 rounded-full overflow-hidden transition-colors">
                        <div
                            className="h-full rounded-full bg-gray-500 dark:bg-gray-600 transition-all duration-700"
                            style={{ width: `${yearProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ── 2×2 stat tiles — forced 2 columns at all breakpoints ── */}
            <div className="bg-white dark:bg-gray-900 grid grid-cols-2 border-t border-gray-100 dark:border-gray-800 transition-colors">
                {/* Tax Payable — top left */}
                <div className="p-5 flex flex-col gap-1 border-r border-b border-gray-100 dark:border-gray-800 transition-colors">
                    <div className={`self-start px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 transition-colors ${
                        fullyCovered ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                    }`}>
                        Tax Payable
                    </div>
                    <p className={`text-2xl font-black tabular-nums leading-none transition-colors ${
                        fullyCovered ? 'text-emerald-600 dark:text-emerald-500' : 'text-indigo-600 dark:text-indigo-400'
                    }`}>
                        KSh {fmt(taxSummary.estimatedTaxDue)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight mt-1 transition-colors">
                        {fullyCovered ? 'Fully offset by WHT ✓' : 'Outstanding after WHT'}
                    </p>
                </div>

                {/* WHT Credits — top right */}
                <div className="p-5 flex flex-col gap-1 border-b border-gray-100 dark:border-gray-800 transition-colors">
                    <div className="self-start px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 transition-colors">
                        WHT Credits
                    </div>
                    <p className="text-2xl font-black tabular-nums leading-none text-blue-600 dark:text-blue-400 transition-colors">
                        KSh {fmt(taxSummary.totalWithheldTaxKES)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight mt-1 transition-colors">Withheld by clients</p>
                </div>

                {/* Net Profit — bottom left */}
                <div className="p-5 flex flex-col gap-1 border-r border-gray-100 dark:border-gray-800 transition-colors">
                    <div className={`self-start px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 transition-colors ${
                        taxSummary.netProfit >= 0 ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                    }`}>
                        Net Profit
                    </div>
                    <p className={`text-2xl font-black tabular-nums leading-none transition-colors ${
                        taxSummary.netProfit >= 0 ? 'text-gray-800 dark:text-gray-100' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                        KSh {fmt(taxSummary.netProfit)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight mt-1 transition-colors">Revenue minus expenses</p>
                </div>

                {/* Free to Spend — bottom right */}
                <div className={`p-5 flex flex-col gap-1 transition-colors ${
                    taxSummary.freeToSpendKES >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'bg-rose-50 dark:bg-rose-900/10'
                }`}>
                    <div className={`self-start px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-1 transition-colors ${
                        taxSummary.freeToSpendKES >= 0 ? 'bg-emerald-200 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400' : 'bg-rose-200 dark:bg-rose-900/40 text-rose-800 dark:text-rose-400'
                    }`}>
                        Free to Spend
                    </div>
                    <p className={`text-2xl font-black tabular-nums leading-none transition-colors ${
                        taxSummary.freeToSpendKES >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                        KSh {fmt(taxSummary.freeToSpendKES)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight mt-1 transition-colors">After tax + tithe</p>
                </div>
            </div>

            {/* ── Instalment nudge (conditional) ── */}
            {instalmentDue && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border-t border-amber-200 dark:border-amber-900/50 px-6 py-3 flex items-start gap-3 transition-colors">
                    <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed flex-1 transition-colors">
                        <span className="font-bold">Quarterly instalments required.</span>{" "}
                        KSh {fmt(taxSummary.estimatedTaxDue)} outstanding exceeds the KSh 40,000 KRA threshold.
                        Pay <span className="font-bold">25% (KSh {fmt(taxSummary.estimatedTaxDue / 4)})</span> by{" "}
                        <span className="font-bold">20th Apr · 20th Jun · 20th Sep · 20th Dec</span>.
                    </p>
                    <ChevronRight size={14} className="text-amber-400 dark:text-amber-600 mt-0.5 shrink-0" />
                </div>
            )}
        </div>
    );
}
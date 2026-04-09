"use client";

import { useState, useEffect } from "react";
import { Transaction, Rates } from "../types";

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [rates, setRates] = useState<Rates>({ USD: 1, EUR: 1, GBP: 1, KES: 1 });
    const [isFetchingRates, setIsFetchingRates] = useState(false);

    const fetchTransactions = async () => {
        try {
            const res = await fetch("/api/admin/accounts");
            if (res.ok) setTransactions(await res.json());
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        }
    };

    useEffect(() => { fetchTransactions(); }, []);

    useEffect(() => {
        const fetchAllRates = async () => {
            setIsFetchingRates(true);
            try {
                const [usdRes, eurRes, gbpRes] = await Promise.all([
                    fetch('/api/exchange-rate?base=USD'),
                    fetch('/api/exchange-rate?base=EUR'),
                    fetch('/api/exchange-rate?base=GBP'),
                ]);
                const [usd, eur, gbp] = await Promise.all([
                    usdRes.json(), eurRes.json(), gbpRes.json(),
                ]);
                setRates({ USD: usd.rate || 1, EUR: eur.rate || 1, GBP: gbp.rate || 1, KES: 1 });
            } catch (error) {
                console.error("Failed to fetch rates", error);
            } finally {
                setIsFetchingRates(false);
            }
        };
        fetchAllRates();
    }, []);

    return { transactions, rates, isFetchingRates, fetchTransactions };
}

export const getCurrencySymbol = (currencyCode: string): string => {
    switch (currencyCode) {
        case 'USD': return '$';
        case 'EUR': return '€';
        case 'GBP': return '£';
        case 'KES': return 'KSh';
        default: return currencyCode;
    }
};

export const formatYAxis = (tickItem: number): string => `${tickItem}`;

export const toMonthString = (date: Date): string =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

/**
 * Kenya progressive annual tax bands (effective 1 July 2023).
 * Pass annual net profit -> returns annual tax AFTER personal relief.
 * KRA bands: 288k@10%, 100k@25%, 5.612M@30%, 3.6M@32.5%, rest@35%
 * Personal relief: KSh 28,800/yr
 */
export function calcAnnualTax(annualNetProfit: number): number {
    const bands = [
        { limit: 288_000,   rate: 0.10  },
        { limit: 100_000,   rate: 0.25  },
        { limit: 5_612_000, rate: 0.30  },
        { limit: 3_600_000, rate: 0.325 },
        { limit: Infinity,  rate: 0.35  },
    ];
    let remaining = Math.max(0, annualNetProfit);
    let tax = 0;
    for (const { limit, rate } of bands) {
        if (remaining <= 0) break;
        const taxable = Math.min(remaining, limit);
        tax += taxable * rate;
        remaining -= taxable;
    }
    const PERSONAL_RELIEF_ANNUAL = 28_800;
    return Math.max(0, tax - PERSONAL_RELIEF_ANNUAL);
}

/**
 * Kenya progressive monthly tax bands (effective 1 July 2023).
 * Pass monthly net profit -> returns monthly tax AFTER personal relief.
 * KRA bands: 24k@10%, 8,333@25%, 467,667@30%, 300k@32.5%, rest@35%
 * Personal relief: KSh 2,400/mo
 */
export function calcMonthlyTax(monthlyNetProfit: number): number {
    const bands = [
        { limit: 24_000,   rate: 0.10  },
        { limit: 8_333,    rate: 0.25  },
        { limit: 467_667,  rate: 0.30  },
        { limit: 300_000,  rate: 0.325 },
        { limit: Infinity, rate: 0.35  },
    ];
    let remaining = Math.max(0, monthlyNetProfit);
    let tax = 0;
    for (const { limit, rate } of bands) {
        if (remaining <= 0) break;
        const taxable = Math.min(remaining, limit);
        tax += taxable * rate;
        remaining -= taxable;
    }
    const PERSONAL_RELIEF_MONTHLY = 2_400;
    return Math.max(0, tax - PERSONAL_RELIEF_MONTHLY);
}

/**
 * Masks the account balance in a standard M-PESA SMS string.
 * @param message The raw M-PESA SMS string
 * @returns The sanitized string with the balance hidden
 */
export function maskMpesaBalance(message: string): string {
    if (!message) return '';
    const balanceRegex = /New M-PESA balance is Ksh[\d,.]+/i;
    return message.replace(balanceRegex, 'New M-PESA balance is Ksh ***');
}
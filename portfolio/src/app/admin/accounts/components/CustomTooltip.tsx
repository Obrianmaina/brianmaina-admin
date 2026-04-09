interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number | string }[];
    label?: string;
}

export default function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800 shadow-xl dark:shadow-none rounded-xl transition-colors duration-300">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mb-1 transition-colors">{label}</p>
            <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg transition-colors">
                {Number(payload[0].value).toFixed(2)}
            </p>
        </div>
    );
}
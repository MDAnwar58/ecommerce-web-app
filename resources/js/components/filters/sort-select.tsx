import { ArrowUpDown } from 'lucide-react';

type SortSelectProps = {
    value: string;
    onChange: (value: string) => void;
};

const options = [
    { label: 'Latest', value: 'latest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Best Rating', value: 'rating' },
    { label: 'Most Popular', value: 'popular' },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
    return (
        <div className="flex items-center gap-2">
            <ArrowUpDown className="size-4 text-muted-foreground shrink-0" />
            <select
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

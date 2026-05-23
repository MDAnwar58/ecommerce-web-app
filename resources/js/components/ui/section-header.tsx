import { Link } from '@inertiajs/react';

type SectionHeaderProps = {
    title: string;
    subtitle?: string;
    link?: { label: string; href: string };
};

export function SectionHeader({ title, subtitle, link }: SectionHeaderProps) {
    return (
        <div className="flex items-end justify-between mb-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-1 text-muted-foreground text-sm">
                        {subtitle}
                    </p>
                )}
            </div>
            {link && (
                <Link
                    href={link.href}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors shrink-0"
                >
                    {link.label} &rarr;
                </Link>
            )}
        </div>
    );
}

import { Head, Link, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Users } from 'lucide-react';
import admin from '@/routes/admin';
import { formatCurrency } from '@/lib/format';
import { Price } from '@/components/price';
import type { User } from '@/types/ecommerce';

type CustomersIndexProps = {
    customers: {
        data: User[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters?: { search?: string };
};

export default function CustomersIndex({ customers, filters }: CustomersIndexProps) {
    const { currency } = usePage().props as { currency?: string };
    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        router.get(admin.customers.index().url, {
            search: formData.get('search') || undefined,
        }, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Customers" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                    <p className="text-sm text-muted-foreground mt-1">View and manage your customers</p>
                </div>

                <Card>
                    <CardHeader>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    name="search"
                                    placeholder="Search by name or email..."
                                    defaultValue={filters?.search}
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>
                    </CardHeader>
                    <CardContent>
                        {customers.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Users className="size-12 mb-3 opacity-40" />
                                <p className="text-sm">No customers found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="pb-3 font-medium text-muted-foreground">Name</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Email</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Phone</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Orders</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Total Spent</th>
                                            <th className="pb-3 font-medium text-muted-foreground">Joined</th>
                                            <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.data.map((customer) => (
                                            <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                            {customer.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <Link href={admin.customers.show(customer.id).url} className="font-medium hover:underline">
                                                            {customer.name}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-muted-foreground">{customer.email}</td>
                                                <td className="py-3 text-muted-foreground">{customer.phone || '—'}</td>
                                                <td className="py-3">{'orders_count' in customer ? (customer as any).orders_count : '—'}</td>
                                                <td className="py-3">
                                                    {'total_spent' in customer ? <Price amount={(customer as any).total_spent} currency={currency} /> : '—'}
                                                </td>
                                                <td className="py-3 text-muted-foreground text-xs">{'created_at' in customer ? new Date((customer as any).created_at).toLocaleDateString() : '—'}</td>
                                                <td className="py-3 text-right">
                                                    <Link href={admin.customers.show(customer.id).url}>
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {customers.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Showing {customers.from}–{customers.to} of {customers.total}
                                </p>
                                <div className="flex gap-1">
                                    {customers.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true, replace: true })}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CustomersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: admin.dashboard().url },
        { title: 'Customers', href: admin.customers.index().url },
    ],
};

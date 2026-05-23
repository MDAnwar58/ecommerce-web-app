import { Link, usePage } from '@inertiajs/react';
import { Package, ShoppingBag, Heart, MapPin, User, LogOut, ChevronRight } from 'lucide-react';
import { logout } from '@/routes';
import user from '@/routes/user';
import orders from '@/routes/orders';
import wishlist from '@/routes/wishlist';
import shop from '@/routes/shop';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const navItems = [
    { icon: ShoppingBag, label: 'Dashboard', href: user.dashboard().url },
    { icon: Package, label: 'Orders', href: orders.index().url },
    { icon: Heart, label: 'Wishlist', href: wishlist.index().url },
    { icon: MapPin, label: 'Addresses', href: user.addresses().url },
    { icon: User, label: 'Profile', href: user.profile().url },
];

export default function UserLayout({ breadcrumbs = [], children }: { breadcrumbs?: BreadcrumbItem[]; children: React.ReactNode }) {
    const { url } = usePage();
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Package className="h-8 w-8 text-emerald-600" />
                        <span className="text-xl font-bold text-gray-900">ShopHub</span>
                    </Link>
                    <Link href={shop.index().url}>
                        <Button variant="outline" size="sm">Back to Shop</Button>
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    <aside className="w-full shrink-0 lg:w-64">
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = url === item.href;
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                            isActive
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                        <ChevronRight className={`ml-auto h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                                    </Link>
                                );
                            })}
                            <div className="pt-4 border-t border-gray-100">
                                <Link
                                    href={logout().url}
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Sign Out
                                </Link>
                            </div>
                        </nav>
                    </aside>

                    <main className="flex-1 min-w-0">
                        {breadcrumbs.length > 0 && (
                            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                                {breadcrumbs.map((crumb, i) => (
                                    <span key={i} className="flex items-center gap-2">
                                        {i > 0 && <ChevronRight className="h-3 w-3" />}
                                        {crumb.href ? (
                                            <Link href={crumb.href} className="hover:text-emerald-600">{crumb.title}</Link>
                                        ) : (
                                            <span>{crumb.title}</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

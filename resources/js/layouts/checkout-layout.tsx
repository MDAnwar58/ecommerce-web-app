import { Link } from '@inertiajs/react';
import { Package } from 'lucide-react';
import shop from '@/routes/shop';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-b border-gray-100 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Package className="h-8 w-8 text-emerald-600" />
                        <span className="text-xl font-bold text-gray-900">ShopHub</span>
                    </Link>
                    <Link href={shop.index().url} className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}

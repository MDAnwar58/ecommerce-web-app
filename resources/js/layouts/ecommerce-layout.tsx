import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Heart, User, Search, Menu, X, Package } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import shop from '@/routes/shop';
import cart from '@/routes/cart';
import wishlist from '@/routes/wishlist';
import { login, register } from '@/routes';
import user from '@/routes/user';

export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Package className="h-8 w-8 text-emerald-600" />
                        <span className="text-xl font-bold text-gray-900">ShopHub</span>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        <Link href={shop.index().url} className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                            Shop
                        </Link>
                        <Link href={shop.index().url + '?category=grocery'} className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                            Grocery
                        </Link>
                        <Link href={shop.index().url + '?category=electronics'} className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                            Electronics
                        </Link>
                        <Link href={shop.index().url + '?category=fashion'} className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                            Fashion
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {auth?.user ? (
                            <>
                                <Link href={cart.index().url} className="relative text-gray-700 hover:text-emerald-600 transition-colors">
                                    <ShoppingCart className="h-5 w-5" />
                                </Link>
                                <Link href={wishlist.index().url} className="text-gray-700 hover:text-emerald-600 transition-colors">
                                    <Heart className="h-5 w-5" />
                                </Link>
                                <Link href={user.dashboard().url} className="text-gray-700 hover:text-emerald-600 transition-colors">
                                    <User className="h-5 w-5" />
                                </Link>
                            </>
                        ) : (
                            <div className="hidden items-center gap-3 sm:flex">
                                <Link href={login().url}>
                                    <Button variant="ghost" size="sm">Log in</Button>
                                </Link>
                                <Link href={register().url}>
                                    <Button size="sm">Register</Button>
                                </Link>
                            </div>
                        )}
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
                        <nav className="flex flex-col gap-3">
                            <Link href={shop.index().url} className="text-sm font-medium text-gray-700">Shop</Link>
                            <Link href={shop.index().url + '?category=grocery'} className="text-sm font-medium text-gray-700">Grocery</Link>
                            <Link href={shop.index().url + '?category=electronics'} className="text-sm font-medium text-gray-700">Electronics</Link>
                            <Link href={shop.index().url + '?category=fashion'} className="text-sm font-medium text-gray-700">Fashion</Link>
                            {!auth?.user && (
                                <div className="flex gap-3 pt-2 border-t border-gray-100">
                                    <Link href={login().url}><Button variant="outline" size="sm" className="w-full">Log in</Button></Link>
                                    <Link href={register().url}><Button size="sm" className="w-full">Register</Button></Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            <main>{children}</main>

            <footer className="border-t border-gray-100 bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="h-6 w-6 text-emerald-600" />
                                <span className="text-lg font-bold text-gray-900">ShopHub</span>
                            </div>
                            <p className="text-sm text-gray-600">Your one-stop shop for everything you need. Grocery, electronics, fashion, and more.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link href={shop.index().url} className="hover:text-emerald-600 transition-colors">Shop All</Link></li>
                                <li><Link href={shop.index().url + '?sort=best-seller'} className="hover:text-emerald-600 transition-colors">Best Sellers</Link></li>
                                <li><Link href={shop.index().url + '?sort=newest'} className="hover:text-emerald-600 transition-colors">New Arrivals</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link href={shop.index().url + '?category=grocery'} className="hover:text-emerald-600 transition-colors">Grocery</Link></li>
                                <li><Link href={shop.index().url + '?category=electronics'} className="hover:text-emerald-600 transition-colors">Electronics</Link></li>
                                <li><Link href={shop.index().url + '?category=fashion'} className="hover:text-emerald-600 transition-colors">Fashion</Link></li>
                                <li><Link href={shop.index().url + '?category=household'} className="hover:text-emerald-600 transition-colors">Household</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>Contact Us</li>
                                <li>FAQs</li>
                                <li>Shipping Info</li>
                                <li>Returns</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

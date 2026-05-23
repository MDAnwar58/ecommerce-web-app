import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { login, register } from '@/routes';
import user from '@/routes/user';
import shop from '@/routes/shop';
import categories from '@/routes/categories';
import {
    ShoppingBag,
    Monitor,
    Shirt,
    Home as HomeIcon,
    Truck,
    Star,
    ChevronRight,
    Clock,
    ArrowRight,
    TrendingUp,
    Sparkles,
    Zap,
    Leaf,
    Package,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    ShoppingCart,
    Eye,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function Home() {
    const { auth } = usePage().props;

    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
    const [currentReview, setCurrentReview] = useState(0);

    const { data, setData, post, processing } = useForm({ email: '' });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 23, minutes: 59, seconds: 59 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const reviewTimer = setInterval(() => {
            setCurrentReview((prev) => (prev + 1) % reviews.length);
        }, 4000);
        return () => clearInterval(reviewTimer);
    }, []);

    const categories_list = [
        { name: 'Grocery', icon: ShoppingBag, color: 'from-green-500 to-emerald-600', slug: 'grocery' },
        { name: 'Electronics', icon: Monitor, color: 'from-blue-500 to-indigo-600', slug: 'electronics' },
        { name: 'Fashion', icon: Shirt, color: 'from-purple-500 to-pink-600', slug: 'fashion' },
        { name: 'Household', icon: HomeIcon, color: 'from-orange-500 to-red-600', slug: 'household' },
    ];

    const flashSaleProducts = [
        { name: 'Wireless Headphones', price: 199.99, original: 349.99, discount: 45, image: null },
        { name: 'Organic Coffee Beans', price: 24.99, original: 39.99, discount: 38, image: null },
        { name: 'Smart Watch Pro', price: 299.99, original: 499.99, discount: 40, image: null },
        { name: 'Designer Backpack', price: 79.99, original: 149.99, discount: 47, image: null },
    ];

    const trendingProducts = [
        { name: 'iPhone 15 Pro', price: 1099.99, rating: 4.8, reviews: 234, image: null },
        { name: 'MacBook Air M3', price: 1299.99, rating: 4.9, reviews: 189, image: null },
        { name: 'AirPods Pro 2', price: 249.99, rating: 4.7, reviews: 456, image: null },
        { name: 'iPad Air', price: 599.99, rating: 4.6, reviews: 167, image: null },
        { name: 'Sony WH-1000XM5', price: 349.99, rating: 4.8, reviews: 312, image: null },
        { name: 'Samsung Galaxy S24', price: 999.99, rating: 4.5, reviews: 198, image: null },
    ];

    const bestDeals = [
        { name: '4K OLED TV', price: 1499.99, original: 2499.99, discount: 40, image: null },
        { name: 'Laptop Stand', price: 49.99, original: 89.99, discount: 44, image: null },
        { name: 'Mechanical Keyboard', price: 129.99, original: 199.99, discount: 35, image: null },
    ];

    const reviews = [
        { name: 'Sarah Johnson', avatar: 'SJ', rating: 5, comment: 'Amazing quality and fast delivery! The product exceeded my expectations.', role: 'Verified Buyer' },
        { name: 'Michael Chen', avatar: 'MC', rating: 5, comment: 'Best online shopping experience. Great prices and excellent customer service.', role: 'Verified Buyer' },
        { name: 'Emily Rodriguez', avatar: 'ER', rating: 4, comment: 'Love the variety of products available. Will definitely shop again!', role: 'Verified Buyer' },
        { name: 'David Kim', avatar: 'DK', rating: 5, comment: 'Fast shipping and everything was well-packaged. Highly recommended!', role: 'Verified Buyer' },
    ];

    return (
        <>
            <Head title="Home" />

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-15px) rotate(2deg); }
                    75% { transform: translateY(-8px) rotate(-1deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-12px) rotate(-2deg); }
                    75% { transform: translateY(-5px) rotate(1deg); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.6); }
                }
                @keyframes scroll-hint {
                    0%, 100% { transform: translateY(0); opacity: 1; }
                    50% { transform: translateY(8px); opacity: 0.5; }
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
                .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
                .animate-fade-in-up-delayed { animation: fadeInUp 0.8s ease-out 0.3s forwards; opacity: 0; }
                .animate-fade-in-up-delayed-2 { animation: fadeInUp 0.8s ease-out 0.6s forwards; opacity: 0; }
                .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
                .animate-scroll-hint { animation: scroll-hint 2s ease-in-out infinite; }
                .animate-marquee { animation: marquee 30s linear infinite; }
                .animate-marquee:hover { animation-play-state: paused; }
                .shimmer-bg {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 2.5s infinite;
                }
                .card-hover {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .card-hover:hover {
                    transform: translateY(-6px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.12);
                }
                .gradient-text {
                    background: linear-gradient(135deg, #22c55e, #16a34a, #15803d);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .hero-gradient {
                    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 60%, #f0fdf4 100%);
                }
            `}</style>

            {/* Hero Section */}
            <section className="hero-gradient relative min-h-screen overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-green-200/30 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
                    <div className="absolute top-1/3 left-1/4 h-64 w-64 rounded-full bg-green-100/20 blur-2xl" />
                </div>

                <header className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-8 w-8 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">ShopNow</span>
                    </div>
                    <nav className="hidden items-center gap-8 md:flex">
                        <Link href={shop.index()} className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Shop</Link>
                        <Link href={categories.index()} className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Categories</Link>
                        <a href="#deals" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Deals</a>
                        <a href="#reviews" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Reviews</a>
                    </nav>
                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link href={user.dashboard()}>
                                <Button variant="outline" size="sm">Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={login()}>
                                    <Button variant="ghost" size="sm">Log in</Button>
                                </Link>
                                <Link href={register()}>
                                    <Button size="sm">Register</Button>
                                </Link>
                            </>
                        )}
                        <Link href={shop.index()}>
                            <Button variant="outline" size="icon" className="relative">
                                <ShoppingCart className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </header>

                <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-16 pb-24 lg:flex-row lg:pt-32">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700 animate-fade-in-up">
                            <Sparkles className="h-4 w-4" />
                            New Collection Available
                        </div>
                        <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl lg:text-7xl animate-fade-in-up">
                            Everything You Need{' '}
                            <span className="gradient-text">Delivered Fast</span>
                        </h1>
                        <p className="mx-auto mb-8 max-w-lg text-lg text-gray-600 md:text-xl animate-fade-in-up-delayed lg:mx-0">
                            From fresh groceries to the latest electronics and fashion —
                            we bring the best products right to your doorstep.
                        </p>
                        <div className="flex flex-col items-center gap-4 sm:flex-row animate-fade-in-up-delayed-2 lg:justify-start">
                            <Link href={shop.index()}>
                                <Button size="lg" className="group h-12 gap-2 bg-green-600 px-8 text-base hover:bg-green-700 animate-pulse-glow">
                                    Shop Now
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-12 gap-2 border-2 px-8 text-base"
                                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Explore Categories
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="mt-12 flex items-center gap-8 text-sm text-gray-500 animate-fade-in-up-delayed-2">
                            <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-green-500" /> Free Shipping</div>
                            <div className="flex items-center gap-2"><Package className="h-4 w-4 text-green-500" /> Secure Packaging</div>
                            <div className="flex items-center gap-2"><Leaf className="h-4 w-4 text-green-500" /> Eco-Friendly</div>
                        </div>
                    </div>

                    <div className="relative mt-16 flex-1 lg:mt-0">
                        <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-green-300/20 to-emerald-300/20 blur-xl" />
                        <div className="relative grid grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="animate-float rounded-2xl bg-white p-6 shadow-xl card-hover">
                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-500">
                                        <Monitor className="h-7 w-7 text-white" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">Premium Electronics</p>
                                    <p className="text-xs text-gray-500">Latest tech gadgets</p>
                                </div>
                                <div className="animate-float-delayed rounded-2xl bg-white p-6 shadow-xl card-hover" style={{ animationDelay: '0.5s' }}>
                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500">
                                        <Shirt className="h-7 w-7 text-white" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">Trendy Fashion</p>
                                    <p className="text-xs text-gray-500">Season collections</p>
                                </div>
                            </div>
                            <div className="mt-8 space-y-6">
                                <div className="animate-float rounded-2xl bg-white p-6 shadow-xl card-hover" style={{ animationDelay: '0.3s' }}>
                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500">
                                        <ShoppingBag className="h-7 w-7 text-white" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">Fresh Groceries</p>
                                    <p className="text-xs text-gray-500">Farm to table</p>
                                </div>
                                <div className="animate-float-delayed rounded-2xl bg-white p-6 shadow-xl card-hover" style={{ animationDelay: '0.8s' }}>
                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-500">
                                        <Zap className="h-7 w-7 text-white" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">Lightning Delivery</p>
                                    <p className="text-xs text-gray-500">Under 2 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
                    <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
                        <span>Scroll to explore</span>
                        <ChevronRight className="h-5 w-5 rotate-90 animate-scroll-hint" />
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section id="categories" className="bg-white px-6 py-20 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <span className="mb-2 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">Categories</span>
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Shop by Category</h2>
                        <p className="mt-3 text-gray-500">Find exactly what you're looking for</p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {categories_list.map((cat, i) => (
                            <Link
                                key={cat.name}
                                href={`${shop.index()}?category=${cat.slug}`}
                                className="group card-hover relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 text-white"
                                style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.1}s forwards`, opacity: 0 }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90`} />
                                <div className="relative z-10">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                                        <cat.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold">{cat.name}</h3>
                                    <p className="text-sm text-white/80">Explore now</p>
                                </div>
                                <div className="absolute -right-6 -bottom-6 opacity-10">
                                    <cat.icon className="h-32 w-32" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Flash Sale */}
            <section className="bg-gradient-to-br from-green-600 to-emerald-700 px-6 py-20 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-green-200">
                                <Zap className="h-5 w-5" />
                                <span className="text-sm font-medium uppercase tracking-wider">Flash Sale</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white md:text-4xl">Limited Time Offers</h2>
                        </div>
                        <div className="flex items-center gap-4 rounded-2xl bg-white/10 px-6 py-3 backdrop-blur-sm">
                            <Clock className="h-5 w-5 text-green-200" />
                            <div className="flex gap-3 text-2xl font-bold text-white tabular-nums">
                                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                                <span className="text-green-300">:</span>
                                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                                <span className="text-green-300">:</span>
                                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {flashSaleProducts.map((product, i) => (
                            <div
                                key={product.name}
                                className="group card-hover relative overflow-hidden rounded-2xl bg-white p-6"
                                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s forwards`, opacity: 0 }}
                            >
                                <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                                    -{product.discount}%
                                </Badge>
                                <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-gray-50">
                                    <Package className="h-16 w-16 text-gray-300" />
                                </div>
                                <h3 className="mb-2 font-semibold text-gray-900">{product.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-green-600">${product.price}</span>
                                    <span className="text-sm text-gray-400 line-through">${product.original}</span>
                                </div>
                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shimmer-bg" />
                                </div>
                                <p className="mt-1 text-xs text-gray-400">Sold: 75%</p>
                                <Link href={shop.index()}>
                                    <Button size="sm" className="mt-4 w-full gap-2 bg-green-600 hover:bg-green-700">
                                        <ShoppingCart className="h-4 w-4" />
                                        Grab Now
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Products */}
            <section className="bg-gray-50 px-6 py-20 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-green-600">
                                <TrendingUp className="h-5 w-5" />
                                <span className="text-sm font-medium uppercase tracking-wider">Trending Now</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Most Popular Products</h2>
                        </div>
                        <Link href={shop.index()} className="hidden items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 sm:flex">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="relative overflow-hidden">
                        <div className="flex animate-marquee gap-6">
                            {[...trendingProducts, ...trendingProducts].map((product, i) => (
                                <div
                                    key={`${product.name}-${i}`}
                                    className="card-hover w-64 shrink-0 rounded-2xl bg-white p-5 shadow-md"
                                >
                                    <div className="mb-3 flex h-36 items-center justify-center rounded-xl bg-gray-50">
                                        <Package className="h-14 w-14 text-gray-300" />
                                    </div>
                                    <div className="mb-2 flex items-center gap-1">
                                        {Array.from({ length: 5 }, (_, j) => (
                                            <Star key={j} className={`h-3.5 w-3.5 ${j < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                        ))}
                                        <span className="ml-1 text-xs text-gray-400">({product.reviews})</span>
                                    </div>
                                    <h3 className="mb-2 font-semibold text-gray-900">{product.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-green-600">${product.price}</span>
                                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Link href={shop.index()} className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 sm:hidden">
                        View All <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            {/* Best Deals */}
            <section id="deals" className="bg-white px-6 py-20 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <span className="mb-2 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">Best Deals</span>
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Unbeatable Offers</h2>
                        <p className="mt-3 text-gray-500">Save big on selected items</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {bestDeals.map((deal, i) => (
                            <div
                                key={deal.name}
                                className="group card-hover relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-lg"
                                style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.15}s forwards`, opacity: 0 }}
                            >
                                <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-green-50" />
                                <div className="relative z-10">
                                    <div className="mb-4 flex h-44 items-center justify-center rounded-xl bg-gray-50">
                                        <Package className="h-20 w-20 text-gray-300" />
                                    </div>
                                    <Badge className="mb-3 bg-green-100 text-green-700 hover:bg-green-100">
                                        Save {deal.discount}%
                                    </Badge>
                                    <h3 className="mb-2 text-lg font-bold text-gray-900">{deal.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold text-green-600">${deal.price}</span>
                                        <span className="text-sm text-gray-400 line-through">${deal.original}</span>
                                    </div>
                                    <Link href={shop.index()}>
                                        <Button className="mt-4 w-full gap-2 bg-green-600 hover:bg-green-700">
                                            Shop Now <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-gray-50 px-6 py-20 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            { icon: Truck, title: 'Free Delivery', desc: 'On orders over $50', color: 'text-green-600 bg-green-100' },
                            { icon: Leaf, title: 'Eco-Friendly', desc: 'Sustainable packaging', color: 'text-emerald-600 bg-emerald-100' },
                            { icon: Zap, title: 'Fast Checkout', desc: 'One-click ordering', color: 'text-blue-600 bg-blue-100' },
                        ].map((feature, i) => (
                            <div
                                key={feature.title}
                                className="flex items-center gap-5 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
                                style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s forwards`, opacity: 0 }}
                            >
                                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${feature.color}`}>
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                                    <p className="text-sm text-gray-500">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Customer Reviews */}
            <section id="reviews" className="bg-white px-6 py-20 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <span className="mb-2 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">Testimonials</span>
                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">What Our Customers Say</h2>
                        <p className="mt-3 text-gray-500">Join thousands of happy customers</p>
                    </div>
                    <div className="relative mx-auto max-w-2xl">
                        {reviews.map((review, i) => (
                            <div
                                key={review.name}
                                className={`transition-all duration-500 ${i === currentReview ? 'scale-100 opacity-100' : 'absolute inset-0 scale-95 opacity-0'}`}
                                style={{ position: i === currentReview ? 'relative' : 'absolute' }}
                            >
                                <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center shadow-lg">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-lg font-bold text-white shadow-md">
                                        {review.avatar}
                                    </div>
                                    <div className="mb-3 flex justify-center gap-1">
                                        {Array.from({ length: 5 }, (_, j) => (
                                            <Star key={j} className={`h-5 w-5 ${j < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className="mb-4 text-lg text-gray-700 italic">"{review.comment}"</p>
                                    <p className="font-semibold text-gray-900">{review.name}</p>
                                    <p className="text-sm text-gray-500">{review.role}</p>
                                </div>
                            </div>
                        ))}
                        <div className="mt-6 flex justify-center gap-2">
                            {reviews.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentReview(i)}
                                    className={`h-2.5 w-2.5 rounded-full transition-all ${i === currentReview ? 'w-8 bg-green-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-gradient-to-br from-green-600 to-emerald-700 px-6 py-20 lg:px-12">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Stay in the Loop</h2>
                    <p className="mb-8 text-green-100">Subscribe to get exclusive deals, new arrivals, and member-only offers.</p>
                    <form
                        onSubmit={(e) => { e.preventDefault(); post('/newsletter/subscribe'); }}
                        className="mx-auto flex max-w-md gap-3"
                    >
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="h-12 flex-1 rounded-xl border-0 bg-white/95 px-5 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/50"
                            required
                        />
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-12 gap-2 rounded-xl bg-white px-6 text-green-700 hover:bg-gray-100"
                        >
                            Subscribe <ArrowRight className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 px-6 py-16 text-gray-300 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <ShoppingBag className="h-7 w-7 text-green-400" />
                                <span className="text-xl font-bold text-white">ShopNow</span>
                            </div>
                            <p className="mb-6 text-sm text-gray-400">Your one-stop destination for everything you need. Quality products, fast delivery.</p>
                            <div className="flex gap-3">
                                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-green-600 hover:text-white"><Facebook className="h-4 w-4" /></a>
                                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-green-600 hover:text-white"><Twitter className="h-4 w-4" /></a>
                                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-green-600 hover:text-white"><Instagram className="h-4 w-4" /></a>
                                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-green-600 hover:text-white"><Youtube className="h-4 w-4" /></a>
                            </div>
                        </div>
                        <div>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
                            <ul className="space-y-3 text-sm">
                                <li><Link href={shop.index()} className="text-gray-400 hover:text-white transition-colors">Shop</Link></li>
                                <li><Link href={categories.index()} className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
                                <li><a href="#deals" className="text-gray-400 hover:text-white transition-colors">Deals</a></li>
                                <li><a href="#reviews" className="text-gray-400 hover:text-white transition-colors">Reviews</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Support</h3>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-green-400" /> +1 234 567 890</li>
                                <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-green-400" /> support@shopnow.com</li>
                                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-green-400" /> 123 Commerce St, NY</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} ShopNow. All rights reserved.
                    </div>
                </div>
            </footer>
        </>
    );
}

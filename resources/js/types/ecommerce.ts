export type Product = {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description: string | null;
    price: number;
    compare_price: number | null;
    cost_price: number | null;
    sku: string;
    barcode: string | null;
    category_id: number | null;
    category: Category | null;
    brand: string | null;
    attributes: Record<string, string> | null;
    variants: Record<string, string>[] | null;
    unit: string | null;
    weight: number | null;
    length: number | null;
    width: number | null;
    height: number | null;
    stock_quantity: number;
    low_stock_threshold: number;
    track_inventory: boolean;
    is_active: boolean;
    is_featured: boolean;
    is_trending: boolean;
    rating: number;
    review_count: number;
    sold_count: number;
    discount_percentage: number | null;
    final_price: number;
    images: ProductImage[];
    primary_image: ProductImage | null;
    product_variants: ProductVariant[];
    reviews: Review[];
    created_at: string;
    updated_at: string;
};

export type ProductImage = {
    id: number;
    product_id: number;
    image: string;
    is_primary: boolean;
    sort_order: number;
    url?: string;
    alt?: string;
};

export type ProductVariant = {
    id: number;
    product_id: number;
    name: string;
    sku: string;
    price: number | null;
    compare_price: number | null;
    stock_quantity: number;
    attributes: Record<string, string> | null;
    image: string | null;
    is_active: boolean;
    in_stock?: boolean;
};

export type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parent_id: number | null;
    is_active: boolean;
    sort_order: number;
    children: Category[];
    products_count?: number;
};

export type CartItem = {
    id: number;
    user_id: number;
    product_id: number;
    product_variant_id: number | null;
    quantity: number;
    product: Product;
    variant: ProductVariant | null;
    unit_price?: number;
    subtotal?: number;
    total: number;
};

export type Order = {
    id: number;
    order_number: string;
    user_id: number;
    address_id: number | null;
    subtotal: number;
    shipping_cost: number;
    discount: number;
    tax: number;
    total: number;
    coupon_code: string | null;
    payment_method: string;
    payment_status: string;
    payment_id: string | null;
    shipping_method: string | null;
    status: string;
    notes: string | null;
    staff_notes: string | null;
    assigned_staff_id: number | null;
    assigned_staff: User | null;
    address: Address | null;
    user: User | null;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
    shipped_at: string | null;
    delivered_at: string | null;
    cancelled_at: string | null;
    cancellation_reason: string | null;
};

export type OrderItem = {
    id: number;
    order_id: number;
    product_id: number;
    product_variant_id: number | null;
    product_name: string;
    product_sku: string;
    price: number;
    quantity: number;
    total: number;
    product: Product | null;
    subtitle?: number;
    unit_price?: number;
};

export type Address = {
    id: number;
    user_id: number;
    label: string | null;
    full_name: string;
    phone: string;
    street_address: string;
    apartment: string | null;
    city: string;
    state: string | null;
    postal_code: string;
    country: string;
    is_default: boolean;
    type: string;
    latitude: number | null;
    longitude: number | null;
    name?: string;
    street?: string;
    zip?: string;
};

export type Review = {
    id: number;
    user_id: number;
    product_id: number;
    order_id: number | null;
    rating: number;
    comment: string | null;
    is_approved: boolean;
    user: User | { id: number; name: string; avatar?: string | null };
    product?: Product;
    created_at: string;
};

export type Coupon = {
    id: number;
    code: string;
    type: 'fixed' | 'percentage';
    value: number;
    min_order_amount: number | null;
    max_discount: number | null;
    usage_limit: number | null;
    used_count: number;
    applicable_categories: string[] | null;
    applicable_products: string[] | null;
    starts_at: string | null;
    expires_at: string | null;
    is_active: boolean;
};

export type User = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'staff' | 'user';
    phone: string | null;
    avatar: string | null;
    is_active: boolean;
    permissions: string[] | null;
    managed_by: number | null;
    orders_count?: number;
    total_spent?: number;
    email_verified_at?: string | null;
};

export type Brand = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    website: string | null;
    is_active: boolean;
    sort_order: number;
    products_count?: number;
    created_at: string;
    updated_at: string;
};

export type Analytics = {
    total_revenue: number;
    total_orders: number;
    total_products: number;
    total_customers: number;
    revenue_chart: { month: string; revenue: number }[];
    sales_chart: { month: string; sales: number }[];
    top_products: { id: number; name: string; sold: number; revenue: number }[];
    recent_orders: Order[];
};

export type ProductFilters = {
    category: string | null;
    brand: string | null;
    min_price: number | null;
    max_price: number | null;
    rating: number | null;
    search: string | null;
    sort: string | null;
    in_stock: boolean | null;
};

export type FlashSale = {
    id: number;
    title: string;
    end_time: string;
    products: Product[];
};

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export type PaymentMethod = 'cod' | 'card' | 'bank_transfer';

export type DeliveryMethod = {
    id: number;
    name: string;
    description?: string;
    price: number;
    estimated_days: string;
};

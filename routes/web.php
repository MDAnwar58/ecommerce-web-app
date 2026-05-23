<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\Staff\DashboardController as StaffDashboardController;
use App\Http\Controllers\Staff\OrderController as StaffOrderController;
use App\Http\Controllers\Staff\ProductController as StaffProductController;
use App\Http\Controllers\User\AddressController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\ProfileController as UserProfileController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $user = request()->user();
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        if ($user->isStaff()) {
            return redirect()->route('staff.dashboard');
        }

        return redirect()->route('user.dashboard');
    })->name('dashboard');
});

Route::prefix('shop')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('shop.index');
    Route::get('/{product:slug}', [ProductController::class, 'show'])->name('shop.show');
    Route::get('/api/featured', [ProductController::class, 'featured'])->name('shop.featured');
    Route::get('/api/trending', [ProductController::class, 'trending'])->name('shop.trending');
    Route::get('/api/search', [ProductController::class, 'search'])->name('shop.search');
});

Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index'])->name('cart.index');
        Route::post('/', [CartController::class, 'store'])->name('cart.store');
        Route::patch('/{cartItem}', [CartController::class, 'update'])->name('cart.update');
        Route::delete('/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');
        Route::get('/count', [CartController::class, 'count'])->name('cart.count');
    });

    Route::prefix('wishlist')->group(function () {
        Route::get('/', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::post('/', [WishlistController::class, 'store'])->name('wishlist.store');
        Route::delete('/{product}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
    });

    Route::prefix('checkout')->group(function () {
        Route::get('/', [CheckoutController::class, 'index'])->name('checkout.index');
        Route::post('/', [CheckoutController::class, 'process'])->name('checkout.process');
    });

    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::post('/', [OrderController::class, 'store'])->name('orders.store');
        Route::post('/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    });

    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::post('/coupon/validate', [CouponController::class, 'validate'])->name('coupon.validate');

    Route::prefix('user')->name('user.')->group(function () {
        Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
        Route::get('/profile', [UserProfileController::class, 'index'])->name('profile');
        Route::post('/profile', [UserProfileController::class, 'update'])->name('profile.update');
        Route::get('/addresses', [AddressController::class, 'index'])->name('addresses');
        Route::post('/addresses', [AddressController::class, 'store'])->name('addresses.store');
        Route::post('/addresses/{address}', [AddressController::class, 'update'])->name('addresses.update');
        Route::delete('/addresses/{address}', [AddressController::class, 'destroy'])->name('addresses.destroy');
    });
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [AdminProductController::class, 'create'])->name('products.create');
    Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
    Route::post('/products/{product}', [AdminProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');

    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [AdminCategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}/edit', [AdminCategoryController::class, 'edit'])->name('categories.edit');
    Route::post('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
    Route::post('/orders/{order}/assign', [AdminOrderController::class, 'assignStaff'])->name('orders.assign');

    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/{user}', [CustomerController::class, 'show'])->name('customers.show');

    Route::get('/staff', [StaffController::class, 'index'])->name('staff.index');
    Route::get('/staff/create', [StaffController::class, 'create'])->name('staff.create');
    Route::post('/staff', [StaffController::class, 'store'])->name('staff.store');
    Route::get('/staff/{user}/edit', [StaffController::class, 'edit'])->name('staff.edit');
    Route::post('/staff/{user}', [StaffController::class, 'update'])->name('staff.update');
    Route::delete('/staff/{user}', [StaffController::class, 'destroy'])->name('staff.destroy');

    Route::get('/coupons', [AdminCouponController::class, 'index'])->name('coupons.index');
    Route::post('/coupons', [AdminCouponController::class, 'store'])->name('coupons.store');
    Route::post('/coupons/{coupon}', [AdminCouponController::class, 'update'])->name('coupons.update');
    Route::delete('/coupons/{coupon}', [AdminCouponController::class, 'destroy'])->name('coupons.destroy');

    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');

    Route::get('/brands', [BrandController::class, 'index'])->name('brands.index');
    Route::get('/brands/create', [BrandController::class, 'create'])->name('brands.create');
    Route::post('/brands', [BrandController::class, 'store'])->name('brands.store');
    Route::get('/brands/{brand}/edit', [BrandController::class, 'edit'])->name('brands.edit');
    Route::post('/brands/{brand}', [BrandController::class, 'update'])->name('brands.update');
    Route::delete('/brands/{brand}', [BrandController::class, 'destroy'])->name('brands.destroy');
});

Route::middleware(['auth', 'verified', 'staff'])->prefix('staff')->name('staff.')->group(function () {
    Route::get('/dashboard', [StaffDashboardController::class, 'index'])->name('dashboard');

    Route::get('/orders', [StaffOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [StaffOrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [StaffOrderController::class, 'updateStatus'])->name('orders.status');
    Route::post('/orders/{order}/notes', [StaffOrderController::class, 'updateNotes'])->name('orders.notes');

    Route::get('/products', [StaffProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product}/edit', [StaffProductController::class, 'edit'])->name('products.edit');
    Route::post('/products/{product}', [StaffProductController::class, 'update'])->name('products.update');
    Route::patch('/products/{product}/stock', [StaffProductController::class, 'updateStock'])->name('products.stock');
});

require __DIR__.'/settings.php';

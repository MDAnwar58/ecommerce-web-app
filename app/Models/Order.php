<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_id',
        'address_id',
        'subtotal',
        'shipping_cost',
        'discount',
        'tax',
        'total',
        'coupon_code',
        'payment_method',
        'payment_status',
        'payment_id',
        'shipping_method',
        'status',
        'notes',
        'staff_notes',
        'assigned_staff_id',
        'shipped_at',
        'delivered_at',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'shipping_cost' => 'decimal:2',
            'discount' => 'decimal:2',
            'tax' => 'decimal:2',
            'total' => 'decimal:2',
            'shipped_at' => 'datetime',
            'delivered_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function assignedStaff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_staff_id');
    }

    public static function generateOrderNumber(): string
    {
        $prefix = 'ORD-';
        $date = now()->format('Ymd');
        $last = static::whereDate('created_at', today())->count();

        return $prefix.$date.'-'.str_pad($last + 1, 4, '0', STR_PAD_LEFT);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function validate(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string',
            'cart_total' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', $data['code'])->first();

        if (! $coupon || ! $coupon->isValid()) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid or expired coupon code.',
            ]);
        }

        if ($data['cart_total'] < $coupon->min_order_amount) {
            return response()->json([
                'valid' => false,
                'message' => "Minimum order amount of {$coupon->min_order_amount} required.",
            ]);
        }

        $discount = $coupon->type === 'percentage'
            ? min($data['cart_total'] * $coupon->value / 100, $coupon->max_discount ?? PHP_FLOAT_MAX)
            : min($coupon->value, $coupon->max_discount ?? $coupon->value);

        return response()->json([
            'valid' => true,
            'coupon' => $coupon,
            'discount' => round($discount, 2),
            'message' => 'Coupon applied successfully.',
        ]);
    }
}

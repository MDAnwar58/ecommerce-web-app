import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import EcommerceLayout from '@/layouts/ecommerce-layout';
import UserLayout from '@/layouts/user-layout';
import CheckoutLayout from '@/layouts/checkout-layout';

const appName = import.meta.env.VITE_APP_NAME || 'ShopHub';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name === 'home':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            case name.startsWith('admin/'):
            case name.startsWith('staff/'):
                return AppLayout;
            case name.startsWith('user/'):
                return UserLayout;
            case name.startsWith('checkout/'):
                return CheckoutLayout;
            case name.startsWith('shop/'):
            case name === 'cart/index':
            case name.startsWith('cart/'):
            case name === 'orders/index':
            case name === 'orders/show':
                return EcommerceLayout;
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();

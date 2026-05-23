import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    ShoppingBag,
    Package,
    Tags,
    Users,
    UserCog,
    Percent,
    BarChart3,
    Settings,
    BookOpen,
    FolderGit2,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: admin.dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Orders',
        href: admin.orders.index(),
        icon: ShoppingBag,
    },
    {
        title: 'Products',
        href: admin.products.index(),
        icon: Package,
    },
    {
        title: 'Categories',
        href: admin.categories.index(),
        icon: Tags,
    },
    {
        title: 'Brands',
        href: admin.brands.index(),
        icon: Tags,
    },
    {
        title: 'Customers',
        href: admin.customers.index(),
        icon: Users,
    },
    {
        title: 'Staff',
        href: admin.staff.index(),
        icon: UserCog,
    },
    {
        title: 'Coupons',
        href: admin.coupons.index(),
        icon: Percent,
    },
    {
        title: 'Analytics',
        href: admin.analytics.index(),
        icon: BarChart3,
    },
    {
        title: 'Settings',
        href: admin.settings.index(),
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

import { Head, usePage, useForm } from '@inertiajs/react';
import user from '@/routes/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, Phone, Save } from 'lucide-react';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        phone?: string;
    };
    [key: string]: unknown;
}

export default function UserProfile() {
    const { user: userData } = usePage<Props>().props;

    const { data, setData, put, processing, errors } = useForm({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(user.profile.url(), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="My Profile" />

            <div className="px-6 py-8 lg:px-12">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">My Profile</h1>
                        <p className="text-gray-500">Update your personal information</p>
                    </div>

                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="h-11 rounded-xl pl-10"
                                            required
                                        />
                                    </div>
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="h-11 rounded-xl pl-10"
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="h-11 rounded-xl pl-10"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="gap-2 bg-green-600 hover:bg-green-700"
                                    >
                                        <Save className="h-4 w-4" />
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

UserProfile.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: user.dashboard().url },
        { title: 'Profile', href: user.profile().url },
    ],
};

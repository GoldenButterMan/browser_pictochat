import DrawingCanvas from '@/components/drawing-canvas';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chats',
        href: '/chats',
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chats" />
            <div className='m-4'>
                <Link href={route('chats.chatroom')}><Button>Enter Chatroom</Button></Link>
            </div>
        </AppLayout>
    );
}

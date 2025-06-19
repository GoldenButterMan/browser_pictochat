import DrawingCanvas from '@/components/drawing-canvas';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chatroom',
        href: '/chats/chatroom',
    },
];

export default function Chatroom() {
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chats" />
            <div>
                List of pictochats here
                <DrawingCanvas></DrawingCanvas>
            </div>
        </AppLayout>
    );
}

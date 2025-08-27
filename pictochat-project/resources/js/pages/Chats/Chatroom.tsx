import DrawingCanvas from '@/components/drawing-canvas';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chatroom',
        href: '/chats/chatroom',
    },
];

interface Drawing{
    id: number,
    user_id: number,
    image: string,
}

interface PageProps {
    flash: {
        message?: string
    }
    drawings: Drawing[]
}

export default function Chatroom() {

    const {drawings, flash} = usePage().props as PageProps;
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chats" />
            <div>
                List of pictochats here
                {drawings.length > 0 && (
                    <div className='m-4'>
                        <Table>
                            <TableCaption>Chat Drawings</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>User ID</TableHead>
                                    <TableHead>Drawing</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {drawings.map((drawing) => (
                                    <TableRow>
                                        <TableCell className="font-medium">{drawing.id}</TableCell>
                                        <TableCell>{drawing.user_id}</TableCell>
                                        <TableCell>{drawing.image}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                <DrawingCanvas></DrawingCanvas>
            </div>
        </AppLayout>
    );
}

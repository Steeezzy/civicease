import { getAllComplaints } from '@/lib/actions/admin.actions'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'

// This page can accept searchParams for filtering
export default async function AdminComplaintsPage({
    searchParams,
}: {
    searchParams: { status?: string }
}) {
    const statusFilter = searchParams.status || 'all';
    const complaints = await getAllComplaints({ status: statusFilter });

    const statusColors: Record<string, string> = {
        submitted: 'bg-blue-500',
        in_progress: 'bg-yellow-500',
        resolved: 'bg-green-500',
        rejected: 'bg-red-500',
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Manage Complaints</h2>
            </div>

            <div className="flex gap-2 pb-4">
                <Button variant={statusFilter === 'all' ? 'default' : 'outline'} asChild>
                    <Link href="/admin/complaints">All</Link>
                </Button>
                <Button variant={statusFilter === 'submitted' ? 'default' : 'outline'} asChild>
                    <Link href="/admin/complaints?status=submitted">Submitted</Link>
                </Button>
                <Button variant={statusFilter === 'in_progress' ? 'default' : 'outline'} asChild>
                    <Link href="/admin/complaints?status=in_progress">In Progress</Link>
                </Button>
                <Button variant={statusFilter === 'resolved' ? 'default' : 'outline'} asChild>
                    <Link href="/admin/complaints?status=resolved">Resolved</Link>
                </Button>
                <Button variant={statusFilter === 'rejected' ? 'default' : 'outline'} asChild>
                    <Link href="/admin/complaints?status=rejected">Rejected</Link>
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Complaint Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Citizen</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {complaints && complaints.length > 0 ? (
                            complaints.map((complaint: any) => (
                                <TableRow key={complaint.id}>
                                    <TableCell>
                                        {format(new Date(complaint.created_at), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="font-medium">{complaint.title}</TableCell>
                                    <TableCell>{complaint.category}</TableCell>
                                    <TableCell>
                                        {complaint.profiles?.name || complaint.profiles?.email || 'Unknown'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${statusColors[complaint.status] || 'bg-gray-500'} text-white capitalize`}>
                                            {complaint.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/admin/complaints/${complaint.id}`}>
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">View</span>
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

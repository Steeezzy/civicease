import { getComplaintById, updateComplaintStatus } from '@/lib/actions/admin.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function ComplaintDetailPage({ params }: { params: { id: string } }) {
    const complaint = await getComplaintById(params.id)

    async function handleStatusUpdate(formData: FormData) {
        'use server'
        const status = formData.get('status') as string
        const remark = formData.get('remark') as string

        await updateComplaintStatus(params.id, status, remark)
        // stay on page to show update
        redirect(`/admin/complaints/${params.id}`)
    }

    const statusColors: Record<string, string> = {
        submitted: 'bg-blue-500',
        in_progress: 'bg-yellow-500',
        resolved: 'bg-green-500',
        rejected: 'bg-red-500',
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <div>
                <Button variant="ghost" asChild className="pl-0 mb-4 hover:bg-transparent">
                    <Link href="/admin/complaints" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" /> Back to Complaints
                    </Link>
                </Button>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">{complaint.title}</h1>
                        <div className="flex gap-2 items-center text-sm text-muted-foreground">
                            <span>ID: {complaint.id}</span>
                            <span>•</span>
                            <span>{format(new Date(complaint.created_at), 'PHP')}</span>
                        </div>
                    </div>
                    <Badge className={`${statusColors[complaint.status] || 'bg-gray-500'} text-white capitalize text-base px-4 py-1`}>
                        {complaint.status.replace('_', ' ')}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap leading-relaxed">{complaint.description}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground">Category</Label>
                                <p className="font-medium">{complaint.category}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Location</Label>
                                <p className="font-medium">{complaint.location}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Priority</Label>
                                <p className="font-medium">{complaint.priority}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Citizen</Label>
                                <p className="font-medium">{complaint.profiles?.name || 'Unknown'}</p>
                                <p className="text-sm text-muted-foreground">{complaint.profiles?.email}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Sidebar */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Status</CardTitle>
                            <CardDescription>Change status and add remarks</CardDescription>
                        </CardHeader>
                        <form action={handleStatusUpdate}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select name="status" defaultValue={complaint.status}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="submitted">Submitted</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Admin Remarks</Label>
                                    <Textarea
                                        name="remark"
                                        placeholder="Add notes for the user..."
                                        defaultValue={complaint.admin_remark || ''}
                                        className="min-h-[120px]"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full">Update Complaint</Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div >
    )
}

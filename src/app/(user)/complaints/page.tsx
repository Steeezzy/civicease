import { getUserComplaints } from '@/lib/actions/complaint.actions'
import { ComplaintCard } from '@/components/complaints/ComplaintCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ComplaintsPage() {
    const complaints = await getUserComplaints()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">My Complaints</h1>
                <Button asChild>
                    <Link href="/complaints/new" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        New Complaint
                    </Link>
                </Button>
            </div>

            {complaints.length === 0 ? (
                <div className="text-center py-10 border rounded-lg bg-card">
                    <p className="text-muted-foreground mb-4">You haven't submitted any complaints yet.</p>
                    <Button asChild>
                        <Link href="/complaints/new">Submit your first complaint</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    {complaints.map((c) => (
                        <ComplaintCard key={c.id} complaint={c} />
                    ))}
                </div>
            )}
        </div>
    )
}

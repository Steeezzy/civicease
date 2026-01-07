import { getAdminStats } from '@/lib/actions/admin.actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardCharts } from '@/components/admin/DashboardCharts'

export default async function AdminDashboardPage() {
    const stats = await getAdminStats()

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold tracking-tight">Overview</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total}</div>
                    </CardContent>
                </Card>
            </div>

            <DashboardCharts stats={stats} />
        </div>
    )
}

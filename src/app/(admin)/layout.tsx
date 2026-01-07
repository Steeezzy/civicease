import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { Header } from '@/components/layout/Header'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen w-full bg-muted/40">
            <AdminSidebar />
            <div className="flex flex-col">
                {/* We can reuse the header or make a custom one. Reusing for now but we might want breadcrumbs later */}
                <div className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 md:ml-[220px] lg:ml-[280px]">
                    <h1 className="text-lg font-semibold">Administrator Panel</h1>
                </div>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 md:ml-[220px] lg:ml-[280px]">
                    {children}
                </main>
            </div>
        </div>
    )
}

import Link from 'next/link'
import { Home, FileText, Users, Building2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/lib/actions/auth.actions'

export function Sidebar() {
    return (
        <div className="hidden border-r bg-muted/40 md:block w-[220px] lg:w-[280px] h-screen fixed left-0 top-0 overflow-y-auto">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <span className="">CivicEase</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                            <Home className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/citizens"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                            <Users className="h-4 w-4" />
                            Citizens
                        </Link>
                        <Link
                            href="/families"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                            <UserPlus className="h-4 w-4" />
                            Families
                        </Link>
                        <Link
                            href="/marriages"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                            <Users className="h-4 w-4" />
                            Marriages
                        </Link>
                        <Link
                            href="/services"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                            <FileText className="h-4 w-4" />
                            Certificates
                        </Link>
                        <Link
                            href="/officials"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                        >
                            <Building2 className="h-4 w-4" />
                            Officials
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <form action={logout}>
                        <Button variant="outline" className="w-full flex gap-2">
                            {/* <LogOut className="h-4 w-4" /> */}
                            Logout
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Home, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Dashboard() {
    const [stats, setStats] = useState({
        citizens: 0,
        families: 0,
        servicesToday: 0,
        pending: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            const supabase = createClient();

            // Fetch counts (parallel)
            const [
                { count: citizensCount },
                { count: familiesCount },
                { count: servicesCount }
            ] = await Promise.all([
                supabase.from('persons').select('*', { count: 'exact', head: true }),
                supabase.from('families').select('*', { count: 'exact', head: true }),
                supabase.from('service_records').select('*', { count: 'exact', head: true }).gte('issue_date', new Date().toISOString().split('T')[0])
            ]);

            setStats({
                citizens: citizensCount || 0,
                families: familiesCount || 0,
                servicesToday: servicesCount || 0,
                pending: 0 // Placeholder
            });
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Citizens</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.citizens}</div>
                        <p className="text-xs text-muted-foreground">Registered in system</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Families</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.families}</div>
                        <p className="text-xs text-muted-foreground">Households managed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Services Issued Today</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.servicesToday}</div>
                        <p className="text-xs text-muted-foreground">Certificates & Services</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            Activity Chart Placeholder
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">No recent activity</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

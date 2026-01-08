"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ServicesListPage() {
    const [services, setServices] = useState<any[]>([]);
    const [serviceTypes, setServiceTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        service_type_id: '',
        family_name: ''
    });

    useEffect(() => {
        // Fetch Service Types
        fetch('/api/services/types')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setServiceTypes(data);
                } else {
                    console.error("Failed to fetch service types:", data);
                    setServiceTypes([]);
                }
            })
            .catch(err => {
                console.error("Error fetching service types:", err);
                setServiceTypes([]);
            });
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.service_type_id) params.append('service_type_id', filters.service_type_id);
            if (filters.family_name) params.append('family_name', filters.family_name);

            const res = await fetch(`/api/services?${params.toString()}`);
            const data = await res.json();

            if (Array.isArray(data)) {
                setServices(data);
            } else {
                console.error("Failed to fetch services:", data);
                setServices([]);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only fetch on mount

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Search Certificates</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="family_name">Family Name (Head of Family)</Label>
                            <Input
                                id="family_name"
                                placeholder="Search by Family Name..."
                                value={filters.family_name}
                                onChange={(e) => setFilters({ ...filters, family_name: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && fetchServices()}
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="service_type">Certificate Name</Label>
                            <select
                                id="service_type"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={filters.service_type_id}
                                onChange={(e) => setFilters({ ...filters, service_type_id: e.target.value })}
                            >
                                <option value="">All Certificates</option>
                                {serviceTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>
                        <Button onClick={fetchServices}>Search</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Issued Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Certificate</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Citizen Name</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Family (Head)</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Process History</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="h-24 text-center">Loading...</td>
                                    </tr>
                                ) : !Array.isArray(services) || services.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="h-24 text-center text-muted-foreground">No certificates found</td>
                                    </tr>
                                ) : (
                                    services.map((service) => (
                                        <tr key={service.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">{new Date(service.issue_date).toLocaleDateString()}</td>
                                            <td className="p-4 align-middle font-medium">{service.service_types?.name}</td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <span>{service.citizens?.full_name}</span>
                                                    <span className="text-xs text-muted-foreground">{service.citizens?.aadhar_number}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {service.citizens?.families?.head?.full_name || 'N/A'}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex items-center w-fit rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500/10 text-green-500 hover:bg-green-500/20">
                                                        Issued
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Processed on {new Date(service.issue_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

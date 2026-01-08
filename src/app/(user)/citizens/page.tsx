"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

export default function CitizensPage() {
    const [citizens, setCitizens] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/citizens')
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    console.error("Failed to fetch citizens:", data);
                    // Optionally set an error state here to show in UI
                    setCitizens([]);
                } else {
                    setCitizens(data);
                }
            })
            .catch(err => {
                console.error("Network error fetching citizens:", err);
                setCitizens([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Citizens</h1>
                <Link href="/citizens/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Citizen
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Citizen Directory</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Aadhar Number</TableHead>
                                <TableHead>Family</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : !Array.isArray(citizens) || citizens.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        {Array.isArray(citizens) ? "No citizens found" : "Error loading data"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                citizens.map((citizen) => (
                                    <TableRow key={citizen.id}>
                                        <TableCell className="font-medium">{citizen.full_name}</TableCell>
                                        <TableCell>{citizen.phone || 'N/A'}</TableCell>
                                        <TableCell>{citizen.aadhar_number || 'N/A'}</TableCell>
                                        <TableCell>{citizen.families ? `Address: ${citizen.families.address}` : 'Unassigned'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">View</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

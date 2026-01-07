"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";

export default function FamiliesPage() {
    const [families, setFamilies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/families')
            .then(data => {
                setFamilies(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Families</h1>
                <Link href="/families/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Family
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registered Families</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Head of Family</TableHead>
                                <TableHead>Family Name</TableHead>
                                <TableHead>Total Income</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : !Array.isArray(families) || families.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        {Array.isArray(families) ? "No families registered yet" : "Error loading data"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                families.map((family) => (
                                    <TableRow key={family.id}>
                                        <TableCell className="font-medium">{family.head?.full_name || 'N/A'}</TableCell>
                                        <TableCell>{family.family_name || 'N/A'}</TableCell>
                                        <TableCell>₹{family.total_annual_income}</TableCell>
                                        <TableCell>{family.address}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/families/${family.id}`}>
                                                <Button variant="ghost" size="sm">View Details</Button>
                                            </Link>
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

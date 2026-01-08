"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";

export default function MarriagesPage() {
    const [marriages, setMarriages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/marriages')
            .then(data => {
                setMarriages(data);
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
                <h1 className="text-3xl font-bold tracking-tight">Marriage Registry</h1>
                <Link href="/marriages/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Register Marriage
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registered Marriages</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Spouse 1</TableHead>
                                <TableHead>Spouse 2</TableHead>
                                <TableHead>Marriage Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : !Array.isArray(marriages) || marriages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No marriages registered
                                    </TableCell>
                                </TableRow>
                            ) : (
                                marriages.map((m) => (
                                    <TableRow key={m.marriage_id}>
                                        <TableCell>{m.spouse1?.full_name}</TableCell>
                                        <TableCell>{m.spouse2?.full_name}</TableCell>
                                        <TableCell>{m.marriage_date || 'N/A'}</TableCell>
                                        <TableCell>{m.divorce_date ? 'Divorced' : 'Married'}</TableCell>
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

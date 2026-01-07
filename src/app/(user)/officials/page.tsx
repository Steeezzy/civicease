"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OfficialsPage() {
    const [postings, setPostings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    // ideally we need to select an official (user profile). 
    // For now, simpler implementation: just text fields for demo or assume we have a list of users.
    // I'll implement a basic display.

    useEffect(() => {
        fetch('/api/officials')
            .then(res => res.json())
            .then(data => {
                setPostings(data);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Officials Management</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add Posting'}
                </Button>
            </div>

            {showForm && (
                <Card className="bg-muted/50">
                    <CardHeader>
                        <CardTitle>New Posting Assignment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 text-center text-muted-foreground">
                            Feature to assign postings to Revenue Officers would go here.
                            <br />
                            (Requires fetchings list of all users with role 'revenue_officer')
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Current Postings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Official Name</TableHead>
                                <TableHead>Designation</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
                            ) : postings.length === 0 ? (
                                <TableRow><TableCell colSpan={5}>No active postings found</TableCell></TableRow>
                            ) : (
                                postings.map((posting) => (
                                    <TableRow key={posting.id}>
                                        <TableCell className="font-medium">{posting.official?.full_name || 'Unknown'}</TableCell>
                                        <TableCell>{posting.designation}</TableCell>
                                        <TableCell>{posting.location}</TableCell>
                                        <TableCell>{posting.start_date}</TableCell>
                                        <TableCell>{posting.end_date || 'Present'}</TableCell>
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

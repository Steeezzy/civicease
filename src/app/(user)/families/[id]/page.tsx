"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

export default function FamilyDetailsPage() {
    const { id } = useParams();
    const [family, setFamily] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [availableCitizens, setAvailableCitizens] = useState<any[]>([]);
    const [selectedCitizen, setSelectedCitizen] = useState("");

    const fetchFamily = () => {
        api.get(`/families/${id}`)
            .then(data => {
                setFamily(data);
                setLoading(false);
            })
            .catch(console.error);
    };

    const fetchCitizens = () => {
        // Fetch all citizens to find unlinked ones for dropdown
        api.get('/citizens')
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter out those who already have a family
                    const unlinked = data.filter((c: any) => !c.family_id);
                    setAvailableCitizens(unlinked);
                }
            })
            .catch(console.error);
    }

    useEffect(() => {
        if (id) {
            fetchFamily();
            fetchCitizens();
        }
    }, [id]);

    const handleAddMember = async () => {
        if (!selectedCitizen) return;
        try {
            await api.post(`/families/${id}/members`, { citizen_id: selectedCitizen });
            setSelectedCitizen("");
            fetchFamily(); // Refresh to show new member and updated income
            fetchCitizens(); // Refresh dropdown
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleRemoveMember = async (citizenId: string) => {
        if (!confirm("Are you sure you want to remove this member?")) return;
        try {
            await api.delete(`/families/${id}/members/${citizenId}`);
            fetchFamily(); // Refresh
            fetchCitizens(); // Refresh dropdown
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!family) return <div>Family not found</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Family Details</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Family Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Head of Family:</span>
                            {/* Logic to find head name from members if not explicitly joined in main query, 
                                but our backend returns members array so we can find it */}
                            <span className="font-medium">
                                {family.members?.find((m: any) => m.id === family.family_head_id)?.full_name || 'Not Assigned'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Ration Card:</span>
                            <span className="font-medium">{family.ration_card_number}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Address:</span>
                            <span className="font-medium">{family.address}</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t">
                            <span className="text-muted-foreground font-bold">Total Annual Income:</span>
                            <span className="font-bold text-green-600">₹{family.total_annual_income}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            * Income is automatically calculated from linked members.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Members</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Select value={selectedCitizen} onValueChange={setSelectedCitizen}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Add Member..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCitizens.length === 0 ? (
                                        <SelectItem value="none" disabled>No unlinked citizens found</SelectItem>
                                    ) : (
                                        availableCitizens.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.full_name}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleAddMember} disabled={!selectedCitizen}>Add</Button>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Income</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {family.members?.map((member: any) => (
                                    <TableRow key={member.id}>
                                        <TableCell>{member.full_name}</TableCell>
                                        <TableCell>{member.id === family.family_head_id ? 'Head' : 'Member'}</TableCell>
                                        <TableCell>₹{member.income}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)} className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

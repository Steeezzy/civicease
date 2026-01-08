"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Plus, Search, UserPlus } from "lucide-react";
import { api } from "@/lib/api";

export default function FamiliesPage() {
    const [families, setFamilies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    // Family Selection Dialog state
    const [isSelectionOpen, setIsSelectionOpen] = useState(false);
    const [selectionStep, setSelectionStep] = useState<'SELECT_FAMILY' | 'CHOOSE_ACTION' | 'SELECT_CITIZEN'>('SELECT_FAMILY');
    const [selectedFamily, setSelectedFamily] = useState<any>(null);
    const [selectionQuery, setSelectionQuery] = useState("");
    const [citizenQuery, setCitizenQuery] = useState("");
    const [availableCitizens, setAvailableCitizens] = useState<any[]>([]);

    // Fetch citizens when dialog opens or step changes to SELECT_CITIZEN
    useEffect(() => {
        if (isSelectionOpen && selectionStep === 'SELECT_CITIZEN') {
            setLoading(true);
            fetch('/api/citizens')
                .then(res => res.json())
                .then(data => {
                    // Filter citizens who don't have a family_id
                    const unassigned = data.filter((c: any) => !c.family_id);
                    setAvailableCitizens(unassigned);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [isSelectionOpen, selectionStep]);

    const handleFamilySelect = (family: any) => {
        setSelectedFamily(family);
        setSelectionStep('CHOOSE_ACTION');
    };

    const handleAddExistingCitizen = async (citizenId: string) => {
        if (!selectedFamily) return;
        try {
            const res = await fetch(`/api/citizens/${citizenId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ family_id: selectedFamily.id })
            });

            if (res.ok) {
                // Success - close dialog and maybe refresh or redirect
                setIsSelectionOpen(false);
                setSelectionStep('SELECT_FAMILY');
                setSelectedFamily(null);
                // Ideally refresh data here
                window.location.reload(); // Simple reload for now to reflect changes
            } else {
                alert("Failed to add citizen to family");
            }
        } catch (error) {
            console.error(error);
            alert("Error adding citizen");
        }
    };

    const resetDialog = (open: boolean) => {
        setIsSelectionOpen(open);
        if (!open) {
            setTimeout(() => {
                setSelectionStep('SELECT_FAMILY');
                setSelectedFamily(null);
                setSelectionQuery("");
                setCitizenQuery("");
            }, 300);
        }
    };

    const filteredCitizens = availableCitizens.filter(citizen =>
        citizen.full_name?.toLowerCase().includes(citizenQuery.toLowerCase()) ||
        citizen.aadhar_number?.includes(citizenQuery)
    );

    const filteredFamilies = families.filter(family => {
        const query = searchQuery.toLowerCase();
        return (
            family.family_name?.toLowerCase().includes(query) ||
            family.head?.full_name?.toLowerCase().includes(query) ||
            family.address?.toLowerCase().includes(query)
        );
    });

    const filteredSelectionFamilies = families.filter(family => {
        const query = selectionQuery.toLowerCase();
        return (
            family.family_name?.toLowerCase().includes(query) ||
            family.head?.full_name?.toLowerCase().includes(query) ||
            family.address?.toLowerCase().includes(query)
        );
    });

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
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <h1 className="text-3xl font-bold tracking-tight">Families</h1>
                <div className="flex items-center space-x-2">
                    {showSearch && (
                        <div className="relative w-64 animate-in fade-in slide-in-from-right-4">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search families..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                                autoFocus
                            />
                        </div>
                    )}
                    <Button variant="outline" size="icon" onClick={() => setShowSearch(!showSearch)}>
                        <Search className="h-4 w-4" />
                    </Button>

                    <Dialog open={isSelectionOpen} onOpenChange={resetDialog}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <UserPlus className="mr-2 h-4 w-4" /> Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {selectionStep === 'SELECT_FAMILY' && "Select Family"}
                                    {selectionStep === 'CHOOSE_ACTION' && `Add Member to ${selectedFamily?.family_name}`}
                                    {selectionStep === 'SELECT_CITIZEN' && `Select Citizen for ${selectedFamily?.family_name}`}
                                </DialogTitle>
                            </DialogHeader>

                            {selectionStep === 'SELECT_FAMILY' && (
                                <div className="grid gap-4 py-4">
                                    <Input
                                        placeholder="Search family..."
                                        value={selectionQuery}
                                        onChange={(e) => setSelectionQuery(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="h-[300px] overflow-y-auto border rounded-md">
                                        {loading && families.length === 0 ? (
                                            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                                        ) : filteredSelectionFamilies.length === 0 ? (
                                            <div className="p-4 text-center text-sm text-muted-foreground">No families found</div>
                                        ) : (
                                            <div className="divide-y">
                                                {filteredSelectionFamilies.map((family) => (
                                                    <div
                                                        key={family.id}
                                                        className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer transition-colors"
                                                        onClick={() => handleFamilySelect(family)}
                                                    >
                                                        <div>
                                                            <p className="font-medium">{family.family_name}</p>
                                                            <p className="text-sm text-muted-foreground">{family.head?.full_name}</p>
                                                        </div>
                                                        <Button size="sm" variant="ghost">Select</Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {selectionStep === 'CHOOSE_ACTION' && (
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <Link href={`/citizens/new?familyId=${selectedFamily?.id}`}>
                                            <Button className="w-full justify-between h-auto py-4" variant="outline">
                                                <div className="flex flex-col items-start">
                                                    <span className="font-semibold">Register New Citizen</span>
                                                    <span className="text-xs text-muted-foreground">Create a new person record and add to this family</span>
                                                </div>
                                                <UserPlus className="h-5 w-5" />
                                            </Button>
                                        </Link>

                                        <Button
                                            className="w-full justify-between h-auto py-4"
                                            variant="outline"
                                            onClick={() => setSelectionStep('SELECT_CITIZEN')}
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className="font-semibold">Add Existing Citizen</span>
                                                <span className="text-xs text-muted-foreground">Select a person already in the system</span>
                                            </div>
                                            <Search className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <Button variant="ghost" onClick={() => setSelectionStep('SELECT_FAMILY')}>Back</Button>
                                </div>
                            )}

                            {selectionStep === 'SELECT_CITIZEN' && (
                                <div className="grid gap-4 py-4">
                                    <Input
                                        placeholder="Search citizen by name or Aadhar..."
                                        value={citizenQuery}
                                        onChange={(e) => setCitizenQuery(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="h-[300px] overflow-y-auto border rounded-md">
                                        {loading ? (
                                            <div className="p-4 text-center text-sm text-muted-foreground">Loading citizens...</div>
                                        ) : filteredCitizens.length === 0 ? (
                                            <div className="p-4 text-center text-sm text-muted-foreground">No unassigned citizens found</div>
                                        ) : (
                                            <div className="divide-y">
                                                {filteredCitizens.map((citizen) => (
                                                    <div
                                                        key={citizen.id}
                                                        className="flex items-center justify-between p-3 hover:bg-muted transition-colors"
                                                    >
                                                        <div>
                                                            <p className="font-medium">{citizen.full_name}</p>
                                                            <p className="text-sm text-muted-foreground">Aadhar: {citizen.aadhar_number || 'N/A'}</p>
                                                        </div>
                                                        <Button size="sm" onClick={() => handleAddExistingCitizen(citizen.id)}>Add</Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <Button variant="ghost" onClick={() => setSelectionStep('CHOOSE_ACTION')}>Back</Button>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Link href="/families/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Family
                        </Button>
                    </Link>
                </div>
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
                                filteredFamilies.map((family) => (
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

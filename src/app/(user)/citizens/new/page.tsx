"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function NewCitizenForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const familyId = searchParams.get('familyId');

    const [loading, setLoading] = useState(false);
    const [familyName, setFamilyName] = useState<string>("");
    const [formData, setFormData] = useState({
        full_name: "",
        dob: "",
        gender: "",
        phone: "",
        aadhar_number: "",
        income: 0,
        family_id: familyId || ""
    });

    useEffect(() => {
        if (familyId) {
            // Fetch family details to show name
            fetch(`/api/families/${familyId}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.family_name) {
                        setFamilyName(data.family_name);
                    }
                })
                .catch(err => console.error("Error fetching family:", err));
        }
    }, [familyId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/citizens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to create citizen');
            }

            // If added to a family, redirect to that family's details, otherwise list
            if (familyId) {
                router.push(`/families/${familyId}`);
            } else {
                router.push('/citizens');
            }
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Error creating citizen');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Basic Details
                    {familyName && <span className="ml-2 text-primary text-sm font-normal">(Adding to {familyName})</span>}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                required
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                                id="dob"
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="">Select Gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="aadhar">Aadhar Number</Label>
                        <Input
                            id="aadhar"
                            value={formData.aadhar_number}
                            onChange={(e) => setFormData({ ...formData, aadhar_number: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="income">Annual Income</Label>
                        <Input
                            id="income"
                            type="number"
                            value={formData.income}
                            onChange={(e) => setFormData({ ...formData, income: parseFloat(e.target.value) })}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Register Citizen'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

export default function NewCitizenPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Register New Citizen</h1>
            <Suspense fallback={<div>Loading form...</div>}>
                <NewCitizenForm />
            </Suspense>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateFamilyPage() {
    const router = useRouter();
    const [citizens, setCitizens] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        family_name: '',
        address: '',
        head_id: ''
    });

    useEffect(() => {
        // Fetch citizens to populate 'Head of Family' dropdown
        // Ideally we filter for those without a family, but list all for now or modify backend to support filter
        api.get('/citizens?family_id=null') // Assuming backend supports filtering or returns all
            .then(data => {
                if (Array.isArray(data)) setCitizens(data);
            })
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/families', formData);
            router.push('/families');
        } catch (err: any) {
            alert('Failed to create family: ' + err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Add New Family</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Family Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="family_name">Family Name</Label>
                            <Input
                                id="family_name"
                                value={formData.family_name}
                                onChange={e => setFormData({ ...formData, family_name: e.target.value })}
                                required
                                placeholder="e.g. The Smith Family"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Head of Family</Label>
                            <Select onValueChange={v => setFormData({ ...formData, head_id: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Head of Family" />
                                </SelectTrigger>
                                <SelectContent>
                                    {citizens.length === 0 ? (
                                        <SelectItem value="no_citizens" disabled>
                                            No eligible citizens found (Create one first)
                                        </SelectItem>
                                    ) : (
                                        citizens.map(c => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.full_name} ({c.aadhar_number})
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit">Create Family</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterMarriagePage() {
    const router = useRouter();
    const [citizens, setCitizens] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        spouse1_id: '',
        spouse2_id: '',
        marriage_date: ''
    });

    useEffect(() => {
        api.get('/citizens')
            .then(data => {
                if (Array.isArray(data)) setCitizens(data);
            })
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/marriages', formData);
            router.push('/marriages');
        } catch (err: any) {
            alert('Failed to register marriage: ' + err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Register Marriage</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Marriage Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Spouse 1</Label>
                            <Select onValueChange={v => setFormData({ ...formData, spouse1_id: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Spouse 1" />
                                </SelectTrigger>
                                <SelectContent>
                                    {citizens.map(c => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.full_name} ({c.id})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Spouse 2</Label>
                            <Select onValueChange={v => setFormData({ ...formData, spouse2_id: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Spouse 2" />
                                </SelectTrigger>
                                <SelectContent>
                                    {citizens.map(c => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.full_name} ({c.id})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Marriage Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.marriage_date}
                                onChange={e => setFormData({ ...formData, marriage_date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit">Register Marriage</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

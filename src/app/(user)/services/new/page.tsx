"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export default function IssueServicePage() {
    const router = useRouter();
    const [citizenId, setCitizenId] = useState("");
    const [serviceTypes, setServiceTypes] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        service_type_id: "",
        comments: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/services/types')
            .then(res => res.json())
            .then(data => setServiceTypes(data));
    }, []);

    const handleSearch = async () => {
        if (!searchQuery) return;
        const res = await fetch(`/api/citizens?search=${searchQuery}`);
        const data = await res.json();
        setSearchResults(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!citizenId) {
            setError("Please select a citizen first");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const res = await fetch('/api/services/issue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    citizen_id: citizenId,
                    ...formData
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to issue service');
            }

            router.push('/dashboard');
            alert("Service issued successfully!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Issue Service</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Select Citizen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search by Name, Phone or Aadhar"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button type="button" onClick={handleSearch}><Search className="h-4 w-4" /></Button>
                    </div>

                    {searchResults.length > 0 && (
                        <div className="border rounded-md p-2 space-y-2 max-h-40 overflow-y-auto">
                            {searchResults.map(citizen => (
                                <div
                                    key={citizen.id}
                                    className={`p-2 cursor-pointer hover:bg-muted ${citizenId === citizen.id ? 'bg-muted border-primary border' : ''}`}
                                    onClick={() => setCitizenId(citizen.id)}
                                >
                                    <div className="font-medium">{citizen.full_name}</div>
                                    <div className="text-xs text-muted-foreground">{citizen.aadhar_number} | {citizen.phone}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {citizenId && <div className="text-green-600 text-sm">Citizen Selected</div>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="service">Service Type</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={formData.service_type_id}
                                onChange={(e) => setFormData({ ...formData, service_type_id: e.target.value })}
                                required
                            >
                                <option value="">Select Service</option>
                                {serviceTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name} (Valid: {type.validity_days} days)</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="comments">Comments</Label>
                            <Input
                                id="comments"
                                value={formData.comments}
                                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={loading || !citizenId}>
                                {loading ? 'Issuing...' : 'Issue Service'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

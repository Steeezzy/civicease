'use client'

import { createComplaint } from '@/lib/actions/complaint.actions'
// import { useFormState } from 'react-dom' // Not using useFormState for simplicity first, or use simple form action
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

const CATEGORIES = ['Roads', 'Water', 'Electricity', 'Sanitation', 'Public Safety', 'Others']
const PRIORITIES = ['Low', 'Medium', 'High']

export default function NewComplaintPage() {
    // Basic interaction state
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setSubmitting(true)
        setMessage(null)

        const result = await createComplaint(null, formData)

        setSubmitting(false)
        if (result?.error) {
            setMessage(result.error)
        } else if (result?.success) {
            // Usually valid server actions redirect, but if we stay here:
            // setMessage('Complaint submitted successfully!')
            // Redirect handled in server action ideally, but let's see. 
            // In my server action I used revalidatePath but not redirect for success path explicitly to dashboard? 
            // Ah, I missed the redirect in the server action success case. 
            // Let's rely on the server action to redirect if I update it, 
            // or just redirect client side if success.
            window.location.href = '/dashboard'
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
            <div>
                <h1 className="text-2xl font-bold">New Complaint</h1>
                <p className="text-muted-foreground">Submit a new grievance to the municipal corporation.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Complaint Details</CardTitle>
                    <CardDescription>
                        Please provide accurate details to help us resolve the issue faster.
                    </CardDescription>
                </CardHeader>
                <form action={handleSubmit}>
                    <CardContent className="grid gap-4">
                        {message && (
                            <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive">
                                {message}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" placeholder="e.g., Pothole on Main Street" required maxLength={100} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe the issue in detail..."
                                required
                                maxLength={500}
                                className="min-h-[120px]"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="location">Location / Address</Label>
                            <Input id="location" name="location" placeholder="e.g., Near City Park, Sector 4" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select name="priority" defaultValue="Medium">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PRIORITIES.map(p => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Complaint'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

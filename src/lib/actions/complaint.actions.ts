'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const complaintSchema = z.object({
    title: z.string().min(5).max(100),
    category: z.enum(['Roads', 'Water', 'Electricity', 'Sanitation', 'Public Safety', 'Others']),
    description: z.string().min(10).max(500),
    location: z.string().min(5),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
})

export async function createComplaint(prevState: any, formData: FormData) {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const validatedFields = complaintSchema.safeParse({
        title: formData.get('title'),
        category: formData.get('category'),
        description: formData.get('description'),
        location: formData.get('location'),
        priority: formData.get('priority'),
    })

    if (!validatedFields.success) {
        return { error: 'Invalid fields', fieldErrors: validatedFields.error.flatten().fieldErrors }
    }

    const { error } = await supabase.from('complaints').insert({
        user_id: user.id,
        title: validatedFields.data.title,
        category: validatedFields.data.category,
        description: validatedFields.data.description,
        location: validatedFields.data.location,
        priority: validatedFields.data.priority || 'Medium',
        status: 'submitted'
    })

    if (error) {
        return { error: 'Failed to submit complaint: ' + error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/complaints')
    return { success: true }
}

export async function getUserComplaints() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
}

export async function getStats() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { total: 0, resolved: 0, pending: 0 }

    const { data, error } = await supabase
        .from('complaints')
        .select('status')
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)

    const total = data.length
    const resolved = data.filter(c => c.status === 'resolved').length
    const pending = data.filter(c => c.status === 'submitted' || c.status === 'in_progress').length

    return { total, resolved, pending }
}

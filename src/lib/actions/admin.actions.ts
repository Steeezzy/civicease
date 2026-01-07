import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.types'

type ComplaintWithProfile = Database['public']['Tables']['complaints']['Row'] & {
    profiles: { name: string; email: string } | null
}


async function checkAdmin() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/dashboard') // Redirect non-admins to user dashboard
    }
    return supabase
}

export async function getAdminStats() {
    const supabase = await checkAdmin()
    const { data: complaints, error } = await supabase.from('complaints').select('status, category')

    if (error) throw new Error(error.message)

    const total = complaints.length
    const submitted = complaints.filter(c => c.status === 'submitted').length
    const in_progress = complaints.filter(c => c.status === 'in_progress').length
    const resolved = complaints.filter(c => c.status === 'resolved').length
    const rejected = complaints.filter(c => c.status === 'rejected').length

    // Category breakdown
    const categoryCount: Record<string, number> = {}
    complaints.forEach(c => {
        categoryCount[c.category] = (categoryCount[c.category] || 0) + 1
    })

    // Format for Recharts
    const statusData = [
        { name: 'Submitted', value: submitted, fill: '#3b82f6' },
        { name: 'In Progress', value: in_progress, fill: '#eab308' },
        { name: 'Resolved', value: resolved, fill: '#22c55e' },
        { name: 'Rejected', value: rejected, fill: '#ef4444' },
    ]

    const categoryData = Object.entries(categoryCount).map(([name, value]) => ({
        name, value
    }))

    return { total, statusData, categoryData }
}

export async function getAllComplaints(filters?: any) {
    const supabase = await checkAdmin()
    let query = supabase.from('complaints').select('*, profiles(name, email)').order('created_at', { ascending: false })

    if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
    }

    // Basic search and filtering logic could be expanded here

    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data
}

export async function getComplaintById(id: string) {
    const supabase = await checkAdmin()
    const { data, error } = await supabase
        .from('complaints')
        .select('*, profiles(name, email)')
        .eq('id', id)
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function updateComplaintStatus(id: string, newStatus: string, remark?: string) {
    const supabase = await checkAdmin()

    const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
    }

    if (newStatus === 'resolved') {
        updateData.resolved_at = new Date().toISOString()
    }
    if (remark) {
        updateData.admin_remark = remark
    }

    const { error } = await supabase
        .from('complaints')
        .update(updateData)
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin/complaints')
    revalidatePath(`/admin/complaints/${id}`)
    return { success: true }
}

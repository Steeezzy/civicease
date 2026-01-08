'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect(`/login?message=${error.message}`)
    }

    // Check role
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role === 'higher_official') {
            // redirect('/admin/dashboard') // If we had a separate admin area
        }
    }

    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    // Validate inputs (basic)
    if (!email || !password || !name) {
        return { error: 'Missing fields' }
    }

    // SECURITY: Enforce Government Domain
    // Relaxed for development to allow easier testing
    // Also support @rev.gov as requested
    if (process.env.NODE_ENV !== 'development' && !email.endsWith('@revenue.gov') && !email.endsWith('@rev.gov')) {
        return redirect('/signup?message=Security Policy: Only official @revenue.gov or @rev.gov accounts are allowed.')
    }

    const supabase = createClient()

    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            }
        }
    })

    if (error) {
        return redirect(`/signup?message=${error.message}`)
    }

    // Create profile
    // Note: If you have a trigger on auth.users to create profiles, this might be duplicate.
    // But assuming no trigger, we insert here.
    if (data.user) {
        // We use full_name in DB, and default role is revenue_officer
        const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: name,
            role: 'revenue_officer', // Default role
        })

        if (profileError) {
            console.error("Profile creation failed:", profileError)
            // Check if it failed because it already exists (trigger?)
        }
    }

    redirect('/login?message=Account created! Please sign in.')
}

export async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

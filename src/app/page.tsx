import { redirect } from 'next/navigation'

export default function Home() {
  // For now, redirect to login. Future: Landing page.
  redirect('/login')
}

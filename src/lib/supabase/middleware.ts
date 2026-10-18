import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-fallback.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_fallback_key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Admin authorization list
  const envAdminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  const allowedEmails = new Set([
    'arko@codecantalk.com',
    'lateliermaisonatl@gmail.com',
    ...envAdminEmails,
  ])

  const userEmail = (user?.email || '').toLowerCase().trim()
  const isAuthorized = user && userEmail && allowedEmails.has(userEmail)

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!isAuthorized) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in admin away from login page
  if (request.nextUrl.pathname.startsWith('/admin/login') && isAuthorized) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

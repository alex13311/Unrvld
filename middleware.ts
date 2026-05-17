import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAuthed = !!req.auth
  const path = req.nextUrl.pathname
  const isPublic = path === '/' || path.startsWith('/api/auth')

  if (!isAuthed && !isPublic) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  if (isAuthed && path === '/') {
    return NextResponse.redirect(new URL('/chat', req.url))
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher([
    '/',
    '/assistant',
    '/assistant-status'
])

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) auth().protect()
}, {
    authorizedParties: ['http://localhost:3000', 'https://sherlockaicoach.vercel.app']
})

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
}
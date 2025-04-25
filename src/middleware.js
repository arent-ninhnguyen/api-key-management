import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // console.log(req.nextauth.token) // You can access the session token here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // If there is a token, the user is authorized
    },
    pages: {
      signIn: '/', // Redirect users to the homepage for login
      // error: '/auth/error', // Optional: specify a custom error page
    },
  }
);

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboards/:path*', // Protect the dashboards page and any sub-paths
    '/playground/:path*',  // Protect the playground page and any sub-paths
    '/protected/:path*'    // Also protect the original /protected route if it's still used
  ],
}; 
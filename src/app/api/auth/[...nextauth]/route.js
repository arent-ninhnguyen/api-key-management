import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here if needed
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // Add callbacks to include user ID and potentially access tokens in the session
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken; // Example: make access token available
      // Add the user's ID (subject from the JWT token) to the session object
      session.user.id = token.sub;
      return session;
    }
  }
  // If you want to persist users to a database later, add an adapter here
  // adapter: YourDatabaseAdapter(),
};

const handler = NextAuth(authOptions);

// Export the handlers for GET and POST requests
export { handler as GET, handler as POST }; 
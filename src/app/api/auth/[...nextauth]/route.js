import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Test Account",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (creds?.username === "test" && creds?.password === "test123") {
          return { id: "1", name: "Test User", email: "test@example.com" }
        }
        return null
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 20, // 20 minutes
    updateAge: 0,    // no auto-refresh
  },

  callbacks: {
    async jwt({ token, user }) {
      const now = Math.floor(Date.now() / 1000)

      if (user) {
        token.id = user.id
        token.iat = now
        token.exp = now + 60 * 20
      }

      if (token.exp && now > token.exp) return {}

      return token
    },

    async session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

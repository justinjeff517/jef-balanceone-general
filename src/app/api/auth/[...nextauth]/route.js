// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { encode } from "next-auth/jwt"

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

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
    async jwt({ token, user, account }) {
      const now = Math.floor(Date.now() / 1000)

      // first sign-in: stash id, iat, exp, and raw OAuth token if present
      if (user) {
        token.id  = user.id
        token.iat = now
        token.exp = now + 60 * 20

        if (account?.access_token) {
          // GitHub or other OAuth
          token.accessToken = account.access_token
        } else {
          // CredentialsProvider: generate a NextAuth JWT as your "accessToken"
          token.accessToken = await encode({
            token,
            secret: process.env.NEXTAUTH_SECRET
          })
        }
      }

      // if expired, force re-sign-in
      if (token.exp && now > token.exp) {
        return {}
      }

      return token
    },

    async session({ session, token }) {
      // surface both user.id and the string token on the client
      session.user.id       = token.id
      session.accessToken   = token.accessToken
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

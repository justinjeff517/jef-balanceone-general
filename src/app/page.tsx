"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Page(): JSX.Element {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p>Loading…</p>
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{session ? "Welcome Back!" : "Please Sign In"}</CardTitle>
          <CardDescription>
            {session
              ? `Signed in as ${session.user?.email}`
              : "Access your account to continue."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* could add form inputs here if using credentials provider */}
        </CardContent>
        <CardFooter className="flex justify-end">
          {session ? (
            <Button onClick={() => signOut()}>Sign Out</Button>
          ) : (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}

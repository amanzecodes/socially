import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { getUserByClerkId } from "@/actions/user.action"
import Link from "next/link"
import { Avatar, AvatarImage } from "./ui/avatar"

async function Sidebar() {
const authUser = await currentUser()
if(!authUser) return <UnAuthenticatedSidebar />

const user = await getUserByClerkId(authUser.id)
if(!user) return null

console.log({user})
  return (
    <div className="stick top-20">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link href={`/profile/${authUser.username ?? authUser.emailAddresses[0].emailAddress.split("@")[0]}`}
          className="flex flex-col items-center justify-center">
            <Avatar className="w-20 h-20 border-2">
              <AvatarImage src={user.image || '/avatar.png'} />
            </Avatar>
          </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default Sidebar

const UnAuthenticatedSidebar = () => (
    <div className="sticky top-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">Welcome Back!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            Login to access your profile and connect with others.
          </p>
          <SignInButton mode="modal">
            <Button className="w-full" variant="outline">
              Login
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="w-full mt-2" variant="default">
              Sign Up
            </Button>
          </SignUpButton>
        </CardContent>
      </Card>
    </div>
  );
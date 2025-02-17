import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { ArrowRight, LogIn } from "lucide-react"
import Link from "next/link"
import FileUpload from "@/components/shared/FileUpload"

export default async function Home() {
  const { userId, redirectToSignIn } = await auth()
  //if (!userId) return redirectToSignIn() //redirect the user to the sign-in page if they are not authenticated

  const isAuth = !!userId
//console.log("userId:", userId); // Check if userId is populated
//console.log("isAuth:", auth); // Check if user is authenticated

  return (
      <div className="w-screen min-h-screen bg-gradient-to-r from-teal-400 to-gray-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center md:grid-cols-2">
            <div className="flex items-center">
            <h1 className="mr-8 text-5xl font-semibold">Chat with any PDF </h1>
            <UserButton afterSignOutUrl="/" />
            </div>
            
          <div className="flex mt-2">
            {isAuth && (<Button> Go to Chats <ArrowRight/> </Button>)} 
             
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-900 text-justify"> Join millions of students, researchers, and professionals  who are revolutionizing the way they learn and work.
            Get precise answers, and and gain deeper insights in seconds—Smarter learning and working starts here!
          </p>
          
            <div className="w-full mt-4 flex justify-center">
              {isAuth ? (<FileUpload/>) : 
              (
                <Link href="/sign-in">
                  <Button>Login to get started
                    <LogIn className="w-4 h-4 ml-2"/>
                  </Button>
                  
                </Link>
              )}
            </div>
          
          </div>
        </div>
      </div>


    


  )
}

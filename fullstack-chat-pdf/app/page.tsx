"use server";

import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { ArrowRight, LogIn } from "lucide-react"
import Link from "next/link"

export default async function Home() {

const {userId} = await auth()
const isAuth = !!userId
console.log("userId:", userId); // Check if userId is populated
console.log("isAuth:", isAuth);

  return (
      <div className="w-screen min-h-screen bg-gradient-to-r from-teal-400 to-gray-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center">
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
              {isAuth ? (<h1>fileupload</h1>) : 
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

import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/shared/Providers";
import {Toaster} from 'react-hot-toast'

const poppins = Poppins({
  subsets: ['latin'],
  variable: "--font-poppins",
  weight: ['400', '500', '600', '700']

});

export const metadata: Metadata = {
  title: "ChatPDF",
  description: "AI PDF chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Providers>
        <html lang="en">
          <body
            className={poppins.variable}> 
            
              {children} 
              <Toaster 
                position="top-right" 
                reverseOrder={false}
              />
            
          </body>
            
        </html>
        
        </Providers>
    </ClerkProvider>
  );
}

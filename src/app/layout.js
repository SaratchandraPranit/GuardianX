import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";
import LegalGuide from "@/components/legalGuide";
import Image from "next/image";
import logo from "../../public/guardianx-logo.svg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GuardianX",
  description: "Tech-Powered Security & Empowerment",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-full`}
      >
        <div className=" hidden md:flex z-10 fixed justify-start   p-2 pt-0 rounded-b-lg items-center ml-20">
          <Image
            className=""
            src={logo}
            alt="GuardianX Logo"
            width={70}
            height={70}
          />
          <p className="text-2xl font-bold logo-font">GuardianX</p>
        </div>
        <div className="h-full w-full flex flex-row">
          <Navbar />
          <div className="flex-1 md:m-6">{children}</div>
          <Toaster position="top-right" />
          <LegalGuide />
        </div>
      </body>
    </html>
  );
}

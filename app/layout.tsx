import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import UserMenu from "@/components/layout/UserMenu";
import AdminGuard from "@/components/auth/AdminGuard";
import AuthInit from "@/components/auth/AuthInit";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movie Management",
  description: "Movie CRUD Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <AuthInit /> */}
        {/* <AdminGuard>
          {" "} */}
        <Navbar />
        <main>{children}</main>
        {/* </AdminGuard> */}
      </body>
    </html>
  );
}

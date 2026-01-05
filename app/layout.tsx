import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import UserMenu from "@/components/layout/UserMenu";
import AdminGuard from "@/components/auth/AdminGuard";
import AuthInit from "@/components/auth/AuthInit";

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
        <nav className="bg-gray-800 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold">🎬 Movie Management</h1>
                </div>
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    href="/"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/movies"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700"
                  >
                    Movies
                  </Link>
                  <Link
                    href="/franchises"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700"
                  >
                    Franchises
                  </Link>
                  <Link
                    href="/genres"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700"
                  >
                    Thể loại
                  </Link>
                  <Link
                    href="/episodes"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700"
                  >
                    Tập phim
                  </Link>
                  <Link
                    href="/users"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gray-900 text-white hover:bg-gray-700"
                  >
                    Người dùng
                  </Link>
                </div>
              </div>
              <UserMenu />
            </div>
          </div>
        </nav>
        <main>{children}</main>
        {/* </AdminGuard> */}
      </body>
    </html>
  );
}

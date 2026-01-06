// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/layout/UserMenu";

export default function Navbar() {
  const path = usePathname();
  const showNavbar = !path?.startsWith("/auth");

  if (!showNavbar) return null;

  return (
    <nav className="bg-gray-800 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">🎬 Movie Management</h1>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              {[
                { href: "/", label: "Dashboard" },
                { href: "/movies", label: "Movies" },
                { href: "/franchises", label: "Franchises" },
                { href: "/genres", label: "Thể loại" },
                { href: "/episodes", label: "Tập phim" },
                { href: "/users", label: "Người dùng" },
                { href: "/servers", label: "Servers" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 ${
                    path === link.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}

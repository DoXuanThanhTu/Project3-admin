"use client";

import UserList from "@/components/users/UserList";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UserList />
      </div>
    </div>
  );
}

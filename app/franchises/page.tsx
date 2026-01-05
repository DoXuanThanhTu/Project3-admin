"use client";

import FranchiseList from "@/components/franchises/FranchiseList";

export default function FranchisesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FranchiseList />
      </div>
    </div>
  );
}

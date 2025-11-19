"use client";

import HRDashboard from "@/component/HRDashboard";
import UserDashboard from "@/component/UserDashboard";
import { useAuth } from "@/provider/AuthProvider";

export default function DashboardPage() {
  const { user, role, isAccepted, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  if (!isAccepted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl">Your account is not yet accepted.</h1>
      </div>
    );
  }

  if (role === "hr") {
    return (
      <HRDashboard/>
    );
  }

  // Normal user dashboard
  return (
      <UserDashboard/>
  );
}

"use client";

import Header from "../../components/common/Header";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  // Inline StatCard component
  const StatCard = ({
    label,
    value,
    badgeColor,
  }: {
    label: string;
    value: number;
    badgeColor: string;
  }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
      <div
        className={`w-10 h-10 rounded-full ${badgeColor} flex items-center justify-center text-white text-lg font-bold mb-3`}
      >
        {value}
      </div>
      <p className="text-gray-700 text-sm font-semibold text-center">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-8 space-y-10">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome, Admin</h2>
          <p className="text-gray-500 text-sm">System monitoring overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            onClick={() => router.push("/patients")}
            className="cursor-pointer hover:scale-[1.03] transition-transform"
          >
            <StatCard
              label="Patients Monitored"
              value={120}
              badgeColor="bg-indigo-500"
            />
          </div>

          <div
            onClick={() => router.push("/alerts")}
            className="cursor-pointer hover:scale-[1.03] transition-transform"
          >
            <StatCard label="Active Alerts" value={4} badgeColor="bg-red-500" />
          </div>

          <div
            onClick={() => router.push("/calls")}
            className="cursor-pointer hover:scale-[1.03] transition-transform"
          >
            <StatCard
              label="Calls Today"
              value={82}
              badgeColor="bg-green-500"
            />
          </div>
        </div>

        {/* Onboarding Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Facility Onboarding Status
          </h3>

          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <strong>EHR Sync :</strong> Successful
            </p>
            <p>
              <strong>Last Sync :</strong> 2 hours ago
            </p>
            <p>
              <strong>Pending Confirmation :</strong> 3 Patients
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

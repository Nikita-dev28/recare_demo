"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../../components/common/Header";
import { useRouter } from "next/navigation";

type AlertItem = {
  patientId: string;
  patientName: string;
  createdAt: string;
  alertType: string;
  details: string;
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "ACKNOWLEDGED" | "CLOSED";
  source: string;
};

const DUMMY_ALERTS: AlertItem[] = [
  {
    patientId: "1001",
    patientName: "John Doe",
    createdAt: "2025-11-10T08:45",
    alertType: "Fall Risk Increase",
    details: "AI detected increased fall-risk score after wellness call.",
    risk: "HIGH",
    status: "OPEN",
    source: "Automated Call",
  },
  {
    patientId: "1002",
    patientName: "Maria Garcia",
    createdAt: "2025-11-10T07:30:00Z",
    alertType: "Missed Medication",
    details: "Patient reported missed dose of antihypertensive.",
    risk: "MEDIUM",
    status: "ACKNOWLEDGED",
    source: "Automated Call",
  },
  {
    patientId: "1003",
    patientName: "William Smith",
    createdAt: "2025-11-09T20:10:00Z",
    alertType: "Abnormal Vitals",
    details: "Device reported elevated heart rate (HR 124).",
    risk: "CRITICAL",
    status: "OPEN",
    source: "Device",
  },
  {
    patientId: "1004",
    patientName: "Emily Johnson",
    createdAt: "2025-11-09T18:00:00Z",
    alertType: "Respiratory Complaint",
    details: "Patient mentioned shortness of breath on follow-up call.",
    risk: "HIGH",
    status: "OPEN",
    source: "Automated Call",
  },
  {
    patientId: "1005",
    patientName: "A. Patel",
    createdAt: "2025-11-08T12:20:00Z",
    alertType: "Temperature Spike",
    details: "Temperature 38.5°C recorded by nurse.",
    risk: "MEDIUM",
    status: "CLOSED",
    source: "Nurse Report",
  },
];

const riskBadgeClass = (risk: AlertItem["risk"]) => {
  switch (risk) {
    case "CRITICAL":
      return "text-white bg-red-700";
    case "HIGH":
      return "text-red-600 bg-red-50";
    case "MEDIUM":
      return "text-yellow-600 bg-yellow-50";
    default:
      return "text-green-700 bg-green-50";
  }
};

export default function AlertsPage() {
  const router = useRouter();

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    const t = setTimeout(() => {
      setAlerts(DUMMY_ALERTS);
    }, 50);

    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let items = alerts.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.alertType.toLowerCase().includes(q) ||
          a.details.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q)
      );
    }

    if (riskFilter !== "ALL") {
      items = items.filter((a) => a.risk === riskFilter);
    }

    if (statusFilter !== "ALL") {
      items = items.filter((a) => a.status === statusFilter);
    }

    items.sort(
      (x, y) =>
        new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime()
    );

    return items;
  }, [alerts, query, riskFilter, statusFilter]);

  const acknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.patientId === id ? { ...a, status: "ACKNOWLEDGED" } : a
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="text-sm mt-9 ml-8 text-emerald-600 hover:text-emerald-700 font-medium"
      >
        ← Back to Dashboard
      </button>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Alerts</h1>
          <p className="text-sm text-gray-500">
            Real-time and AI-detected alerts. Masked patient data shown.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <input
            aria-label="Search alerts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by patient, alert type, details..."
            className="w-[300px] px-3 py-2 border rounded-sm focus:outline-none"
          />

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 border rounded-sm"
            aria-label="Filter by risk"
          >
            <option value="ALL">All Risks</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-sm"
            aria-label="Filter by status"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Alerts Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-700">Patient</th>
                <th className="px-4 py-3 font-medium text-gray-700">Alert</th>
                <th className="px-4 py-3 font-medium text-gray-700">Created</th>
                <th className="px-4 py-3 font-medium text-gray-700">Source</th>
                <th className="px-4 py-3 font-medium text-gray-700">Risk</th>
                <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No alerts to display.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr
                    key={a.patientId}
                    className="hover:bg-gray-50 transition"
                    tabIndex={0}
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold border border-gray-200">
                          {a.patientName
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <div className="text-gray-800 font-medium">
                            {a.patientName}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-gray-800">
                        {a.alertType}
                      </div>
                      <div className="text-xs text-gray-500 max-w-sm truncate">
                        {a.details}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="text-gray-700 text-sm">
                        {new Date(a.createdAt).toLocaleString().slice(0, -3)}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="text-sm text-gray-600">{a.source}</div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${riskBadgeClass(
                          a.risk
                        )}`}
                      >
                        {a.risk}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div className="text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            a.status === "OPEN"
                              ? "bg-red-50 text-red-600"
                              : a.status === "ACKNOWLEDGED"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => acknowledge(a.patientId)}
                          disabled={a.status === "ACKNOWLEDGED"}
                          className={`px-3 py-1 text-sm rounded-md border ${
                            a.status === "ACKNOWLEDGED"
                              ? "border-gray-200 text-gray-400 cursor-not-allowed"
                              : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          }`}
                          aria-disabled={a.status === "ACKNOWLEDGED"}
                        >
                          Acknowledge
                        </button>

                        <button
                          onClick={() =>
                            router.push(`/patients/${a.patientId}`)
                          }
                          className="cursor-pointer px-3 py-1 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

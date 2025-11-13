"use client";

import Header from "../../components/common/Header";
import { useRouter } from "next/navigation";

export default function CallsPage() {
  const router = useRouter();

  const callLogs = [
    {
      id: "1",
      patientName: "John Doe",
      callTime: "01-12-2025",
      callStatus: "ANSWERED",
      aiSummary: "Patient reported feeling fine and took medication.",
      riskLevel: "NORMAL",
    },
    {
      id: "2",
      patientName: "Maria Garcia",
      callTime: "01-12-2025",
      callStatus: "ANSWERED",
      aiSummary: "Patient mentioned unusual fatigue.",
      riskLevel: "MEDIUM",
    },
    {
      id: "3",
      patientName: "William Smith",
      callTime: "12-01-2025",
      callStatus: "NOT ANSWERED",
      aiSummary: "Voicemail left. Awaiting callback.",
      riskLevel: "NORMAL",
    },
    {
      id: "4",
      patientName: "Emily Johnson",
      callTime: "12-01-2025",
      callStatus: "ANSWERED",
      aiSummary: "Patient reported chest discomfort with breathing.",
      riskLevel: "HIGH",
    },
  ];

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
      <div className="p-6 max-w-6xl mx-auto">
        {/* Page Title */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Automated Wellness Call Logs
        </h2>

        {/* Table Container */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left">Patient</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">AI Summary</th>
                <th className="p-3 text-left">Risk</th>
              </tr>
            </thead>

            <tbody>
              {callLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b-gray-50 hover:bg-gray-50 transition"
                >
                  <td className="p-3">{log.patientName}</td>
                  <td className="p-3">{log.callTime}</td>
                  <td className="p-3">{log.callStatus}</td>
                  <td className="p-3 text-gray-700">{log.aiSummary}</td>
                  <td
                    className={`p-3 font-semibold ${
                      log.riskLevel === "HIGH"
                        ? "text-red-600"
                        : log.riskLevel === "MEDIUM"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {log.riskLevel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

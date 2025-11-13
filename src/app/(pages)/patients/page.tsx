"use client";

import Header from "@/app/components/common/Header";
import { patientListApi } from "@/services/APIClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  age?: number;
  dialcode?: number;
  email?: string;
  gender?: string;
  phoneNumber?: string;
  status: boolean;
  approvalStatus?: string;
}

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [patientList, setPatientList] = useState<Patient[]>([]);
  const router = useRouter();

  const fetchCustomerList = async () => {
    try {
      const res = await patientListApi();
      console.log("Patient List Response:", res.data?.data);
      if (res?.data?.success) {
        setPatientList(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching patient list:", error);
    }
  };

  useEffect(() => {
    fetchCustomerList();
  }, []);

  // ✅ Search by name instead of ID
  const filteredPatients = patientList.filter((p) => {
    const name = `${p.firstName} ${p.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const statusStyle = (status: boolean) => {
    return status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  const getInitials = (first?: string, last?: string) => {
    const fi = first ? first.charAt(0).toUpperCase() : "";
    const li = last ? last.charAt(0).toUpperCase() : "";
    return `${fi}${li}` || "P";
  };

  // ✅ Mask phone showing only last 4 digits
  const maskPhone = (dialCode?: number, phone?: string | number) => {
    if (!phone) return null;
    const str = String(phone);
    const digits = str.replace(/\D/g, "");
    if (!digits) return null;
    const last4 = digits.slice(-4);
    const cc = dialCode ? `+${dialCode} ` : "";
    return `${cc}••••${last4}`;
  };

  // ✅ Updated to use dialcode field
  const contactDisplay = (patient: Patient) => {
    const maskedPhone = maskPhone(patient.dialcode, patient.phoneNumber);
    return maskedPhone ?? "••••";
  };

  const encodeIdForRoute = (id: string) => {
    try {
      return encodeURIComponent(btoa(id));
    } catch {
      return encodeURIComponent(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="p-8 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          ← Back to Dashboard
        </button>

        <h2 className="text-2xl font-bold text-gray-900">Patient List</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search patient by name..."
          className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Patients Table */}
        <div className="bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Patient
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Age
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const initials = getInitials(
                    patient.firstName,
                    patient.lastName
                  );
                  const statusText = patient.approvalStatus
                    ? patient.approvalStatus
                    : patient.status
                    ? "Active"
                    : "Inactive";
                  const routeId = encodeIdForRoute(patient._id);

                  return (
                    <tr
                      key={patient._id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td
                        className="cursor-pointer px-6 py-4 flex items-center space-x-3"
                        onClick={() => {
                          router.push(`/patient-detail/${routeId}`);
                        }}
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-semibold border border-gray-200">
                          <span className="text-sm">{initials}</span>
                        </div>
                        <span className="text-gray-800">
                          {patient.firstName} {patient.lastName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {contactDisplay(patient)}
                      </td>

                      <td className="px-6 py-4 text-gray-600">{patient.age}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(
                            patient.status
                          )}`}
                        >
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

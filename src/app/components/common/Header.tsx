"use client";

import { removeDeviceToken, removeToken } from "@/services/APIInstance";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    removeDeviceToken();
    router.push("/");
  };

  return (
    <header className="w-full bg-emerald-100 px-8 py-4 flex items-center justify-between shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
        reCare
      </h1>

      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-md transition"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;

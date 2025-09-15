"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Button } from "../components/ui/button";


export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login"); // This will actually navigate
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      // If no token, redirect to login
      navigate("/login");
      return;
    }

    fetch("http://localhost:3000/dashboard/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
        localStorage.setItem("email", data.email);
      })
      .catch((error) => {
        console.error("Profile fetch error:", error);
        setLoading(false);
        // If API call fails (e.g., invalid token), logout
        handleLogout();
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <p className="text-center mt-10">Could not load profile.</p>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-xl rounded-2xl">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-20 h-20 bg-indigo-500 text-white flex items-center justify-center rounded-full text-3xl font-bold shadow-md">
          {profile.username?.[0] || "U"}
        </div>
        <h1 className="mt-3 text-2xl font-semibold">
          Hey there, <span className="text-indigo-600">{profile.username}</span> 👋
        </h1>
        <p className="text-gray-500 text-sm">Anything interesting happening lately?</p>
      </div>

      {/* Profile Info */}
      <div className="space-y-4">
        <ProfileField label="Email" value={profile.email} />
        <ProfileField label="Name" value={`${profile.firstName} ${profile.lastName}`} />
        <ProfileField label="Bank" value={profile.bankName} />
        <ProfileField label="Account" value={profile.accountNumber} />
      </div>

      {/* Edit Button */}
      <div className="mt-6 flex justify-center">
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 shadow-md transition">
          <Pencil size={18} />
          Edit Profile
        </button>
      </div>

      {/* Logout Button */}
      <div className="mt-6 flex justify-center">
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800">{value || "—"}</span>
    </div>
  );
}
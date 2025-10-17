"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Check, X, Home, Wallet } from "lucide-react";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { BASE_URL } from "@/config/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${BASE_URL}/dashboard/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          username: data.username || "",
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/login");
      });
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${BASE_URL}/user/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setProfile(updated);
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white shadow-2xl rounded-3xl mt-10 space-y-6">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="w-20 h-20 rounded-full mb-4" />
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-3 mt-6">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
        <div className="text-center mt-4">
          <Skeleton className="h-10 w-28 mx-auto rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-2xl rounded-3xl mt-10 space-y-6">
      {/* Notification */}
      {message && (
        <div
          className={`text-white px-4 py-2 rounded-md ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/app/dashboard")} className="flex items-center gap-2">
          <Home size={18} />
          Go Home
        </Button>
        <Button variant="outline" onClick={() => navigate("/app/wallet")} className="flex items-center gap-2">
          <Wallet size={18} />
          Wallet
        </Button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-indigo-500 text-white flex items-center justify-center rounded-full text-3xl font-bold shadow-lg">
          {profile.username?.[0]?.toUpperCase() || "U"}
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">
          Hey, <span className="text-indigo-600">{profile.username}</span> 👋
        </h1>
        <p className="text-gray-500 text-sm">Manage your account details below</p>
      </div>

      {/* Editable Form */}
      <div className="space-y-5">
        <EditableField label="First Name" name="firstName" value={formData.firstName} editing={editing} onChange={handleChange} />
        <EditableField label="Last Name" name="lastName" value={formData.lastName} editing={editing} onChange={handleChange} />
        <EditableField label="Email" name="email" value={formData.email} editing={editing} onChange={handleChange} />
        <EditableField label="Username" name="username" value={formData.username} editing={editing} onChange={handleChange} />
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-center gap-3">
        {!editing ? (
          <Button onClick={() => setEditing(true)} className="flex items-center gap-2">
            <Pencil size={18} />
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-solid"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Save
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setEditing(false)}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300"
            >
              <X size={18} />
              Cancel
            </Button>
          </>
        )}
      </div>

      {/* Logout */}
      <div className="text-center">
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}

function EditableField({
  label,
  name,
  value,
  editing,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  editing: boolean;
  onChange: any;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-500 text-sm font-medium mb-1">{label}</label>
      {editing ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <p className="text-gray-800 font-medium">{value || "—"}</p>
      )}
    </div>
  );
}
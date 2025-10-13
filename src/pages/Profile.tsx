"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Check, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { BASE_URL } from "@/config/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
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
    try {
      const res = await fetch(`${BASE_URL}/users/update-profile`, {
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
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-500">
        Loading profile...
      </div>
    );

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-2xl rounded-3xl mt-10">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-6">
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
        <EditableField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          editing={editing}
          onChange={handleChange}
        />
        <EditableField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          editing={editing}
          onChange={handleChange}
        />
        <EditableField
          label="Email"
          name="email"
          value={formData.email}
          editing={editing}
          onChange={handleChange}
        />
        <EditableField
          label="Username"
          name="username"
          value={formData.username}
          editing={editing}
          onChange={handleChange}
        />
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
            <Button onClick={handleSave} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Check size={18} />
              Save
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
      <div className="mt-6 text-center">
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

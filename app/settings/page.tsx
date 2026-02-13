/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthInput from "@/app/components/AuthInput";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  // Change Display Name State
  const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState<string | null>(null);
  const [nameLoading, setNameLoading] = useState(false);

  // Change Email State
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete Account State
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Change Display Name Handler
  async function handleChangeName(e: React.FormEvent) {
    e.preventDefault();
    setNameError(null);
    setNameSuccess(null);
    setNameLoading(true);

    try {
      const res = await fetch("/api/user/change-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setNameError(data.error || "Failed to change display name");
      } else {
        setNameSuccess(data.message);
        setNewName("");
        // Update the session to reflect the new name
        console.log("Updating session...");
        const updatedSession = await update();
        console.log("Session updated:", updatedSession);
      }
    } catch (error) {
      console.error("Error changing name:", error);
      setNameError("An error occurred. Please try again.");
    } finally {
      setNameLoading(false);
    }
  }

  // Change Email Handler
  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);
    setEmailLoading(true);

    try {
      const res = await fetch("/api/user/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail, password: emailPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEmailError(data.error || "Failed to change email");
      } else {
        setEmailSuccess(data.message);
        setNewEmail("");
        setEmailPassword("");
        // Sign out user since email verification is required
        setTimeout(() => {
          signOut({ callbackUrl: "/auth/signin" });
        }, 2000);
      }
    } catch (error) {
      setEmailError("An error occurred. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  }

  // Change Password Handler
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Failed to change password");
      } else {
        setPasswordSuccess(data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  }

  // Delete Account Handler
  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setDeleteError(null);
    setDeleteLoading(true);

    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: deletePassword,
          confirmation: deleteConfirmation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete account");
      } else {
        // Sign out and redirect
        signOut({ callbackUrl: "/" });
      }
    } catch (error) {
      setDeleteError("An error occurred. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-white">
        <p>Please sign in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8 text-white">Account Settings</h1>

      {/* Top row: Email and Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Change Email Section */}
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-white">Change Email</h2>
          <form onSubmit={handleChangeEmail} className="space-y-4 flex-1 flex flex-col">
            <div>
              <label htmlFor="currentEmail" className="block text-sm font-medium mb-2 text-white">
                Current Email
              </label>
              <AuthInput
                id="currentEmail"
                type="email"
                value={session.user?.email || ""}
                disabled
                className="opacity-60"
              />
            </div>
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium mb-2 text-white">
                New Email
              </label>
              <AuthInput
                id="newEmail"
                type="email"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="emailPassword" className="block text-sm font-medium mb-2 text-white">
                Password
              </label>
              <AuthInput
                id="emailPassword"
                type="password"
                placeholder="Verify with your password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex-1"></div>
            <button
              type="submit"
              disabled={emailLoading}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-4 py-2 rounded cursor-pointer w-full"
            >
              {emailLoading ? "Updating..." : "Change Email"}
            </button>
            {emailError && <p className="text-sm text-red-400">{emailError}</p>}
            {emailSuccess && (
              <p className="text-sm text-green-400">{emailSuccess}</p>
            )}
          </form>
        </div>

        {/* Change Password Section */}
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4 flex-1 flex flex-col">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-2 text-white">
                Current Password
              </label>
              <AuthInput
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-2 text-white">
                New Password
              </label>
              <AuthInput
                id="newPassword"
                type="password"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-white">
                Confirm New Password
              </label>
              <AuthInput
                id="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex-1"></div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-4 py-2 rounded cursor-pointer w-full"
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </button>
            {passwordError && (
              <p className="text-sm text-red-400">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-green-400">{passwordSuccess}</p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom row: Display Name and Delete Account */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Change Display Name Section */}
        <div className="bg-gray-800 p-6 rounded-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-white">Change Display Name</h2>
          <form onSubmit={handleChangeName} className="space-y-4 flex-1 flex flex-col">
            <div>
              <label htmlFor="currentName" className="block text-sm font-medium mb-2 text-white">
                Current Display Name
              </label>
              <AuthInput
                id="currentName"
                type="text"
                value={session.user?.name || ""}
                disabled
                className="opacity-60"
              />
            </div>
            <div>
              <label htmlFor="newName" className="block text-sm font-medium mb-2 text-white">
                New Display Name
              </label>
              <AuthInput
                id="newName"
                type="text"
                placeholder="Enter new display name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <div className="flex-1"></div>
            <button
              type="submit"
              disabled={nameLoading}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-4 py-2 rounded cursor-pointer w-full"
            >
              {nameLoading ? "Updating..." : "Change Display Name"}
            </button>
            {nameError && <p className="text-sm text-red-400">{nameError}</p>}
            {nameSuccess && (
              <p className="text-sm text-green-400">{nameSuccess}</p>
            )}
          </form>
        </div>

        {/* Delete Account Section */}
        <div className="bg-gray-800 p-6 rounded-lg border border-red-900 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-red-500">
            Delete Account
          </h2>
          <form onSubmit={handleDeleteAccount} className="space-y-4 flex-1 flex flex-col">
            <div>
              <label htmlFor="deletePassword" className="block text-sm font-medium mb-2 text-white">
                Current Password
              </label>
              <AuthInput
                id="deletePassword"
                type="password"
                placeholder="Enter your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="deleteConfirmation" className="block text-sm font-medium mb-2 text-white">
                Confirmation
              </label>
              <AuthInput
                id="deleteConfirmation"
                type="text"
                placeholder='Type "DELETE" to confirm'
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                required
              />
            </div>
            <div className="flex-1"></div>
            <button
              type="submit"
              disabled={deleteLoading}
              className="bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded cursor-pointer w-full"
            >
              {deleteLoading ? "Deleting..." : "Delete Account"}
            </button>
            {deleteError && (
              <p className="text-sm text-red-400">{deleteError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

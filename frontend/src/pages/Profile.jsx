import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    avatar: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  // Convert selected PC image into a smaller Base64 image
  function handleImageUpload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setUploading(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const maxSize = 500;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);

        // Compress image
        const compressedImage = canvas.toDataURL("image/jpeg", 0.8);

        setProfile((prev) => ({
          ...prev,
          avatar: compressedImage,
        }));

        setUploading(false);
      };

      img.onerror = () => {
        toast.error("Could not load image");
        setUploading(false);
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      toast.error("Could not read image");
      setUploading(false);
    };

    reader.readAsDataURL(file);
  }

  async function update(e) {
    e.preventDefault();

    if (!profile.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      const { data } = await api.put("/auth/profile", {
        name: profile.name,
        avatar: profile.avatar,
      });

      setUser(data.user);

      localStorage.setItem(
        "taskflow_user",
        JSON.stringify(data.user)
      );

      toast.success("Profile updated successfully");
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Profile update failed"
      );
    }
  }

  async function change(e) {
    e.preventDefault();

    try {
      await api.put("/auth/change-password", password);

      setPassword({
        currentPassword: "",
        newPassword: "",
      });

      toast.success("Password changed");
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Password change failed"
      );
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">

      {/* Page Heading */}
      <div>
        <p className="text-sm font-semibold text-indigo-600">
          Account
        </p>

        <h1 className="text-3xl font-black dark:text-white">
          Profile
        </h1>
      </div>

      {/* Profile Information */}
      <div className="card p-6">

        <h2 className="mb-5 font-extrabold dark:text-white">
          Profile Information
        </h2>

        <form onSubmit={update} className="space-y-5">

          {/* Name */}
          <label className="block text-sm font-semibold">
            Name

            <input
              value={profile.name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  name: e.target.value,
                })
              }
              className="input mt-1"
            />
          </label>

          {/* Email */}
          <label className="block text-sm font-semibold">
            Email

            <input
              disabled
              value={user?.email || ""}
              className="input mt-1 opacity-60"
            />
          </label>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Profile Picture
            </label>

            <div className="flex items-center gap-5">

              {/* Preview */}
              <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-indigo-200 bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950">

                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Profile Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-2xl font-bold text-indigo-600">
                    {profile.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

              </div>

              {/* Upload */}
              <div className="flex-1">

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <p className="mt-2 text-xs text-slate-500">
                  JPG, PNG or other image format. Maximum 5MB.
                </p>

                {uploading && (
                  <p className="mt-1 text-xs font-semibold text-indigo-600">
                    Processing image...
                  </p>
                )}

              </div>

            </div>
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={uploading}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Processing..." : "Save Profile"}
          </button>

        </form>
      </div>

      {/* Change Password */}
      <div className="card p-6">

        <h2 className="mb-5 font-extrabold dark:text-white">
          Change Password
        </h2>

        <form onSubmit={change} className="space-y-4">

          <input
            required
            type="password"
            placeholder="Current password"
            value={password.currentPassword}
            onChange={(e) =>
              setPassword({
                ...password,
                currentPassword: e.target.value,
              })
            }
            className="input"
          />

          <input
            required
            minLength="6"
            type="password"
            placeholder="New password"
            value={password.newPassword}
            onChange={(e) =>
              setPassword({
                ...password,
                newPassword: e.target.value,
              })
            }
            className="input"
          />

          <button className="btn-primary">
            Change Password
          </button>

        </form>
      </div>

    </div>
  );
}
import React, { useState } from "react";
import { updateServiceProviderProfile } from "../../../services/api";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";

const MyProfile = ({ userData, setUserData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...userData });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Current userData:", userData);
      console.log("Edited data:", editedData);

      const formData = new FormData();

      // Add all the profile fields with proper type handling
      const dataToUpdate = {
        username: editedData.username || userData.username || "",
        email: editedData.email || userData.email || "",
        contact: editedData.phone || userData.contact || "",
        address: editedData.address || userData.address || "",
        experience: parseInt(
          editedData.experience || userData.experience || "0"
        ),
        isActive: Boolean(editedData.isActive ?? userData.isActive ?? false),
      };

      console.log("Preparing to update with data:", dataToUpdate);

      // Add each field to FormData
      Object.entries(dataToUpdate).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Add profile image if changed
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      console.log("Submitting form data...");
      const response = await updateServiceProviderProfile(formData);
      console.log("Update response:", response);

      // Update the local state with the response data
      setUserData((prev) => {
        const newData = {
          ...prev,
          ...response,
          // Preserve any fields that might not be returned by the API
          profileImage: profileImage || prev.profileImage,
        };
        console.log("Updating user data to:", newData);
        return newData;
      });

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      // Show a more user-friendly error message
      toast.error(
        error.message && error.message.includes("Failed to fetch")
          ? "Unable to connect to the server. Please try again later."
          : error.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="p-6 relative">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>

          <div className="flex items-start space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={
                    profileImage ||
                    userData.profileImage ||
                    "/default-avatar.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Pencil size={16} className="text-white" />
                </label>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editedData.name || ""}
                        onChange={handleChange}
                        className="border-b border-gray-300 focus:border-blue-500 bg-transparent px-1"
                        placeholder="Your name"
                      />
                    ) : (
                      userData.name || "Add your name"
                    )}
                  </h3>
                  <div className="mt-2">
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={editedData.bio || ""}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md focus:border-blue-500 bg-transparent"
                        placeholder="Write a short bio..."
                        rows="2"
                      />
                    ) : (
                      <p className="text-gray-600">
                        {userData.bio || "Add a short bio"}
                      </p>
                    )}
                  </div>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-blue-500 hover:text-blue-600"
                  >
                    <Pencil size={16} className="mr-1" />
                    Edit
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedData({ ...userData });
                      }}
                      className="px-3 py-1 text-gray-600 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personnel Information */}
        <div className="bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Personnel Information
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <Pencil size={16} className="mr-1" />
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={
                  isEditing
                    ? editedData.firstName || ""
                    : userData.firstName || ""
                }
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 rounded-md ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500"
                    : "bg-gray-50 border-transparent"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={
                  isEditing
                    ? editedData.lastName || ""
                    : userData.lastName || ""
                }
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 rounded-md ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500"
                    : "bg-gray-50 border-transparent"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={
                  isEditing ? editedData.email || "" : userData.email || ""
                }
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 rounded-md ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500"
                    : "bg-gray-50 border-transparent"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tel No:
              </label>
              <input
                type="tel"
                name="phone"
                value={
                  isEditing ? editedData.phone || "" : userData.phone || ""
                }
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 rounded-md ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500"
                    : "bg-gray-50 border-transparent"
                }`}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={isEditing ? editedData.bio || "" : userData.bio || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              rows="3"
              className={`w-full px-3 py-2 rounded-md ${
                isEditing
                  ? "border-gray-300 focus:border-blue-500"
                  : "bg-gray-50 border-transparent"
              }`}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gray-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Address</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <Pencil size={16} className="mr-1" />
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={
                  isEditing
                    ? editedData.address?.country || ""
                    : userData.address?.country || ""
                }
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 rounded-md ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500"
                    : "bg-gray-50 border-transparent"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                District
              </label>
              <input
                type="text"
                name="district"
                value={
                  isEditing
                    ? editedData.address?.district || ""
                    : userData.address?.district || ""
                }
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 rounded-md ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500"
                    : "bg-gray-50 border-transparent"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={
                  isEditing
                    ? editedData.address?.city || ""
                    : userData.address?.city || ""
                }
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 rounded-md ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500"
                    : "bg-gray-50 border-transparent"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={
                  isEditing
                    ? editedData.address?.postalCode || ""
                    : userData.address?.postalCode || ""
                }
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full px-3 py-2 rounded-md ${
                  isEditing
                    ? "border-gray-300 focus:border-blue-500"
                    : "bg-gray-50 border-transparent"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

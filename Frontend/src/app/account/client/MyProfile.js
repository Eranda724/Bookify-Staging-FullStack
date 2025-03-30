import React, { useState, useEffect } from "react";
import axios from "axios";

const MyProfile = ({ userData, updateUserData }) => {
  // State to track which sections are being edited
  const [editMode, setEditMode] = useState({
    profile: false,
    personal: false,
    address: false,
  });

  // Form data state for editing
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    status: "",
    notes: "",
    address: "",
    firstName: "",
    lastName: "",
    bio: "",
    profileImage: "/profile-placeholder.jpg",
    addressDetails: {
      country: "",
      city: "",
      district: "",
      postalCode: "",
    },
  });

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      // Split the address into components if it exists
      let addressDetails = {
        country: "",
        city: "",
        district: "",
        postalCode: "",
      };

      // Try to parse address details if available
      if (userData.address && userData.address !== "-") {
        try {
          // Attempt to parse JSON if stored that way
          const parsedAddress = JSON.parse(userData.address);
          addressDetails = {
            ...addressDetails,
            ...parsedAddress,
          };
        } catch (e) {
          // If not JSON, try to extract structured data from string
          const addressParts = userData.address
            .split(",")
            .map((part) => part.trim());
          if (addressParts.length >= 3) {
            addressDetails = {
              ...addressDetails,
              city: addressParts[0] || "",
              district: addressParts[1] || "",
              country: addressParts[2] || "",
              postalCode: addressParts[3] || "",
            };
          }
        }
      }

      // Split name if available (assuming username might contain both first and last name)
      const nameParts = userData.username
        ? userData.username.split(" ")
        : ["", ""];

      setFormData({
        username: userData.username === "-" ? "" : userData.username,
        email: userData.email === "-" ? "" : userData.email,
        phone: userData.phone === "-" ? "" : userData.phone,
        status: userData.status === "-" ? "" : userData.status,
        notes: userData.notes === "-" ? "" : userData.notes,
        address: userData.address === "-" ? "" : userData.address,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        bio: userData.notes === "-" ? "" : userData.notes,
        profileImage: "/profile-placeholder.jpg",
        addressDetails,
      });
    }
  }, [userData]);

  // Toggle edit mode for a section
  const toggleEditMode = (section) => {
    setEditMode({
      ...editMode,
      [section]: !editMode[section],
    });
  };

  // Handle input changes
  const handleInputChange = (e, section, nestedField = null) => {
    const { name, value } = e.target;

    if (nestedField) {
      setFormData({
        ...formData,
        [nestedField]: {
          ...formData[nestedField],
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Save changes to backend
  const saveChanges = async (section) => {
    try {
      // Prepare data for backend update
      const dataToUpdate = { ...userData };

      if (section === "profile") {
        dataToUpdate.notes = formData.bio;
        // Cannot update profile image directly in Consumer model
      }

      if (section === "personal") {
        // Combine first and last name for username field
        dataToUpdate.username =
          `${formData.firstName} ${formData.lastName}`.trim();
        dataToUpdate.email = formData.email;
        dataToUpdate.phone = formData.phone;
        dataToUpdate.notes = formData.bio;
      }

      if (section === "address") {
        // Convert address object to string or JSON format for storage
        dataToUpdate.address = JSON.stringify(formData.addressDetails);
      }

      // Call the parent component's update function
      await updateUserData(dataToUpdate);

      // Close edit mode
      toggleEditMode(section);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Cancel editing
  const cancelEdit = (section) => {
    toggleEditMode(section);
  };

  // Loading state
  if (!userData) {
    return (
      <div className="bg-cyan-100 rounded-lg shadow p-6">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="bg-cyan-100 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6 text-blue-500">My Profile</h2>

      {/* Profile Overview Section */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        {!editMode.profile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                />
              </div>
              <div>
                <p className="text-gray-600">
                  Name: {formData.firstName} {formData.lastName}
                </p>
                <p className="text-gray-600">Bio: {formData.bio}</p>
              </div>
            </div>
            <button
              className="text-blue-500 hover:text-blue-700 flex items-center"
              onClick={() => toggleEditMode("profile")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span className="ml-1">Edit</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-gray-500 text-sm mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange(e)}
                className="w-full p-2 border border-gray-300 rounded"
                rows="2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-500 text-sm mb-1">
                Profile Image URL
              </label>
              <input
                type="text"
                name="profileImage"
                value={formData.profileImage}
                onChange={(e) => handleInputChange(e)}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <p className="text-sm text-gray-500 mt-1">
                Note: Profile image upload is not supported in the current
                version
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-3 py-1 rounded text-gray-700"
                onClick={() => cancelEdit("profile")}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 px-3 py-1 rounded text-white"
                onClick={() => saveChanges("profile")}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Personal Information Section */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Personnel information</h3>
          {!editMode.personal && (
            <button
              className="text-blue-500 hover:text-blue-700 flex items-center"
              onClick={() => toggleEditMode("personal")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span className="ml-1">Edit</span>
            </button>
          )}
        </div>

        {!editMode.personal ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">First Name</p>
              <p className="font-medium">{formData.firstName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Last Name</p>
              <p className="font-medium">{formData.lastName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">E-mail</p>
              <p className="font-medium">{formData.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tel No.</p>
              <p className="font-medium">{formData.phone || "-"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Bio</p>
              <p className="font-medium">{formData.bio || "-"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <p className="font-medium">{formData.status || "-"}</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  Tel No.
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">Bio</label>
                <input
                  type="text"
                  name="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-3 py-1 rounded text-gray-700"
                onClick={() => cancelEdit("personal")}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 px-3 py-1 rounded text-white"
                onClick={() => saveChanges("personal")}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Address Section */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Address</h3>
          {!editMode.address && (
            <button
              className="text-blue-500 hover:text-blue-700 flex items-center"
              onClick={() => toggleEditMode("address")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span className="ml-1">Edit</span>
            </button>
          )}
        </div>

        {!editMode.address ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Country</p>
              <p className="font-medium">
                {formData.addressDetails.country || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">District</p>
              <p className="font-medium">
                {formData.addressDetails.district || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">City</p>
              <p className="font-medium">
                {formData.addressDetails.city || "-"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Postal Code</p>
              <p className="font-medium">
                {formData.addressDetails.postalCode || "-"}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.addressDetails.country}
                  onChange={(e) => handleInputChange(e, null, "addressDetails")}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.addressDetails.district}
                  onChange={(e) => handleInputChange(e, null, "addressDetails")}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.addressDetails.city}
                  onChange={(e) => handleInputChange(e, null, "addressDetails")}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.addressDetails.postalCode}
                  onChange={(e) => handleInputChange(e, null, "addressDetails")}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-3 py-1 rounded text-gray-700"
                onClick={() => cancelEdit("address")}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 px-3 py-1 rounded text-white"
                onClick={() => saveChanges("address")}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Statistics Section */}
      <div className="bg-blue-50 rounded-lg p-6 mt-6">
        <h3 className="font-medium mb-4">Account Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <p className="text-xl font-bold">
              {userData.bookings?.length || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Groups Led</p>
            <p className="text-xl font-bold">
              {userData.ledGroups?.length || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-500 text-sm">Feedback Given</p>
            <p className="text-xl font-bold">
              {userData.feedbacks?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

import React, { useState, useEffect } from "react";
import MyProfile from "./MyProfile";
import Notifications from "./Notifications";
import Security from "./Security";
import ResetPasswordC from "./ResetPassword";
import DeleteAccount from "./DeleteAccount";
import Navigation from "../../../components/ui/navigation";
import MyBooking from "./MyBooking";
import axios from "axios";

const AccountSettings1 = () => {
  const [currentPage, setCurrentPage] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data when component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Get the user ID from session/local storage or context
        const userId = localStorage.getItem("userId"); // Adjust based on how you store auth data

        const response = await axios.get(
          `http://localhost:8081/api/consumers/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT auth
            },
          }
        );

        // Transform backend data to match your frontend needs
        const formattedUserData = {
          username: response.data.username || "-",
          email: response.data.email || "-",
          phone: response.data.phone || "-",
          address: response.data.address || "-",
          status: response.data.status || "-",
          notes: response.data.notes || "-",
          consumer_id: response.data.consumer_id,
          // Add other fields as needed
          bookings: response.data.bookings || [],
          notifications: response.data.notifications || [],
          ledGroups: response.data.ledGroups || [],
          feedbacks: response.data.feedbacks || [],
        };

        setUserData(formattedUserData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const updateUserData = async (updatedData) => {
    try {
      // Create a copy of the data to avoid direct state modification
      const dataToUpdate = { ...updatedData };

      // Send updated data to the backend
      const response = await axios.put(
        `http://localhost:8081/api/consumers/${dataToUpdate.consumer_id}`,
        dataToUpdate,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT auth
          },
        }
      );

      // Update local state with the response from server
      setUserData(response.data);

      // Show success message (you might want to add a toast notification here)
      console.log("Update successful:", response.data);
    } catch (error) {
      console.error("Error updating user data:", error);
      // Handle error (show error message to user)
    }
  };

  const renderSidebar = () => (
    <div className="w-full md:w-48 bg-cyan-50 rounded-lg shadow-sm p-4">
      {[
        "profile",
        "notifications",
        "myBooking",
        "security",
        "resetPassword",
      ].map((page) => (
        <SidebarItem
          key={page}
          label={formatLabel(page)}
          active={currentPage === page}
          onClick={() => setCurrentPage(page)}
        />
      ))}
      <div className="mt-8">
        <button
          onClick={() => setCurrentPage("deleteAccount")}
          className="text-red-500 font-medium hover:text-red-600 transition"
        >
          Delete account
        </button>
      </div>
    </div>
  );

  // Helper function to format sidebar labels
  const formatLabel = (page) => {
    const formatted = page.replace(/([A-Z])/g, " $1"); // Convert camelCase to spaced text
    return formatted.charAt(0).toUpperCase() + formatted.slice(1); // Capitalize first letter
  };

  const SidebarItem = ({ label, active, onClick }) => {
    return (
      <div
        onClick={onClick}
        className={`py-3 px-4 my-1 cursor-pointer rounded-md transition ${
          active
            ? "bg-blue-100 text-blue-500 font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {label}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          Loading user data...
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm text-red-500">
          {error}
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      );
    }

    switch (currentPage) {
      case "profile":
        return (
          <MyProfile userData={userData} updateUserData={updateUserData} />
        );
      case "notifications":
        return <Notifications userData={userData} />;
      case "myBooking":
        return <MyBooking userData={userData} />;
      case "security":
        return <Security userData={userData} updateUserData={updateUserData} />;
      case "resetPassword":
        return <ResetPasswordC userData={userData} />;
      case "deleteAccount":
        return <DeleteAccount userData={userData} />;
      default:
        return (
          <MyProfile userData={userData} updateUserData={updateUserData} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto">
        <Navigation />
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {renderSidebar()}
          <div className="flex-1 bg-white rounded-lg shadow-sm">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings1;

import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../services/api";

const ServiceProviderDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F8F6F4]">
      <nav className="bg-[#D2F9FA] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Bookify Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Appointments
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  View and manage your appointments
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Profile</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Update your profile information
                </p>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Services</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage your services and availability
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceProviderDashboard;

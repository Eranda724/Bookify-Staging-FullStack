import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import image1 from "../../images/1ae6e703-2e7a-4be5-9ca1-13a2cdd82738.png";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa6";
import { registerservice } from "../../services/api";

const RegisterService = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    category: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerservice(formData);
      console.log("Registration successful:", response);
      navigate("/service-provider/login");
    } catch (error) {
      console.error("Registration failed:", error);
      if (error.message === "Failed to fetch") {
        setError(
          "Unable to connect to the server. Please check your internet connection."
        );
      } else {
        setError(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-56 bg-[#F8F6F4] py-10 h-[90%]">
      <div className="flex w-full max-w-4xl bg-[#D2F9FA] shadow-lg rounded-lg overflow-hidden">
        <div
          className="hidden md:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${image1})` }}
        ></div>
        <div className="w-full md:w-1/2 p-4 flex flex-col items-center">
          <img src="/as.png" alt="Logo" className="w-24 mb-2 p-4" />
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-[#B8EEFB] p-2 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold text-center mb-3">
              Create Your Account
            </h2>
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <p className="text-center text-gray-600 mb-2">
              Already have an account?{" "}
              <Link
                to="/service-provider/login"
                className="text-blue-500 font-medium"
              >
                Sign In
              </Link>
            </p>
            <label className="block text-gray-700 text-left mb-1">
              Username:
            </label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
              required
            />

            <label className="block text-gray-700 text-left mb-1">
              Email Address:
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
              required
            />

            <label className="block text-gray-700 text-left mb-1">
              Password:
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
              required
            />

            <label className="block text-gray-700 text-left mb-1">
              Confirm Password:
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
              required
            />
            <label className="block text-gray-700 text-left mb-1">
              Category:
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
              required
            >
              <option value="">Select a category</option>
              <option value="DOCTOR">Doctor</option>
              <option value="NURSE">Nurse</option>
              <option value="PHYSIOTHERAPIST">Physiotherapist</option>
              <option value="DENTIST">Dentist</option>
              <option value="PHARMACIST">Pharmacist</option>
              <option value="LAB_TECHNICIAN">Lab Technician</option>
              <option value="OTHER">Other</option>
            </select>

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label className="text-gray-600">
                I agree to the terms and conditions
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-3 py-2 bg-[#27D5E5] rounded hover:bg-[#1CB8CC] text-white font-medium ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing up..." : "Signup"}
            </button>

            <p className="text-center text-gray-600 mt-2">or continue with</p>
            <div className="flex justify-center space-x-3 mt-2">
              <button className="p-2 bg-white border rounded-full shadow hover:bg-gray-100">
                <FcGoogle />
              </button>
              <button className="p-2 bg-white border rounded-full shadow hover:bg-gray-100">
                <FaGithub />
              </button>
              <button className="p-2 bg-white border rounded-full shadow hover:bg-gray-100">
                <FaFacebook />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterService;

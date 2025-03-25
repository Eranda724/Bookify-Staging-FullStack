import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import image1 from "../../images/1ae6e703-2e7a-4be5-9ca1-13a2cdd82738.png";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa6";

import { registerUser } from "../../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CONSUMER",
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log("Registration successful:", response);
      navigate("/ConsumerLogin");
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.message || "Registration failed. Please try again.");
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
            <p className="text-center text-gray-600 mb-2">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 font-medium">
                Sign In
              </Link>
            </p>

            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <label className="block text-gray-700 text-left mb-1">
              Full Name:
            </label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
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
              className="w-full mt-3 py-2 bg-[#27D5E5] rounded hover:bg-[#1CB8CC] text-white font-medium"
            >
              Signup
            </button>

            <p className="text-center text-gray-600 mt-2">or continue with</p>
            <div className="flex justify-center space-x-3 mt-2">
              <button
                type="button"
                className="p-2 bg-white border rounded-full shadow hover:bg-gray-100"
              >
                <FcGoogle />
              </button>
              <button
                type="button"
                className="p-2 bg-white border rounded-full shadow hover:bg-gray-100"
              >
                <FaGithub />
              </button>
              <button
                type="button"
                className="p-2 bg-white border rounded-full shadow hover:bg-gray-100"
              >
                <FaFacebook />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

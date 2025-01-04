

import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";

const Register = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    const name = (e.currentTarget.elements.namedItem("username") as HTMLInputElement).value;
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (e.currentTarget.elements.namedItem("confirm-password") as HTMLInputElement).value;

   
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
     
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

     
      if (!response.ok) {
        alert(data.message || "An error occurred during registration.");
        return;
      }

      
      setIsModalOpen(true);
    } catch (error) {
      console.error("Registration error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-lg bg-white p-8 rounded-md shadow-md">
          <h1 className="text-2xl font-bold text-black mb-4 text-center">
            Sign Up
          </h1>
          <p className="text-gray-700 mb-6 text-center">
            Welcome to TalkSport. Do you already have an account? Then{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              sign in
            </Link>{" "}
            instead.
          </p>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black font-medium"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black font-medium"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black font-medium"
                placeholder="Enter your password"
                required
              />
              <ul className="text-xs text-gray-600 mt-2">
                <li>• Your password must be at least 8 characters.</li>
                <li>• It can’t be a commonly used or entirely numeric password.</li>
              </ul>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password (again):
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black font-medium"
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition duration-200"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-yellow-500 mb-4 text-center">
              Account Created!
            </h2>
            <p className="text-gray-700 text-center mb-6">
              Your account has been successfully registered. You can now log in
              and start exploring TalkSport.
            </p>
            <div className="flex justify-center">
              <Link
                href="/login"
                className="bg-black text-yellow-500 py-2 px-6 rounded-md hover:bg-gray-800 transition duration-200"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Register;

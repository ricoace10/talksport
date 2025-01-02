import Layout from "../components/Layout";
import Link from "next/link";
import { useState } from "react";

const Register = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful registration
    setIsModalOpen(true);
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

          <form onSubmit={handleSubmit}>
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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your username"
              />
            </div>

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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your email"
              />
            </div>

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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your password"
              />
              <ul className="text-xs text-gray-600 mt-2">
                <li>
                  • Your password can’t be too similar to your other personal
                  information.
                </li>
                <li>• Your password must contain at least 8 characters.</li>
                <li>• Your password can’t be a commonly used password.</li>
                <li>• Your password can’t be entirely numeric.</li>
              </ul>
            </div>

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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Confirm your password"
              />
            </div>

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

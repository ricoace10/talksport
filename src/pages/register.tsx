import { useState } from "react";
import Head from "next/head";
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
      <Head>
        <title>TalkSport - Register</title>
        <meta name="description" content="Create a new TalkSport account and join the community." />
      </Head>
      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl bg-white p-6 sm:p-8 rounded-md shadow-md">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-3 sm:mb-4 md:mb-5 text-center">
            Sign Up
          </h1>
          <p className="text-gray-800 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-center">
            Welcome to TalkSport. Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
            .
          </p>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-3 sm:mb-4 md:mb-5">
              <label htmlFor="username" className="block text-sm sm:text-base font-medium text-gray-800 mb-1">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full p-2 sm:p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black font-medium text-sm sm:text-base md:text-lg"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3 sm:mb-4 md:mb-5">
              <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-800 mb-1">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 sm:p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black font-medium text-sm sm:text-base md:text-lg"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3 sm:mb-4 md:mb-5">
              <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-800 mb-1">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-2 sm:p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black font-medium text-sm sm:text-base md:text-lg"
                placeholder="Enter your password"
                required
              />
              <ul className="text-xs sm:text-sm md:text-base text-gray-700 mt-2">
                <li>• At least 8 characters.</li>
                <li>• Cannot be a common or numeric-only password.</li>
              </ul>
            </div>

            {/* Confirm Password */}
            <div className="mb-4 sm:mb-6 md:mb-7">
              <label htmlFor="confirm-password" className="block text-sm sm:text-base font-medium text-gray-800 mb-1">
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                className="w-full p-2 sm:p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black font-medium text-sm sm:text-base md:text-lg"
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow-700 text-white py-2 sm:py-3 md:py-4 rounded-md hover:bg-yellow-800 transition duration-200 text-sm sm:text-base md:text-lg"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-700 mb-3 sm:mb-4 text-center">
              Account Created!
            </h2>
            <p className="text-gray-800 text-sm sm:text-base md:text-lg text-center mb-4 sm:mb-6">
              Your account has been successfully registered. You can now log in and start exploring TalkSport.
            </p>
            <div className="flex justify-center">
              <Link
                href="/login"
                className="bg-black text-yellow-700 py-2 sm:py-3 px-4 sm:px-6 rounded-md hover:bg-gray-900 transition duration-200 text-sm sm:text-base md:text-lg"
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

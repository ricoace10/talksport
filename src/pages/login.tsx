import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "../components/Layout";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.data));

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>TalkSport - Login</title>
        <meta name="description" content="Log in to your TalkSport account and engage in football discussions." />
      </Head>
      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-sm bg-white p-6 sm:p-8 rounded-md shadow-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-700 mb-6 sm:mb-8 text-center">
            TalkSport
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black font-medium text-sm sm:text-base"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black font-medium text-sm sm:text-base"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-700 text-white py-2 sm:py-3 rounded-md hover:bg-yellow-800 transition duration-200 text-sm sm:text-base"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

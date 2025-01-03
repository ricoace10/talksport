import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      setSuccess(response.data.message);
      setError(null);

      console.log("User Info:", response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      setSuccess(null);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-sm bg-white p-8 rounded-md shadow-md">
          <h1 className="text-4xl font-bold text-yellow-500 mb-8 text-center">
            TalkSport
          </h1>

          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-yellow-500 py-2 rounded-md hover:bg-gray-800 transition duration-200"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

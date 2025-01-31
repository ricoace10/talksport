import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

const Logout = () => {
  useEffect(() => {
    document.documentElement.lang = "en"; // Set language to English
  }, []);

  return (
    <>
      <Head>
        <title>TalkSport - Logout</title>
        <meta name="description" content="Sign out of your TalkSport account securely and return to the homepage." />
        <html lang="en" />
      </Head>
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Navbar */}
        <header className="bg-black text-yellow-500 flex justify-between items-center px-4 sm:px-6 py-4">
          <h1 className="text-base sm:text-lg font-bold">TalkSport</h1>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link href="/dashboard" className="hover:text-yellow-300 text-sm sm:text-base">
              For you
            </Link>
            <Link href="/" className="hover:text-yellow-300 text-sm sm:text-base">
              Log out
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow px-4 py-6 flex flex-col items-center justify-center">
          <h2 className="text-3xl sm:text-4xl text-yellow-700 font-bold mb-4 sm:mb-6">TalkSport</h2>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center w-full max-w-xs sm:max-w-sm">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Sign Out</h3>
            <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6">
              Are you sure you want to sign out?
            </p>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="bg-black text-yellow-500 py-2 sm:py-3 px-4 sm:px-6 rounded-md hover:bg-gray-800 transition duration-200 text-sm sm:text-base"
            >
              Sign Out
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black text-yellow-500 text-center py-3 sm:py-4 text-sm sm:text-base">
          TalkSport © 2024
        </footer>
      </div>
    </>
  );
};

export default Logout;

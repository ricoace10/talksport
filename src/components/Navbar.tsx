import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-yellow-500 px-6 py-4 flex justify-between items-center relative">
      {/* Logo */}
      <div className="text-lg font-bold">
        <Link href="/" title="Go to TalkSport Homepage">TalkSport</Link>
      </div>

      {/* Hamburger Icon */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="focus:outline-none"
          title="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Links for larger screens */}
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="hover:text-yellow-300" title="Go to Home Page">
          Home
        </Link>
        <Link href="/register" className="hover:text-yellow-300" title="Register for an account">
          Register
        </Link>
        <Link href="/login" className="hover:text-yellow-300" title="Login to your account">
          Login
        </Link>
      </div>

      {/* Fullscreen Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-black flex flex-col justify-center items-center z-50">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-6 text-white text-2xl focus:outline-none"
            title="Close menu"
          >
            &times;
          </button>
          <Link
            href="/"
            className="text-yellow-500 text-2xl mb-4 hover:text-yellow-300"
            onClick={() => setIsMenuOpen(false)}
            title="Go to Home Page"
          >
            Home
          </Link>
          <Link
            href="/register"
            className="text-yellow-500 text-2xl mb-4 hover:text-yellow-300"
            onClick={() => setIsMenuOpen(false)}
            title="Register for an account"
          >
            Register
          </Link>
          <Link
            href="/login"
            className="text-yellow-500 text-2xl mb-4 hover:text-yellow-300"
            onClick={() => setIsMenuOpen(false)}
            title="Login to your account"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

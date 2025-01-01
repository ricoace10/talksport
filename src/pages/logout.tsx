import Link from "next/link";

const Logout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="bg-black text-yellow-500 flex justify-between items-center px-6 py-4">
        <h1 className="text-lg font-bold">TalkSport</h1>
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="hover:text-yellow-300">
            For you
          </Link>
          <Link href="/" className="hover:text-yellow-300">
            Log out
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 py-6 flex flex-col items-center justify-center">
        <h2 className="text-4xl text-yellow-500 font-bold mb-6">TalkSport</h2>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold mb-4">Sign Out</h3>
          <p className="text-gray-700 mb-6">Are you sure you want to sign out?</p>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="bg-black text-yellow-500 py-2 px-6 rounded-md hover:bg-gray-800 transition duration-200"
          >
            Sign Out
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-yellow-500 text-center py-4">
        TalkSport © 2024
      </footer>
    </div>
  );
};

export default Logout;

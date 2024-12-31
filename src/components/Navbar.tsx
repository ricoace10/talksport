import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-black text-yellow-500 px-6 py-4 flex justify-between items-center">
      <div className="text-lg font-bold">
        <Link href="/">TalkSport</Link>
      </div>
      <div className="space-x-6">
        <Link href="/" className="hover:text-yellow-300">Home</Link>
        <Link href="/register" className="hover:text-yellow-300">Register</Link>
        <Link href="/login" className="hover:text-yellow-300">Login</Link>
      </div>
      <div className="italic text-sm">
        <Link href="/" className="hover:text-yellow-300">All About The Beautiful Sport</Link>
      </div>
    </nav>
  );
};

export default Navbar;


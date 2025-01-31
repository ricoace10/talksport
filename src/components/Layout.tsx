import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="relative flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
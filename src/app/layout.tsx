import "./globals.css";
import Navbar from "./components/Navbar";
import Sidebar from "../app/components/Sidebar";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata = {
  title: "Admin Dashboard",
  description: "Scholarship Admin Panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black text-black dark:text-white">
        <ThemeProvider>
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

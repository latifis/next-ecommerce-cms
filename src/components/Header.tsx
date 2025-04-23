import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-16 bg-gray-100 px-4 shadow-md">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="flex items-center gap-2">
        <FaUserCircle className="text-2xl text-gray-600" />
        <span className="text-gray-600 font-medium">John Doe</span>
      </div>
    </header>
  );
}

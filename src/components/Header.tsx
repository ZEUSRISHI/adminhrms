import { Bell, Search, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "??";

  const roleBadge: Record<string, string> = {
    admin: "bg-red-100 text-red-700",
    hr: "bg-blue-100 text-blue-700",
    manager: "bg-purple-100 text-purple-700",
    employee: "bg-green-100 text-green-700",
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students, streams, or badges..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="h-8 w-px bg-gray-200" />
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm select-none">
            {initials}
          </div>
          <div className="text-sm text-left hidden sm:block">
            <p className="font-semibold text-gray-800 leading-none">{user?.name ?? "User"}</p>
            <p className={`text-xs mt-1 px-1.5 py-0.5 rounded font-medium capitalize inline-block ${roleBadge[user?.role ?? "employee"]}`}>
              {user?.role ?? "employee"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 ml-1"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
}
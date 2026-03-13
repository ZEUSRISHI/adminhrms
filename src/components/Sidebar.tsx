import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3, 
  Award, 
  Target,
  Layers,
  PieChart
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Student Management", path: "/students", icon: Users },
  { name: "Stream Management", path: "/streams", icon: BookOpen },
  { name: "Category Analytics", path: "/category-analytics", icon: PieChart },
  { name: "Advanced Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Badges & Awards", path: "/badges", icon: Award },
  { name: "Success Milestones", path: "/milestones", icon: Target },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
          <BookOpen className="w-6 h-6" />
          QuiboTech
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

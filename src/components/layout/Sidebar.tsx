
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { 
  BarChart3, 
  FileText, 
  Tags, 
  Users, 
  Settings,
  Menu,
  X
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "News Management", href: "/news", icon: FileText },
  { name: "Categories", href: "/categories", icon: Tags },
  { name: "User Preferences", href: "/users", icon: Users },
]

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-card border-r border-border transition-all duration-300",
        isOpen ? "w-64" : "w-16"
      )}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className={cn("flex items-center space-x-2", !isOpen && "justify-center")}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            {isOpen && (
              <span className="font-bold text-lg text-foreground">ShortNews</span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-accent transition-colors"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        <nav className="mt-8 px-2 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                !isOpen && "justify-center"
              )}
            >
              <item.icon className={cn("w-5 h-5", isOpen && "mr-3")} />
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Sidebar

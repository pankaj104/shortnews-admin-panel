import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import { useAuth } from "@/contexts/AuthContext"
import { Menu, Sun, Moon, Bell, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { theme, setTheme } = useTheme()
  const { logout, currentUser } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Admin Panel</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? 
              <Sun className="w-5 h-5" /> : 
              <Moon className="w-5 h-5" />
            }
          </Button>

          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem disabled>
                {currentUser?.email || "User"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                Language
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header

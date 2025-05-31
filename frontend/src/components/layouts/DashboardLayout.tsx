"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/auth-context"
import { Button } from "../ui/button"
import { 
  LayoutGrid, 
  ShoppingBag, 
  MessageSquare, 
  User,
  LogOut
} from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles?: Array<"buyer" | "seller" | "admin">
}

const navigation: NavItem[] = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: <LayoutGrid className="w-5 h-5" />,
  },
  {
    label: "Produits",
    href: "/dashboard/products",
    icon: <ShoppingBag className="w-5 h-5" />,
    roles: ["seller"],
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    label: "Profil",
    href: "/dashboard/profile",
    icon: <User className="w-5 h-5" />,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true
    return user && item.roles.includes(user.role)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold">AgriConnect</h1>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = window.location.pathname === item.href

                return (
                  <li key={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => router.push(item.href)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Déconnexion</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="pl-64">
        <div className="h-full min-h-screen bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  )
}

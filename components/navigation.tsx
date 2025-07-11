"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  FileText, 
  Package, 
  Printer, 
  Layers, 
  Scissors, 
  ShoppingCart, 
  BarChart3,
  Home,
  Settings
} from "lucide-react"

const navigationItems = [
  {
    name: "製程記錄",
    href: "/process-records",
    icon: FileText,
    description: "部門記錄管理"
  },
  {
    name: "儀表板",
    href: "/dashboard",
    icon: BarChart3,
    description: "流程圖與統計"
  },
  {
    name: "業務課",
    href: "/process-records/sales-dept",
    icon: ShoppingCart,
    description: "業務課記錄管理"
  },
  {
    name: "抽袋課",
    href: "/process-records/bag-forming-dept",
    icon: Package,
    description: "抽袋課記錄管理"
  },
  {
    name: "印刷課",
    href: "/process-records/printing-dept",
    icon: Printer,
    description: "印刷課記錄管理"
  },
  {
    name: "貼合課",
    href: "/process-records/lamination-dept",
    icon: Layers,
    description: "貼合課記錄管理"
  },
  {
    name: "分條課",
    href: "/process-records/slitting-dept",
    icon: Scissors,
    description: "分條課記錄管理"
  },
  {
    name: "裁袋課",
    href: "/process-records/bag-cutting-dept",
    icon: Scissors,
    description: "裁袋課記錄管理"
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">etPack ERP</h1>
              <p className="text-sm text-gray-500">企業資源規劃系統</p>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {navigationItems.slice(0, 2).map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DepartmentNavigation() {
  const pathname = usePathname()

  const departmentItems = navigationItems.slice(2)

  return (
    <div className="mb-6">
      {/* <h2 className="text-lg font-semibold mb-4">部門管理</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departmentItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link key={item.href} href={item.href}>
              <Card className={`cursor-pointer transition-all hover:shadow-md ${
                isActive ? "ring-2 ring-blue-500" : ""
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-600"}`} />
                    <div>
                      <h3 className={`font-medium ${isActive ? "text-blue-600" : "text-gray-900"}`}>
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div> */}
    </div>
  )
} 
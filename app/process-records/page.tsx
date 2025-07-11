"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Package, Printer, Layers, Scissors, ShoppingCart, Eye, Copy, Edit, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getOrders } from "@/lib/order-storage"
import { DepartmentNavigation } from "@/components/navigation"

export default function ProcessRecordsPage() {
  const departments = [
    {
      name: "業務課",
      path: "/process-records/sales-dept",
      icon: ShoppingCart,
      description: "業務課-記錄管理-Sales Dept",
    },
    {
      name: "抽袋課",
      path: "/process-records/bag-forming-dept",
      icon: Package,
      description: "抽袋課-記錄管理-Bag Forming Dept",
    },
    {
      name: "印刷課",
      path: "/process-records/printing-dept",
      icon: Printer,
      description: "印刷課-記錄管理-Printing Dept",
    },
    {
      name: "貼合課",
      path: "/process-records/lamination-dept",
      icon: Layers,
      description: "貼合課-記錄管理-Lamination Dept",
    },
    {
      name: "分條課",
      path: "/process-records/slitting-dept",
      icon: Scissors,
      description: "分條課-記錄管理-Slitting Dept",
    },
    {
      name: "裁袋課",
      path: "/process-records/bag-cutting-dept",
      icon: Scissors,
      description: "裁袋課-記錄管理-Bag Cutting Dept",
    },
  ]

  // 模擬現有執行中的訂單數據
  const [activeOrders, setActiveOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 載入訂單資料
    const loadOrders = () => {
      const orders = getOrders()
      setActiveOrders(orders)
      setLoading(false)
    }

    loadOrders()

    // 監聽 storage 變化，當有新訂單時自動更新
    const handleStorageChange = () => {
      loadOrders()
    }

    window.addEventListener("storage", handleStorageChange)

    // 也監聽自定義事件，用於同一頁面內的更新
    window.addEventListener("ordersUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("ordersUpdated", handleStorageChange)
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "進行中":
        return "bg-blue-100 text-blue-800"
      case "待開始":
        return "bg-yellow-100 text-yellow-800"
      case "已完成":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDeptColor = (dept: string) => {
    const colors: { [key: string]: string } = {
      業務課首次製單: "bg-purple-100 text-purple-800",
      抽袋課: "bg-green-100 text-green-800",
      印刷課: "bg-blue-100 text-blue-800",
      貼合課: "bg-orange-100 text-orange-800",
      分條課: "bg-red-100 text-red-800",
      裁袋課: "bg-indigo-100 text-indigo-800",
    }
    return colors[dept] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">製程記錄管理系統</CardTitle>
            <p className="text-center text-gray-600 mt-2">Process Records Management System</p>
            {/* <div className="flex justify-center mt-4">
              <Link href="/dashboard">
                <Button variant="outline" className="mr-2">
                  <Eye className="w-4 h-4 mr-2" />
                  查看儀表板
                </Button>
              </Link>
            </div> */}
          </CardHeader>
        </Card>

        <DepartmentNavigation />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {departments.map((dept) => {
            const IconComponent = dept.icon
            return (
              <Card key={dept.path} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{dept.description}</p>
                  <Link href={dept.path}>
                    <Button className="w-full">進入部門</Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 現有執行中訂單區塊 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span>現有執行中訂單</span>
            </CardTitle>
            <p className="text-gray-600 mt-2">業務課提交的訂製單，各課別可以使用、複製、更改與預覽</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">載入訂單資料中...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* 訂單基本資訊 */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{order.id}</h3>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            <Badge className={getDeptColor(order.currentDept)}>{order.currentDept}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">客戶：</span>
                              {order.customerName}
                            </div>
                            <div>
                              <span className="font-medium">交貨日期：</span>
                              {order.deliveryDate}
                            </div>
                            <div>
                              <span className="font-medium">產品：</span>
                              {order.productName}
                            </div>
                            <div>
                              <span className="font-medium">數量：</span>
                              {order.orderQuantity}
                            </div>
                            <div>
                              <span className="font-medium">建立者：</span>
                              {order.createdBy}
                            </div>
                            <div>
                              <span className="font-medium">建立日期：</span>
                              {order.createdDate}
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-medium">最後更新：</span>
                              <span className="text-blue-600">{order.lastUpdate}</span>
                            </div>
                          </div>
                          {/* 進度條 */}
                          <div className="mt-3">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>進度</span>
                              <span>{order.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${order.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* 操作按鈕 */}
                        <div className="flex flex-col space-y-2 lg:ml-6">
                          <div className="flex space-x-2">
                            <Link href={`/process-records/order-preview/${order.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center space-x-1 bg-transparent"
                              >
                                <Eye className="h-4 w-4" />
                                <span>預覽</span>
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline" className="flex items-center space-x-1 bg-transparent">
                              <Copy className="h-4 w-4" />
                              <span>複製</span>
                            </Button>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex items-center space-x-1 bg-transparent">
                              <Edit className="h-4 w-4" />
                              <span>更改</span>
                            </Button>
                            <Button size="sm" className="flex items-center space-x-1">
                              <Play className="h-4 w-4" />
                              <span>使用</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {activeOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>目前沒有執行中的訂單</p>
                    <p className="text-sm">業務課提交訂製單後會顯示在這裡</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span>製程備忘錄</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">生產追蹤表單和製程記錄</p>
            {/* 新增的三個表單區塊 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <CardTitle className="text-lg">標示單</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">生產過程追蹤和記錄表單</p>
                  <Link href="/process-records/process-memo/production-tracking">
                    <Button className="w-full">使用此表單</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Package className="h-8 w-8 text-blue-600" />
                    <CardTitle className="text-lg">領料單</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">材料領取和庫存管理表單</p>
                  <Link href="/process-records/process-memo/material-withdrawal-form">
                    <Button className="w-full">使用此表單</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Package className="h-8 w-8 text-blue-600" />
                    <CardTitle className="text-lg">入庫單</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">貨品入庫和庫存增加表單</p>
                  <Link href="/process-records/process-memo/inbound-receipt-form">
                    <Button className="w-full">使用此表單</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )
}

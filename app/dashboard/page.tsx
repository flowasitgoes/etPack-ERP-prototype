"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FileText, Package, Printer, Scissors, Clock, CheckCircle, AlertCircle, Plus, Eye, Edit } from "lucide-react"
import { getOrders } from "@/lib/order-storage"

// 部门配置
const departments = [
  {
    id: "business",
    name: "業務課",
    icon: FileText,
    color: "bg-gray-100",
    textColor: "text-gray-800",
    required: true,
  },
  {
    id: "bag-forming",
    name: "抽袋課",
    icon: Package,
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-800",
  },
  {
    id: "printing",
    name: "印刷課",
    icon: Printer,
    color: "bg-red-50 border-red-200",
    textColor: "text-red-800",
  },
  {
    id: "lamination",
    name: "貼合課",
    icon: Package,
    color: "bg-orange-50 border-orange-200",
    textColor: "text-orange-800",
  },
  {
    id: "slitting",
    name: "分條課",
    icon: Scissors,
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-800",
  },
  {
    id: "bag-cutting",
    name: "裁袋課",
    icon: Scissors,
    color: "bg-yellow-50 border-yellow-200",
    textColor: "text-yellow-800",
  },
]

// 表單配置
const forms = {
  "bag-forming": [
    { name: "領料單(製前領料)", type: "倉管", color: "red", required: true },
    { name: "入庫單(料沒用完入庫)", type: "倉管", color: "blue", required: true },
    { name: "製程品質查驗表(抽袋)", type: "中文+泰文", required: true },
    { name: "抽袋課生產檢驗日報表", type: "號機", required: true },
    { name: "半成品標示單", type: "給下一課", required: true },
    { name: "操作日期記錄", type: "生產細節", required: true },
  ],
  printing: [
    { name: "領料單(製前領染料)", type: "倉管", color: "red", required: true },
    { name: "入庫單(染料沒用完入庫)", type: "倉管", color: "blue", required: true },
    { name: "抽袋課袋卷標示單1", type: "接收", required: true },
    { name: "抽袋課袋卷標示單2", type: "接收", required: true },
    { name: "領料單(製前領袋子)", type: "倉管", required: true },
    { name: "製程品質查驗表(印刷)", type: "中文+泰文", required: true },
    { name: "印刷課生產檢驗日報表", type: "號機", required: true },
    { name: "半成品標示單", type: "給下一課", required: true },
    { name: "操作日期記錄", type: "生產細節", required: true },
  ],
  "bag-cutting": [
    { name: "印刷/貼合標示單", type: "接收", required: true },
    { name: "摺邊/分條標示單", type: "接收", required: true },
    { name: "領料單(製前領袋)", type: "倉管", required: true },
    { name: "裁袋課生產檢驗日報表1", type: "號機", required: true },
    { name: "裁袋課生產檢驗日報表2", type: "號機", required: true },
    { name: "半成品標示單1", type: "給QC", required: true },
    { name: "半成品標示單2", type: "給QC", required: true },
    { name: "入庫單(白色-採購)", type: "倉管", required: true },
    { name: "入庫單(藍色-倉管)", type: "倉管", required: true },
    { name: "操作日期記錄", type: "生產細節", required: true },
  ],
}

export default function DashboardPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [orders, setOrders] = useState<any[]>([])

  // 載入訂單數據
  useEffect(() => {
    const loadedOrders = getOrders()
    setOrders(loadedOrders)
    if (loadedOrders.length > 0) {
      setSelectedOrder(loadedOrders[0])
    }
  }, [])

  const getOrderColor = (status: string) => {
    switch (status) {
      case "進行中":
        return "bg-blue-50 border-blue-200"
      case "已完成":
        return "bg-green-50 border-green-200"
      case "待開始":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "進行中":
        return "bg-blue-500"
      case "已完成":
        return "bg-green-500"
      case "待開始":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDepartmentIndex = (deptName: string) => {
    return departments.findIndex(dept => dept.name === deptName)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">工廠ERP系統 - 儀表板</h1>
              <p className="text-sm text-gray-500">生產流程管理系統</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新增訂單
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">總覽</TabsTrigger>
            <TabsTrigger value="workflow">工作流程</TabsTrigger>
            <TabsTrigger value="forms">表單管理</TabsTrigger>
            <TabsTrigger value="reports">報表統計</TabsTrigger>
          </TabsList>

          {/* 總覽頁面 */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* 統計卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">總訂單數</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <p className="text-xs text-muted-foreground">本月新增 +{orders.filter(o => o.createdDate?.includes('2025-01')).length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">進行中</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === '進行中').length}</div>
                  <p className="text-xs text-muted-foreground">各課別處理中</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">已完成</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === '已完成').length}</div>
                  <p className="text-xs text-muted-foreground">本月完成</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">待處理</CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === '待開始').length}</div>
                  <p className="text-xs text-muted-foreground">需要關注</p>
                </CardContent>
              </Card>
            </div>

            {/* 訂單列表 */}
            <Card>
              <CardHeader>
                <CardTitle>進行中的訂單</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getOrderColor(order.status)} ${selectedOrder?.id === order.id ? "ring-2 ring-blue-500" : ""}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{order.id}</h3>
                          <p className="text-sm text-gray-600">
                            {order.customerName} - {order.productName}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">當前課別: {order.currentDept}</span>
                        <span className="text-sm text-gray-500">{order.lastUpdate}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>進度</span>
                          <span>{order.progress}%</span>
                        </div>
                        <Progress value={order.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 工作流程頁面 */}
          <TabsContent value="workflow" className="space-y-6">
            {selectedOrder && (
              <Card>
                <CardHeader>
                  <CardTitle>生產流程圖</CardTitle>
                  <p className="text-sm text-gray-500">訂單 {selectedOrder.id} 的流程進度</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6 overflow-x-auto">
                    {departments.map((dept, index) => {
                      const Icon = dept.icon
                      const isActive = dept.name === selectedOrder.currentDept
                      const deptIndex = getDepartmentIndex(dept.name)
                      const isCompleted = selectedOrder.progress > (deptIndex * (100 / (departments.length - 1)))

                      return (
                        <div key={dept.id} className="flex items-center flex-shrink-0">
                          <div
                            className={`flex flex-col items-center p-4 rounded-lg border-2 ${isActive ? "ring-2 ring-blue-500" : ""} ${dept.color}`}
                          >
                            <Icon className={`w-8 h-8 mb-2 ${isCompleted ? "text-green-600" : dept.textColor}`} />
                            <span className={`text-sm font-medium ${dept.textColor}`}>{dept.name}</span>
                            {dept.required && (
                              <Badge variant="secondary" className="mt-1 text-xs">
                                必經
                              </Badge>
                            )}
                            {isCompleted && <CheckCircle className="w-4 h-4 text-green-600 mt-1" />}
                          </div>
                          {index < departments.length - 1 && (
                            <div className={`w-12 h-1 mx-2 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`} />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* 當前課別詳情 */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        當前課別: {selectedOrder.currentDept}
                        <Badge variant="outline">{selectedOrder.lastUpdate}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">基本信息</h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">訂單編號:</span> {selectedOrder.id}
                            </p>
                            <p>
                              <span className="font-medium">客戶名稱:</span> {selectedOrder.customerName}
                            </p>
                            <p>
                              <span className="font-medium">產品名稱:</span> {selectedOrder.productName}
                            </p>
                            <p>
                              <span className="font-medium">開單日期:</span> {selectedOrder.createdDate}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">操作記錄</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>業務課開單完成 ({selectedOrder.createdDate})</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span>{selectedOrder.currentDept}處理中 ({selectedOrder.lastUpdate})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 表單管理頁面 */}
          <TabsContent value="forms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {departments.filter(dept => (forms as Record<string, any[]>)[dept.id]).map((dept) => (
                <Card key={dept.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <dept.icon className="w-5 h-5" />
                      {dept.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(forms as Record<string, any[]>)[dept.id]?.map((form, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{form.name}</p>
                            <p className="text-xs text-gray-500">{form.type}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 報表統計頁面 */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>各課別處理時間統計</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.slice(1).map((dept) => (
                      <div key={dept.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{dept.name}</span>
                          <span>平均 2.5 天</span>
                        </div>
                        <Progress value={Math.random() * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>表單完成率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">92%</div>
                      <p className="text-sm text-gray-500">整體完成率</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>按時完成</span>
                        <span className="text-green-600">85%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>延遲完成</span>
                        <span className="text-yellow-600">7%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>未完成</span>
                        <span className="text-red-600">8%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 
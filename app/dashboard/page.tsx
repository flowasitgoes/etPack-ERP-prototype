"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FileText, Package, Printer, Scissors, Clock, CheckCircle, AlertCircle, Plus, Eye, Edit, ArrowRight } from "lucide-react"
import { getOrders } from "@/lib/order-storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

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
    color: "bg-green-50 border-green-200",
    textColor: "text-green-800",
  },
  {
    id: "lamination",
    name: "貼合課",
    icon: FileText,
    color: "bg-yellow-50 border-yellow-200",
    textColor: "text-yellow-800",
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
    color: "bg-red-50 border-red-200",
    textColor: "text-red-800",
  },
]

const bagFormingFormOptions = [
  { name: "領料單(製前領料)", type: "倉管" },
  { name: "入庫單(料沒用完入庫)", type: "倉管" },
  { name: "製程品質查驗表(抽袋)", type: "中文+泰文" },
  { name: "抽袋課生產檢驗日報表", type: "" },
  { name: "半成品標示單", type: "給下一課" },
  { name: "訂製單記錄表(操作日期記錄)", type: "生產細節" },
]

// 表單資料
const forms = {
  "bag-forming": [
    { name: "領料單(製前領料)", type: "倉管" },
    { name: "入庫單(料沒用完入庫)", type: "倉管" },
    { name: "製程品質查驗表(抽袋)", type: "中文+泰文" },
    { name: "抽袋課生產檢驗日報表", type: "" },
    { name: "半成品標示單", type: "給下一課" },
    { name: "訂製單記錄表(操作日期記錄)", type: "生產細節" },
  ],
  "printing": [
    { name: "印刷工單", type: "生產管理" },
    { name: "色彩校對表", type: "品質控制" },
  ],
  "lamination": [
    { name: "貼合工單", type: "生產管理" },
    { name: "材料使用記錄", type: "庫存管理" },
  ],
  "slitting": [
    { name: "分條工單", type: "生產管理" },
    { name: "尺寸檢驗表", type: "品質控制" },
  ],
  "bag-cutting": [
    { name: "裁袋工單", type: "生產管理" },
    { name: "成品檢驗表", type: "品質控制" },
  ],
}

// localStorage key
const BAG_FORMING_LIST_KEY = "bagFormingFormsOrder"

export default function DashboardPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [orders, setOrders] = useState<any[]>([])
  const defaultBagFormingList = (forms as Record<string, any[]>)["bag-forming"] || []
  const [bagFormingList, setBagFormingList] = useState<any[]>(defaultBagFormingList)
  const [newFormNames, setNewFormNames] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();

  // 載入訂單數據
  useEffect(() => {
    const loadedOrders = getOrders()
    setOrders(loadedOrders)
    if (loadedOrders.length > 0) {
      setSelectedOrder(loadedOrders[0])
    }
  }, [])

  // 初始化時載入 API 資料
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/forms?department=bag-forming')
        if (response.ok) {
          const data = await response.json()
          if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
            setBagFormingList(data.orders)
            // 只標記不是預設的為 new
            setNewFormNames(data.orders.filter((f: any) => !defaultBagFormingList.some((df: any) => df.name === f.name)).map((f: any) => f.name))
          } else {
            setBagFormingList(defaultBagFormingList)
            setNewFormNames([])
          }
        }
      } catch {
        setBagFormingList(defaultBagFormingList)
        setNewFormNames([])
      }
    })()
  }, [])

  // 拖曳結束時更新順序並儲存
  const onDragEnd = (result: any) => {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return
    const items = Array.from(bagFormingList)
    const [removed] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, removed)
    setBagFormingList(items)
    saveFormOrders(items)
  }

  // 新增表單
  const handleAddForm = (form: any) => {
    console.log('=== handleAddForm 被調用 ===')
    console.log('傳入的表單:', form)
    console.log('當前 bagFormingList:', bagFormingList)
    console.log('當前 newFormNames:', newFormNames)
    
    if (bagFormingList.some(f => f.name === form.name)) {
      console.log('❌ 表單已存在，不新增')
      return
    }
    
    const newList = [form, ...bagFormingList]
    console.log('✅ 新列表:', newList)
    
    setBagFormingList(newList)
    setNewFormNames([form.name, ...newFormNames])
    saveFormOrders(newList)
    
    console.log('=== handleAddForm 執行完成 ===')
  }

  // 恢復預設值
  const handleResetDefault = async () => {
    setBagFormingList(defaultBagFormingList)
    setNewFormNames([])
    await saveFormOrders(defaultBagFormingList)
  }

  // 儲存到 API
  const saveFormOrders = async (orders: any[]) => {
    console.log('=== saveFormOrders 被調用 ===')
    console.log('要儲存的訂單:', orders)
    
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: 'bag-forming', orders })
      })
      console.log('API 回應狀態:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('API 回應內容:', result)
      }
      
      localStorage.setItem('bagFormingFormsOrder', JSON.stringify(orders))
      console.log('✅ 已儲存到 localStorage')
    } catch (error) {
      console.error('❌ 儲存失敗:', error)
    }
    
    console.log('=== saveFormOrders 執行完成 ===')
  }

  // 計算各部門進度
  const calculateProgress = (deptId: string) => {
    if (!selectedOrder) return 0
    const dept = selectedOrder.departments?.find((d: any) => d.id === deptId)
    return dept ? dept.progress || 0 : 0
  }

  // 獲取部門狀態
  const getDepartmentStatus = (deptId: string) => {
    if (!selectedOrder) return "pending"
    const dept = selectedOrder.departments?.find((d: any) => d.id === deptId)
    if (!dept) return "pending"
    if (dept.progress === 100) return "completed"
    if (dept.progress > 0) return "in-progress"
    return "pending"
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">etPack ERP 儀表板</CardTitle>
            <p className="text-center text-gray-600 mt-2">Dashboard</p>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">總覽</TabsTrigger>
            <TabsTrigger value="workflow">工作流程</TabsTrigger>
            <TabsTrigger value="forms">表單管理</TabsTrigger>
            <TabsTrigger value="reports">報表統計</TabsTrigger>
          </TabsList>

          {/* 總覽頁面 */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    總訂單數
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{orders.length}</div>
                  <p className="text-sm text-gray-500">執行中的訂單</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    已完成
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {orders.filter((order: any) => 
                      order.departments?.every((dept: any) => dept.progress === 100)
                    ).length}
                  </div>
                  <p className="text-sm text-gray-500">完成率: {Math.round((orders.filter((order: any) => 
                    order.departments?.every((dept: any) => dept.progress === 100)
                  ).length / orders.length) * 100)}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    進行中
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {orders.filter((order: any) => 
                      order.departments?.some((dept: any) => dept.progress > 0 && dept.progress < 100)
                    ).length}
                  </div>
                  <p className="text-sm text-gray-500">正在處理</p>
                </CardContent>
              </Card>
            </div>

            {selectedOrder && (
              <Card>
                <CardHeader>
                  <CardTitle>當前訂單進度</CardTitle>
                  <p className="text-sm text-gray-500">訂單號: {selectedOrder.orderNumber}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => {
                      const progress = calculateProgress(dept.id)
                      const status = getDepartmentStatus(dept.id)
                      
                      return (
                        <div key={dept.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{dept.name}</span>
                            <Badge variant={status === "completed" ? "default" : status === "in-progress" ? "secondary" : "outline"}>
                              {status === "completed" ? "完成" : status === "in-progress" ? "進行中" : "待處理"}
                            </Badge>
                          </div>
                          <Progress value={progress} className="w-full" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 工作流程頁面 */}
          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>生產流程圖</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center space-x-4">
                  {departments.map((dept, index) => (
                    <div key={dept.id} className="flex items-center">
                      <div className={`p-4 rounded-lg border ${dept.color} ${dept.textColor}`}>
                        <dept.icon className="w-6 h-6" />
                        <p className="text-sm font-medium mt-1">{dept.name}</p>
                      </div>
                      {index < departments.length - 1 && (
                        <div className="mx-2 text-gray-400">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 表單管理頁面 */}
          <TabsContent value="forms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {departments.filter(dept => (forms as Record<string, any[]>)[dept.id]).map((dept) => (
                <Card key={dept.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <dept.icon className="w-5 h-5" />
                      {dept.name}
                    </CardTitle>
                    {/* 只在抽袋課顯示恢復預設值按鈕 */}
                    {dept.id === "bag-forming" && (
                      <Button size="sm" variant="outline" onClick={handleResetDefault}>
                        恢復預設值
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* 抽袋課拖曳區域 */}
                      {dept.id === "bag-forming" ? (
                        <>
                          <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="bagFormingForms">
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                  {bagFormingList.map((form, idx) => (
                                    <Draggable key={`${form.name}-${idx}`} draggableId={`${form.name}-${idx}`} index={idx}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2 ${snapshot.isDragging ? "ring-2 ring-blue-400 shadow-lg" : ""}`}
                                        >
                                          <div className="flex items-center gap-2">
                                            {newFormNames.includes(form.name) && <Badge variant="secondary" className="text-xs">new</Badge>}
                                            <div>
                                              <p className="font-medium text-sm">{form.name}</p>
                                              <p className="text-xs text-gray-500">{form.type}</p>
                                            </div>
                                          </div>
                                          <div className="flex gap-1">
                                            <Button size="sm" variant="outline">
                                              <Eye className="w-3 h-3" />
                                            </Button>
                                            <Button size="sm" variant="outline">
                                              <Edit className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </DragDropContext>
                          {/* 新增其他可填表單按鈕 */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full mt-3">
                                <Plus className="w-4 h-4 mr-2" />
                                新增其他可填表單
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>新增其他可填表單</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-3">
                                {bagFormingFormOptions.map((option, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                                    <div>
                                      <p className="font-medium text-sm">{option.name}</p>
                                      <p className="text-xs text-gray-500">{option.type}</p>
                                    </div>
                                    <Button size="sm" onClick={() => handleAddForm(option)}>
                                      選擇
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      ) : (
                        // 其他部門正常渲染
                        <>
                          {(forms as Record<string, any[]>)[dept.id]?.map((form, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-sm">{form.name}</p>
                                <p className="text-xs text-gray-500">{form.type}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
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
                  <CardTitle>部門效率統計</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="flex items-center justify-between">
                        <span className="text-sm">{dept.name}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={Math.random() * 100} className="w-20" />
                          <span className="text-sm text-gray-500">{Math.round(Math.random() * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>品質統計</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">合格率</span>
                      <Badge variant="default">98.5%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">不良率</span>
                      <Badge variant="destructive">1.5%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">返工率</span>
                      <Badge variant="secondary">0.8%</Badge>
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
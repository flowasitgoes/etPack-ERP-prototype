"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Printer, Download, Edit } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getOrderById, updateOrder } from "@/lib/order-storage"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OrderData {
  id: string
  customerName: string
  productName: string
  customNumber: string
  deliveryDate: string
  orderQuantity: string
  configNumber: string
  productionConditions: string
  bagFormingNotes: string
  bagFormingImage?: string
  printingNotesLeft: string
  printingNotesRight: string
  cuttingNotesLeft: string
  cuttingNotesRight: string
  status: string
  currentDept: string
  progress: number
  createdBy: string
  createdDate: string
  lastUpdate: string // 添加這個欄位
  workRecords: Array<{
    id: number
    operationDate: string
    shift: string
    time: string
    machine: string
    operator: string
    productionQty: string
    materialQty: string
  }>
  approver: string
  manager: string
}

export default function OrderPreview({ params }: { params: { orderId: string } }) {
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<{
    approver: string
    manager: string
    createdBy: string
  }>({
    approver: "",
    manager: "",
    createdBy: "",
  })

  useEffect(() => {
    const fetchOrderData = () => {
      // 從儲存的資料中獲取訂單
      const storedOrder = getOrderById(params.orderId)

      if (storedOrder) {
        setOrderData(storedOrder)
        // 初始化編輯資料
        setEditData({
          approver: storedOrder.approver,
          manager: storedOrder.manager,
          createdBy: storedOrder.createdBy,
        })
      } else {
        // 如果找不到，設為 null（會顯示錯誤訊息）
        setOrderData(null)
      }

      setLoading(false)
    }

    fetchOrderData()

    // 監聽資料更新
    const handleStorageChange = () => {
      fetchOrderData()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("ordersUpdated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("ordersUpdated", handleStorageChange)
    }
  }, [params.orderId])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // 實現下載PDF功能
    alert("下載功能開發中...")
  }

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
      業務課: "bg-purple-100 text-purple-800",
      抽袋課: "bg-green-100 text-green-800",
      印刷課: "bg-blue-100 text-blue-800",
      貼合課: "bg-orange-100 text-orange-800",
      分條課: "bg-red-100 text-red-800",
      裁袋課: "bg-indigo-100 text-indigo-800",
    }
    return colors[dept] || "bg-gray-100 text-gray-800"
  }

  const handleSaveEdit = () => {
    if (orderData) {
      updateOrder(orderData.id, {
        approver: editData.approver,
        manager: editData.manager,
        createdBy: editData.createdBy,
      })

      // 更新本地狀態
      setOrderData({
        ...orderData,
        approver: editData.approver,
        manager: editData.manager,
        createdBy: editData.createdBy,
      })

      // 觸發自定義事件通知其他頁面更新
      window.dispatchEvent(new CustomEvent("ordersUpdated"))

      setIsEditing(false)
      alert("資料已成功更新！")
    }
  }

  const handleCancelEdit = () => {
    if (orderData) {
      setEditData({
        approver: orderData.approver,
        manager: orderData.manager,
        createdBy: orderData.createdBy,
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入訂單資料中...</p>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">找不到訂單資料</p>
          <Link href="/process-records">
            <Button>返回主頁</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 操作按鈕區域 - 不會被列印 */}
        <div className="mb-6 print:hidden">
          <div className="flex justify-between items-center">
            <Link href="/process-records">
              <Button variant="outline" className="bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回訂單列表
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleDownload} className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                下載PDF
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="bg-transparent">
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "取消編輯" : "編輯資料"}
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                列印
              </Button>
            </div>
          </div>
        </div>

        {/* 訂單狀態資訊 - 不會被列印 */}
        <Card className="mb-6 print:hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">訂單預覽</h1>
                <Badge className={getStatusColor(orderData.status)}>{orderData.status}</Badge>
                <Badge className={getDeptColor(orderData.currentDept)}>當前: {orderData.currentDept}</Badge>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div>建立者: {orderData.createdBy}</div>
                <div>建立日期: {orderData.createdDate}</div>
                <div className="text-blue-600 font-medium">Last Update: {orderData.lastUpdate}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>整體進度</span>
                <span>{orderData.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${orderData.progress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 訂製單內容 */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="space-y-0">
              {/* Header Section */}
              <div className="border-2 border-black">
                <div className="text-center py-4 border-b border-black">
                  <h1 className="text-2xl font-bold">XXYY工業股份有限公司</h1>
                  <h2 className="text-xl font-bold mt-2">訂製單記錄表</h2>
                  <div className="flex justify-between items-center mt-2 px-4">
                    <span>單米重：54.11C(單層)</span>
                    <div className="bg-gray-200 px-4 py-1">送正隆</div>
                  </div>
                </div>

                {/* Order Information */}
                <div className="border-b border-black">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-black p-2 bg-gray-100 font-medium w-24">訂單編號</td>
                        <td className="border border-black p-2">{orderData.id}</td>
                        <td className="border border-black p-2 bg-gray-100 font-medium w-24">交貨日期</td>
                        <td className="border border-black p-2">{orderData.deliveryDate}</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 bg-gray-100 font-medium">客戶名稱</td>
                        <td className="border border-black p-2">{orderData.customerName}</td>
                        <td className="border border-black p-2 bg-gray-100 font-medium">訂製數量</td>
                        <td className="border border-black p-2">{orderData.orderQuantity}</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 bg-gray-100 font-medium">品名</td>
                        <td className="border border-black p-2">{orderData.productName}</td>
                        <td className="border border-black p-2 bg-gray-100 font-medium">配方編號</td>
                        <td className="border border-black p-2">{orderData.configNumber}</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 bg-gray-100 font-medium">自訂號</td>
                        <td className="border border-black p-2">{orderData.customNumber}</td>
                        <td className="border border-black p-2 bg-gray-100 font-medium">生產條件</td>
                        <td className="border border-black p-2">{orderData.productionConditions}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Production Specifications */}
                <div className="border-b border-black">
                  <div className="p-2 bg-gray-100 font-medium text-center">各單位生產規格描述</div>

                  {/* 抽袋 Section */}
                  <div className="border-b border-gray-400">
                    <div className="flex">
                      <div className="bg-gray-100 border-r border-black p-3 font-medium text-center w-20 flex items-center justify-center">
                        <div className="whitespace-nowrap">抽袋</div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium mb-2">上傳圖片（表格收據）</div>
                            <div className="border border-gray-300 rounded p-4 bg-gray-50 min-h-[100px] flex items-center justify-center">
                              {orderData.bagFormingImage ? (
                                <img
                                  src={orderData.bagFormingImage || "/placeholder.svg"}
                                  alt="抽袋圖片"
                                  className="max-h-24"
                                />
                              ) : (
                                <span className="text-gray-500">無上傳圖片</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium mb-2">備註</div>
                            <div className="border border-gray-300 rounded p-3 bg-gray-50 min-h-[100px] whitespace-pre-line">
                              {orderData.bagFormingNotes || "無備註"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 印刷 Section */}
                  <div className="border-b border-gray-400">
                    <div className="flex">
                      <div className="bg-gray-100 border-r border-black p-3 font-medium text-center w-20 flex items-center justify-center">
                        <div className="whitespace-nowrap">印刷</div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium mb-2">備註（左）</div>
                            <div className="border border-gray-300 rounded p-3 bg-gray-50 min-h-[100px] whitespace-pre-line">
                              {orderData.printingNotesLeft || "無備註"}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium mb-2">生產條件（右）</div>
                            <div className="border border-gray-300 rounded p-3 bg-gray-50 min-h-[100px] whitespace-pre-line">
                              {orderData.printingNotesRight || "無備註"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 裁袋 Section */}
                  <div>
                    <div className="flex">
                      <div className="bg-gray-100 border-r border-black p-3 font-medium text-center w-20 flex items-center justify-center">
                        <div className="whitespace-nowrap">裁袋</div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium mb-2">規格（左）</div>
                            <div className="border border-gray-300 rounded p-3 bg-gray-50 min-h-[120px] whitespace-pre-line">
                              {orderData.cuttingNotesLeft || "無規格"}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium mb-2">成品要求（右）</div>
                            <div className="border border-gray-300 rounded p-3 bg-gray-50 min-h-[120px] whitespace-pre-line">
                              {orderData.cuttingNotesRight || "無要求"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Records Table */}
                <div className="border-b border-black">
                  <div className="p-2 bg-gray-100 font-medium text-center">單位領料記錄</div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-black p-2 bg-gray-100 font-medium">操作日期</th>
                        <th className="border border-black p-2 bg-gray-100 font-medium">班別</th>
                        <th className="border border-black p-2 bg-gray-100 font-medium">時間</th>
                        <th className="border border-black p-2 bg-gray-100 font-medium">機台</th>
                        <th className="border border-black p-2 bg-gray-100 font-medium">操作人員</th>
                        <th className="border border-black p-2 bg-gray-100 font-medium">產量數量</th>
                        <th className="border border-black p-2 bg-gray-100 font-medium">料料數量</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.workRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="border border-black p-2 text-center">{record.operationDate}</td>
                          <td className="border border-black p-2 text-center">{record.shift}</td>
                          <td className="border border-black p-2 text-center">{record.time}</td>
                          <td className="border border-black p-2 text-center">{record.machine}</td>
                          <td className="border border-black p-2 text-center">{record.operator}</td>
                          <td className="border border-black p-2 text-center">{record.productionQty}</td>
                          <td className="border border-black p-2 text-center">{record.materialQty}</td>
                        </tr>
                      ))}
                      {/* 空白行 */}
                      {Array.from({ length: Math.max(0, 5 - orderData.workRecords.length) }, (_, i) => (
                        <tr key={`empty-${i}`}>
                          <td className="border border-black p-2 h-10"></td>
                          <td className="border border-black p-2"></td>
                          <td className="border border-black p-2"></td>
                          <td className="border border-black p-2"></td>
                          <td className="border border-black p-2"></td>
                          <td className="border border-black p-2"></td>
                          <td className="border border-black p-2"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Approval Section */}
                <div className="p-4">
                  {isEditing && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-blue-800">編輯簽核資訊</h3>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleSaveEdit}>
                            儲存
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            取消
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium">總經理</Label>
                          <Input
                            value={editData.manager}
                            onChange={(e) => setEditData({ ...editData, manager: e.target.value })}
                            placeholder="例: 業務助理07/14"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">經理</Label>
                          <Input
                            value={editData.approver}
                            onChange={(e) => setEditData({ ...editData, approver: e.target.value })}
                            placeholder="例: 陳經理07/14"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">製單</Label>
                          <Input
                            value={editData.createdBy}
                            onChange={(e) => setEditData({ ...editData, createdBy: e.target.value })}
                            placeholder="例: 業務助理07/14"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-black p-3 bg-gray-100 font-medium w-24">核簽</td>
                        <td className="border border-black p-3 w-1/3">
                          <div className="text-center">
                            <div className="mb-2">總經理</div>
                            <div className="font-medium">{orderData.manager || "待簽核"}</div>
                          </div>
                        </td>
                        <td className="border border-black p-3 w-1/3">
                          <div className="text-center">
                            <div className="mb-2">經理</div>
                            <div className="font-medium">{orderData.approver || "待簽核"}</div>
                          </div>
                        </td>
                        <td className="border border-black p-3 w-1/3">
                          <div className="text-center">
                            <div className="mb-2">製單</div>
                            <div className="font-medium">{orderData.createdBy}</div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

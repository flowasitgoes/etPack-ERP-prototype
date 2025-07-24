"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { saveOrder, generateOrderId, getCurrentDateTime, getCurrentDate } from "@/lib/order-storage"
import { useRouter } from "next/navigation"

interface WorkRecord {
  id: number
  operationDate: string
  shift: string
  time: string
  machine: string
  operator: string
  productionQty: string
  materialQty: string
}

export default function CustomOrderRecord() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    // Header info
    formNumber: "54.11C",
    orderNumber: "",
    customerName: "",
    productName: "",
    customNumber: "",
    deliveryDate: "",
    orderQuantity: "",
    configNumber: "",
    productionConditions: "",

    // Production specifications
    bagFormingNotes: "",
    printingNotesLeft: "",
    printingNotesRight: "",
    cuttingNotesLeft: "",
    cuttingNotesRight: "",

    // Approval
    approver: "",
    manager: "",
  })

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [workRecords, setWorkRecords] = useState<WorkRecord[]>(
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      operationDate: "",
      shift: "",
      time: "",
      machine: "",
      operator: "",
      productionQty: "",
      materialQty: "",
    })),
  )

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    setImageFile(null)
  }

  const handleWorkRecordChange = (id: number, field: keyof WorkRecord, value: string) => {
    setWorkRecords((prev) => prev.map((record) => (record.id === id ? { ...record, [field]: value } : record)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 驗證必填欄位
    if (!formData.customerName || !formData.productName || !formData.orderQuantity || !formData.deliveryDate) {
      alert("請填寫所有必填欄位（客戶名稱、品名、訂製數量、交貨日期）")
      return
    }

    // 生成新的訂單ID和時間
    const newOrderId = generateOrderId()
    const currentDateTime = getCurrentDateTime()
    const currentDate = getCurrentDate()

    // 準備訂單資料
    const orderData = {
      id: newOrderId,
      customerName: formData.customerName,
      productName: formData.productName,
      customNumber: formData.customNumber,
      deliveryDate: formData.deliveryDate,
      orderQuantity: formData.orderQuantity,
      configNumber: formData.configNumber,
      productionConditions: formData.productionConditions,
      bagFormingNotes: formData.bagFormingNotes,
      bagFormingImage: uploadedImage || undefined,
      printingNotesLeft: formData.printingNotesLeft,
      printingNotesRight: formData.printingNotesRight,
      cuttingNotesLeft: formData.cuttingNotesLeft,
      cuttingNotesRight: formData.cuttingNotesRight,
      status: "進行中",
      currentDept: "業務課",
      progress: 10,
      createdBy: "業務助理",
      createdDate: currentDate,
      lastUpdate: currentDateTime,
      workRecords: workRecords.filter(
        (record) =>
          record.operationDate ||
          record.shift ||
          record.time ||
          record.machine ||
          record.operator ||
          record.productionQty ||
          record.materialQty,
      ),
      approver: formData.approver,
      manager: formData.manager,
    }

    // 儲存訂單
    saveOrder(orderData)

    // 顯示成功訊息
    alert(`訂製單記錄表已成功提交！\n訂單編號：${newOrderId}\n您可以在主頁的"現有執行中訂單"中查看此訂單。`)

    // 重置表單
    setFormData({
      formNumber: "54.11C",
      orderNumber: "",
      customerName: "",
      productName: "",
      customNumber: "",
      deliveryDate: "",
      orderQuantity: "",
      configNumber: "",
      productionConditions: "",
      bagFormingNotes: "",
      printingNotesLeft: "",
      printingNotesRight: "",
      cuttingNotesLeft: "",
      cuttingNotesRight: "",
      approver: "",
      manager: "",
    })

    setUploadedImage(null)
    setImageFile(null)
    setWorkRecords(
      Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        operationDate: "",
        shift: "",
        time: "",
        machine: "",
        operator: "",
        productionQty: "",
        materialQty: "",
      })),
    )

    // 3秒後導向主頁
    setTimeout(() => {
      router.push("/process-records")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/process-records/sales-dept">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回業務課
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-0">
              {/* Header Section */}
              <div className="border-2 border-black">
                <div className="text-center py-4 border-b border-black">
                  <h1 className="text-2xl font-bold">XXYY工業股份有限公司</h1>
                  <h2 className="text-xl font-bold mt-2">訂製單記錄表</h2>
                  <div className="flex justify-between items-center mt-2 px-4">
                    <span>單米重：{formData.formNumber}(單層)</span>
                    <div className="bg-gray-200 px-4 py-1">送正隆</div>
                  </div>
                </div>

                {/* Order Information */}
                <div className="border-b border-black">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-black p-2 bg-gray-100 font-medium w-24">訂單編號</td>
                        <td className="border border-black p-2">
                          <Input
                            value={formData.orderNumber}
                            onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                            className="border-0 bg-transparent"
                            placeholder="K011404140001"
                          />
                        </td>
                        <td className="border border-black p-2 bg-gray-100 font-medium w-24">交貨日期</td>
                        <td className="border border-black p-2">
                          <Input
                            type="date"
                            value={formData.deliveryDate}
                            onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                            className="border-0 bg-transparent"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 bg-gray-100 font-medium">客戶名稱</td>
                        <td className="border border-black p-2">
                          <Input
                            value={formData.customerName}
                            onChange={(e) => handleInputChange("customerName", e.target.value)}
                            className="border-0 bg-transparent"
                            placeholder="XX/KW8010"
                          />
                        </td>
                        <td className="border border-black p-2 bg-gray-100 font-medium">訂製數量</td>
                        <td className="border border-black p-2">
                          <Input
                            value={formData.orderQuantity}
                            onChange={(e) => handleInputChange("orderQuantity", e.target.value)}
                            className="border-0 bg-transparent"
                            placeholder="12800只/20箱"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 bg-gray-100 font-medium">品名</td>
                        <td className="border border-black p-2">
                          <Input
                            value={formData.productName}
                            onChange={(e) => handleInputChange("productName", e.target.value)}
                            className="border-0 bg-transparent"
                            placeholder="XX8入染白壹字袋114.5*41.2C"
                          />
                        </td>
                        <td className="border border-black p-2 bg-gray-100 font-medium">配方編號</td>
                        <td className="border border-black p-2">
                          <Input
                            value={formData.configNumber}
                            onChange={(e) => handleInputChange("configNumber", e.target.value)}
                            className="border-0 bg-transparent"
                            placeholder="EW-28-1"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 bg-gray-100 font-medium">自訂號</td>
                        <td className="border border-black p-2">
                          <Input
                            value={formData.customNumber}
                            onChange={(e) => handleInputChange("customNumber", e.target.value)}
                            className="border-0 bg-transparent"
                            placeholder="W8010-B02001"
                          />
                        </td>
                        <td className="border border-black p-2 bg-gray-100 font-medium">生產條件</td>
                        <td className="border border-black p-2">
                          <Input
                            value={formData.productionConditions}
                            onChange={(e) => handleInputChange("productionConditions", e.target.value)}
                            className="border-0 bg-transparent"
                            placeholder="抽3000M*2R/約260K/染白雙理"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Production Specifications - 3 Sections */}
                <div className="border-b border-black">
                  <div className="p-2 bg-gray-100 font-medium text-center">各單位生產規格描述</div>

                  {/* 抽袋 Section */}
                  <div className="border-b border-gray-400">
                    <div className="flex">
                      <div className="bg-gray-100 border-r border-black p-3 font-medium text-center w-20 flex items-center justify-center">
                        <div className=" whitespace-nowrap">抽袋</div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Image Upload */}
                          <div>
                            <Label className="font-medium mb-2 block">上傳圖片（表格收據）</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                              {uploadedImage ? (
                                <div className="relative">
                                  <img
                                    src={uploadedImage || "/placeholder.svg"}
                                    alt="上傳的圖片"
                                    className="max-w-full h-32 object-contain mx-auto"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-0 right-0"
                                    onClick={removeImage}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                  />
                                  <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                                  >
                                    點擊上傳圖片
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <Label className="font-medium mb-2 block">備註</Label>
                            <Textarea
                              value={formData.bagFormingNotes}
                              onChange={(e) => handleInputChange("bagFormingNotes", e.target.value)}
                              className="border border-gray-300 h-32"
                              placeholder="厚度: 0.04mm, 處理面中間94cm&#10;寬度: 抽足114.5cm 雙剖雙收過轉模"
                            />
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
                          {/* Left Notes */}
                          <div>
                            <Label className="font-medium mb-2 block">備註（左）</Label>
                            <Textarea
                              value={formData.printingNotesLeft}
                              onChange={(e) => handleInputChange("printingNotesLeft", e.target.value)}
                              className="border border-gray-300 h-32"
                              placeholder="獨立印刷2色版圓周420mm*1300mm&#10;1. 特橘 2.黑&#10;捲收後拉出方向尾出"
                            />
                          </div>

                          {/* Right Notes */}
                          <div>
                            <Label className="font-medium mb-2 block">生產條件（右）</Label>
                            <Textarea
                              value={formData.printingNotesRight}
                              onChange={(e) => handleInputChange("printingNotesRight", e.target.value)}
                              className="border border-gray-300 h-32"
                              placeholder="印3000M*2R/約260K&#10;條碼: 4712425028076"
                            />
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
                          {/* Left Notes */}
                          <div>
                            <Label className="font-medium mb-2 block">規格（左）</Label>
                            <Textarea
                              value={formData.cuttingNotesLeft}
                              onChange={(e) => handleInputChange("cuttingNotesLeft", e.target.value)}
                              className="border border-gray-300 h-40"
                              placeholder="1.套字袋長41.2cm      2.內折4.5cm&#10;3.信封口4±0.3cm       4.手提部份寬度2cm&#10;5.孔距23cm            6.消風孔10mm*2個&#10;7.孔距孔離邊1.5公分    8.80PC/把, 640只/箱&#10;9.握把除料高度0.8~1.3cm 10.撕裂線1~1.5cm"
                            />
                          </div>

                          {/* Right Notes */}
                          <div>
                            <Label className="font-medium mb-2 block">成品要求（右）</Label>
                            <Textarea
                              value={formData.cuttingNotesRight}
                              onChange={(e) => handleInputChange("cuttingNotesRight", e.target.value)}
                              className="border border-gray-300 h-40"
                              placeholder="塑膠扣方向成品:短邊朝上&#10;長扣在上 短扣在下&#10;&#10;1.請拿2A紙箱,6箱下層,貼紙額外"
                            />
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
                      {workRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="border border-black p-1">
                            <Input
                              type="date"
                              value={record.operationDate}
                              onChange={(e) => handleWorkRecordChange(record.id, "operationDate", e.target.value)}
                              className="border-0 bg-transparent text-sm"
                            />
                          </td>
                          <td className="border border-black p-1">
                            <Input
                              value={record.shift}
                              onChange={(e) => handleWorkRecordChange(record.id, "shift", e.target.value)}
                              className="border-0 bg-transparent text-sm"
                              placeholder="C"
                            />
                          </td>
                          <td className="border border-black p-1">
                            <Input
                              value={record.time}
                              onChange={(e) => handleWorkRecordChange(record.id, "time", e.target.value)}
                              className="border-0 bg-transparent text-sm"
                              placeholder="8:30"
                            />
                          </td>
                          <td className="border border-black p-1">
                            <Input
                              value={record.machine}
                              onChange={(e) => handleWorkRecordChange(record.id, "machine", e.target.value)}
                              className="border-0 bg-transparent text-sm"
                              placeholder="1"
                            />
                          </td>
                          <td className="border border-black p-1">
                            <Input
                              value={record.operator}
                              onChange={(e) => handleWorkRecordChange(record.id, "operator", e.target.value)}
                              className="border-0 bg-transparent text-sm"
                              placeholder="操作員"
                            />
                          </td>
                          <td className="border border-black p-1">
                            <Input
                              value={record.productionQty}
                              onChange={(e) => handleWorkRecordChange(record.id, "productionQty", e.target.value)}
                              className="border-0 bg-transparent text-sm"
                              placeholder="數量"
                            />
                          </td>
                          <td className="border border-black p-1">
                            <Input
                              value={record.materialQty}
                              onChange={(e) => handleWorkRecordChange(record.id, "materialQty", e.target.value)}
                              className="border-0 bg-transparent text-sm"
                              placeholder="料量"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Approval Section */}
                <div className="p-4">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-black p-3 bg-gray-100 font-medium w-24">核簽</td>
                        <td className="border border-black p-3 w-1/3">
                          <div className="text-center">
                            <div className="mb-2">總經理</div>
                            <Input
                              value={formData.manager}
                              onChange={(e) => handleInputChange("manager", e.target.value)}
                              className="border-0 bg-transparent text-center"
                            />
                          </div>
                        </td>
                        <td className="border border-black p-3 w-1/3">
                          <div className="text-center">
                            <div className="mb-2">經理</div>
                            <Input
                              value={formData.approver}
                              onChange={(e) => handleInputChange("approver", e.target.value)}
                              className="border-0 bg-transparent text-center"
                            />
                          </div>
                        </td>
                        <td className="border border-black p-3 w-1/3">
                          <div className="text-center">
                            <div className="mb-2">製單</div>
                            <Input className="border-0 bg-transparent text-center" placeholder="製單人員" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <Button type="submit" className="px-8 py-2 text-lg">
                  提交訂製單記錄表
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface MaterialItem {
  id: number
  materialName: string
  quantity: string
}

export default function MaterialWithdrawalForm() {
  const [formData, setFormData] = useState({
    formNumber: "241950",
    orderNumber: "",
    withdrawalDate: "",
    totalQuantity: "",
    approver: "",
    withdrawer: "",
  })

  const [materials, setMaterials] = useState<MaterialItem[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      materialName: "",
      quantity: "",
    })),
  )

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMaterialChange = (id: number, field: keyof MaterialItem, value: string) => {
    setMaterials((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const calculateTotal = () => {
    const total = materials.reduce((sum, item) => {
      const quantity = Number.parseFloat(item.quantity) || 0
      return sum + quantity
    }, 0)
    setFormData((prev) => ({ ...prev, totalQuantity: total.toString() }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateTotal()
    console.log("Form Data:", formData)
    console.log("Materials:", materials)
    alert("領料單已提交！")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/process-records">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回表單選擇
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-0">
              {/* Header Section */}
              <div className="border-2 border-black">
                <div className="text-center py-4 border-b border-black">
                  <h1 className="text-2xl font-bold">久藝塑膠工業股份有限公司</h1>
                </div>

                <div className="flex items-center justify-between p-4 border-b border-black">
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                      <Label className="text-lg font-medium">訂單編號：</Label>
                      <Input
                        value={formData.orderNumber}
                        onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                        className="border-0 bg-transparent text-lg w-48"
                        placeholder="依據客戶訂單"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-2">領 料 單</h2>
                    <div className="text-2xl font-bold text-red-600">{formData.formNumber}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label className="text-lg font-medium">領料日期：</Label>
                    <Input
                      type="date"
                      value={formData.withdrawalDate}
                      onChange={(e) => handleInputChange("withdrawalDate", e.target.value)}
                      className="border-0 bg-transparent text-lg"
                    />
                  </div>
                </div>

                {/* Main Table */}
                <div className="relative">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-black p-3 bg-gray-100 font-medium w-20">項次</th>
                        <th className="border border-black p-3 bg-gray-100 font-medium">領料名稱</th>
                        <th className="border border-black p-3 bg-gray-100 font-medium w-40">領料數量</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map((material) => (
                        <tr key={material.id}>
                          <td className="border border-black p-3 text-center font-medium">{material.id}</td>
                          <td className="border border-black p-3">
                            <Input
                              value={material.materialName}
                              onChange={(e) => handleMaterialChange(material.id, "materialName", e.target.value)}
                              className="border-0 bg-transparent"
                              placeholder="輸入材料名稱"
                            />
                          </td>
                          <td className="border border-black p-3">
                            <Input
                              value={material.quantity}
                              onChange={(e) => handleMaterialChange(material.id, "quantity", e.target.value)}
                              className="border-0 bg-transparent"
                              placeholder="輸入數量"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Side Labels */}
                  <div className="absolute right-0 top-0 h-full flex flex-col justify-center">
                    <div className="bg-gray-100 border border-black p-2 text-center font-medium text-sm">
                      <div>第</div>
                      <div>一</div>
                      <div>聯</div>
                      <div>：</div>
                      <div>採</div>
                      <div>購</div>
                      <div>(</div>
                      <div>白</div>
                      <div>)</div>
                    </div>
                  </div>
                  <div className="absolute right-0 bottom-0 h-1/2 flex flex-col justify-center">
                    <div className="bg-gray-100 border border-black p-2 text-center font-medium text-sm">
                      <div>第</div>
                      <div>二</div>
                      <div>聯</div>
                      <div>：</div>
                      <div>倉</div>
                      <div>管</div>
                      <div>(</div>
                      <div>紅</div>
                      <div>)</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-black">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="border-r border-black p-4 w-1/2">
                          <div className="flex items-center space-x-2">
                            <Label className="text-lg font-medium whitespace-nowrap">合計領料數量：</Label>
                            <Input
                              value={formData.totalQuantity}
                              onChange={(e) => handleInputChange("totalQuantity", e.target.value)}
                              className="border-0 bg-transparent text-lg font-medium flex-1"
                              placeholder="自動計算或手動輸入"
                            />
                          </div>
                        </td>
                        <td className="p-4 w-1/2">
                          <div className="flex justify-between">
                            <div className="flex items-center space-x-2">
                              <Label className="text-lg font-medium whitespace-nowrap">核准：</Label>
                              <Input
                                value={formData.approver}
                                onChange={(e) => handleInputChange("approver", e.target.value)}
                                className="border-0 bg-transparent text-lg w-24"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Label className="text-lg font-medium whitespace-nowrap">領料者：</Label>
                              <Input
                                value={formData.withdrawer}
                                onChange={(e) => handleInputChange("withdrawer", e.target.value)}
                                className="border-0 bg-transparent text-lg w-24"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <div className="flex space-x-4">
                  <Button type="button" onClick={calculateTotal} variant="outline" className="px-6 py-2 bg-transparent">
                    計算總數量
                  </Button>
                  <Button type="submit" className="px-8 py-2 text-lg">
                    提交領料單
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

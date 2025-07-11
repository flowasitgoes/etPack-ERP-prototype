"use client"

import { useState } from "react"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProductionForm() {
  const [formData, setFormData] = useState({
    productType: "",
    labelNumber: "211399",
    departments: {
      drawing: false,
      printing: false,
      laminating: false,
      folding: false,
      slitting: false,
      cutting: false,
    },
    customerName: "",
    productName: "",
    productSpec: "",
    orderNumber: "",
    orderQuantity: "",
    completionDate: "",
    operator: "",
    materialHandler: "",
    warehouseStaff: "",
  })

  const [quantities, setQuantities] = useState(Array.from({ length: 30 }, (_, i) => ({ id: i + 1, value: "" })))

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDepartmentChange = (dept: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      departments: { ...prev.departments, [dept]: checked },
    }))
  }

  const handleQuantityChange = (id: number, value: string) => {
    setQuantities((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Data:", formData)
    console.log("Quantities:", quantities)
    alert("表單已提交！")
  }

  const router = useRouter()

  useEffect(() => {
    // 自動重定向到 process-records
    router.push("/process-records")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">生產追蹤表單</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header Section */}
              <div className="border-2 border-black p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="semi-finished"
                        checked={formData.productType === "semi-finished"}
                        onCheckedChange={(checked) => handleInputChange("productType", checked ? "semi-finished" : "")}
                      />
                      <Label htmlFor="semi-finished" className="text-lg font-medium">
                        半成品
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="finished"
                        checked={formData.productType === "finished"}
                        onCheckedChange={(checked) => handleInputChange("productType", checked ? "finished" : "")}
                      />
                      <Label htmlFor="finished" className="text-lg font-medium">
                        成品
                      </Label>
                    </div>
                    <span className="text-lg font-medium">標示單</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{formData.labelNumber}</div>
                </div>

                {/* Department Selection */}
                <div className="mb-4">
                  <Label className="text-lg font-medium mb-2 block">部門：</Label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { key: "drawing", label: "抽袋" },
                      { key: "printing", label: "印刷" },
                      { key: "laminating", label: "貼合" },
                      { key: "folding", label: "折角" },
                      { key: "slitting", label: "分條" },
                      { key: "cutting", label: "裁袋" },
                    ].map((dept) => (
                      <div key={dept.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={dept.key}
                          checked={formData.departments[dept.key as keyof typeof formData.departments]}
                          onCheckedChange={(checked) => handleDepartmentChange(dept.key, checked as boolean)}
                        />
                        <Label htmlFor={dept.key}>{dept.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Form Fields */}
              <div className="border-2 border-black">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border border-black p-3 bg-gray-100 font-medium w-32">顧客名稱</td>
                      <td className="border border-black p-3">
                        <Input
                          value={formData.customerName}
                          onChange={(e) => handleInputChange("customerName", e.target.value)}
                          className="border-0 bg-transparent"
                        />
                      </td>
                      <td className="border border-black p-3 bg-gray-100 font-medium w-32">訂單編號</td>
                      <td className="border border-black p-3">
                        <Input
                          value={formData.orderNumber}
                          onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                          className="border-0 bg-transparent"
                        />
                      </td>
                      <td rowSpan={3} className="border border-black p-3 bg-gray-100 text-center font-medium w-20">
                        <div>第</div>
                        <div>一</div>
                        <div>聯</div>
                        <div>：</div>
                        <div>生</div>
                        <div>產</div>
                        <div>單</div>
                        <div>位</div>
                        <div>留</div>
                        <div>存</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-3 bg-gray-100 font-medium">產品名稱</td>
                      <td className="border border-black p-3">
                        <Input
                          value={formData.productName}
                          onChange={(e) => handleInputChange("productName", e.target.value)}
                          className="border-0 bg-transparent"
                        />
                      </td>
                      <td className="border border-black p-3 bg-gray-100 font-medium">訂單數量</td>
                      <td className="border border-black p-3">
                        <Input
                          value={formData.orderQuantity}
                          onChange={(e) => handleInputChange("orderQuantity", e.target.value)}
                          className="border-0 bg-transparent"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-3 bg-gray-100 font-medium">產品規格</td>
                      <td colSpan={3} className="border border-black p-3">
                        <Input
                          value={formData.productSpec}
                          onChange={(e) => handleInputChange("productSpec", e.target.value)}
                          className="border-0 bg-transparent"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Quantity Grid */}
              <div className="border-2 border-black">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td rowSpan={11} className="border border-black p-3 bg-gray-100 font-medium text-center w-20">
                        <div className="transform -rotate-90 whitespace-nowrap">數量</div>
                      </td>
                      {[1, 11, 21].map((start) => (
                        <td key={start} className="border border-black p-2 text-center font-medium bg-gray-50">
                          {start}
                        </td>
                      ))}
                      <td rowSpan={11} className="border border-black p-3 bg-gray-100 text-center font-medium w-20">
                        <div>第</div>
                        <div>二</div>
                        <div>聯</div>
                        <div>：</div>
                        <div>倉</div>
                        <div>儲</div>
                        <div>黃</div>
                      </td>
                    </tr>
                    {Array.from({ length: 10 }, (_, i) => (
                      <tr key={i}>
                        {[i + 2, i + 12, i + 22].map((num) => (
                          <td key={num} className="border border-black p-1">
                            <div className="flex items-center">
                              <span className="w-6 text-sm">{num}</span>
                              <Input
                                value={quantities.find((q) => q.id === num)?.value || ""}
                                onChange={(e) => handleQuantityChange(num, e.target.value)}
                                className="border-0 bg-transparent text-sm h-8"
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Section */}
              <div className="border-2 border-black">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border border-black p-3 bg-gray-100 font-medium w-32">完成日期</td>
                      <td className="border border-black p-3">
                        <Input
                          type="date"
                          value={formData.completionDate}
                          onChange={(e) => handleInputChange("completionDate", e.target.value)}
                          className="border-0 bg-transparent"
                        />
                      </td>
                      <td className="border border-black p-3 bg-gray-100 font-medium w-32">領料人員</td>
                      <td className="border border-black p-3">
                        <Input
                          value={formData.materialHandler}
                          onChange={(e) => handleInputChange("materialHandler", e.target.value)}
                          className="border-0 bg-transparent"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-3 bg-gray-100 font-medium">操作人員</td>
                      <td className="border border-black p-3">
                        <Input
                          value={formData.operator}
                          onChange={(e) => handleInputChange("operator", e.target.value)}
                          className="border-0 bg-transparent"
                        />
                      </td>
                      <td className="border border-black p-3 bg-gray-100 font-medium">倉儲人員</td>
                      <td className="border border-black p-3">
                        <Input
                          value={formData.warehouseStaff}
                          onChange={(e) => handleInputChange("warehouseStaff", e.target.value)}
                          className="border-0 bg-transparent"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Instructions */}
              <div className="text-sm space-y-1">
                <p>
                  <strong>說明：</strong>
                </p>
                <p>1. 勾選項目為各部門生產內容。</p>
                <p>2. 本表單一式二聯，第一聯由生產單位填寫，第二聯為倉儲存根聯。</p>
                <p>3. 表單填寫完成後，二聯一起貼在機台上，第一聯作為一關跟料單，第二聯為倉儲存根聯。</p>
              </div>

              <div className="flex justify-center pt-6">
                <Button type="submit" className="px-8 py-2 text-lg">
                  提交表單
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

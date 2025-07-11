"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, FileText, ClipboardList } from "lucide-react"
import Link from "next/link"

export default function SalesDeptPage() {
  const salesForms = [
    {
      name: "訂製單記錄表",
      path: "/process-records/sales-dept/custom-order-record",
      icon: FileText,
      description: "業務助理填寫的訂製單記錄表，作為生產流程的起始點",
      priority: true,
    },
    {
      name: "客戶資料管理",
      path: "/process-records/sales-dept/customer-management",
      icon: ClipboardList,
      description: "客戶基本資料和聯絡資訊管理",
      priority: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/process-records">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回主頁
            </Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <span>Sales Dept - 業務課</span>
            </CardTitle>
            <p className="text-gray-600 mt-2">業務課表單管理系統</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {salesForms.map((form) => {
            const IconComponent = form.icon
            return (
              <Card
                key={form.path}
                className={`hover:shadow-lg transition-shadow ${form.priority ? "ring-2 ring-blue-500" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                    <CardTitle className="text-lg">{form.name}</CardTitle>
                    {form.priority && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">主要表單</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{form.description}</p>
                  <Link href={form.path}>
                    <Button className="w-full">{form.priority ? "開始填寫" : "進入管理"}</Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>業務流程說明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>1. 訂製單記錄表</strong> - 業務助理填寫完整的產品規格和生產要求
              </p>
              <p>
                <strong>2. 流程傳遞</strong> - 表單內容將傳遞給各個生產課別執行
              </p>
              <p>
                <strong>3. 生產追蹤</strong> - 各課別根據此表單進行生產作業和記錄
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

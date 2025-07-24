"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Package, Archive, ArrowLeft } from "lucide-react"

export default function ProcessMemoPage() {
  const formTypes = [
    {
      name: "標示單",
      path: "/process-records/process-memo/production-tracking",
      icon: FileText,
      description: "生產過程追蹤和記錄表單",
    },
    {
      name: "領料單",
      path: "/process-records/process-memo/material-withdrawal-form",
      icon: Package,
      description: "材料領取和庫存管理表單",
    },
    {
      name: "入庫單",
      path: "/process-records/process-memo/inbound-receipt-form",
      icon: Archive,
      description: "貨品入庫和庫存增加表單",
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
            <CardTitle className="text-center text-2xl font-bold">製程備忘錄</CardTitle>
            <p className="text-center text-gray-600 mt-2">選擇其他表單類型</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formTypes.map((form) => {
            const IconComponent = form.icon
            return (
              <Card key={form.path} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                    <CardTitle className="text-lg">{form.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{form.description}</p>
                  <Link href={form.path}>
                    <Button className="w-full">使用此表單</Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

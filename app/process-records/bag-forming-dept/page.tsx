"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BagFormingDeptPage() {
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <Package className="h-8 w-8 text-green-600" />
              <span>Bag Forming Dept - 製袋部門</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">製袋部門記錄管理系統</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 text-lg">生產記錄</Button>
                <Button className="h-20 text-lg">品質檢驗</Button>
                <Button className="h-20 text-lg">設備維護</Button>
                <Button className="h-20 text-lg">產量統計</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

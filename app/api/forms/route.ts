import { NextRequest, NextResponse } from 'next/server'

// 模擬資料庫儲存（實際專案中會使用真實資料庫）
let formOrders: Record<string, any[]> = {}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const department = searchParams.get('department')
  
  if (!department) {
    return NextResponse.json({ error: 'Department is required' }, { status: 400 })
  }
  
  const orders = formOrders[department] || []
  return NextResponse.json({ orders })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { department, orders } = body
    
    if (!department || !orders) {
      return NextResponse.json({ error: 'Department and orders are required' }, { status: 400 })
    }
    
    // 儲存到模擬資料庫
    formOrders[department] = orders
    
    // 實際專案中這裡會儲存到真實資料庫
    // await db.forms.update({ department, orders })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Form order saved successfully',
      orders 
    })
  } catch (error) {
    console.error('Error saving form order:', error)
    return NextResponse.json({ error: 'Failed to save form order' }, { status: 500 })
  }
} 
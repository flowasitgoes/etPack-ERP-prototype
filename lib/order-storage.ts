export interface OrderData {
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
  lastUpdate: string
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

// 生成新的訂單ID
export function generateOrderId(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `K${year}${month}${day}${random}`
}

// 獲取當前時間字串
export function getCurrentDateTime(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 獲取當前日期字串
export function getCurrentDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// 儲存訂單到 localStorage
export function saveOrder(orderData: OrderData): void {
  try {
    const existingOrders = getOrders()
    const updatedOrders = [...existingOrders, orderData]
    localStorage.setItem("activeOrders", JSON.stringify(updatedOrders))
  } catch (error) {
    console.error("Error saving order:", error)
  }
}

// 從 localStorage 獲取所有訂單
export function getOrders(): OrderData[] {
  try {
    const stored = localStorage.getItem("activeOrders")
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error loading orders:", error)
  }

  // 如果沒有儲存的資料，返回預設的假設資料
  return [
    {
      id: "K011404140001",
              customerName: "XX/KW8010",
        productName: "XX8入染白壹字袋114.5*41.2C",
      customNumber: "W8010-B02001",
      deliveryDate: "2025-04-29",
      orderQuantity: "12800只/20箱",
      configNumber: "EW-28-1",
      productionConditions: "抽3000M*2R/約260K/染白雙理",
      bagFormingNotes: "厚度: 0.04mm, 處理面中間94cm\n寬度: 抽足114.5cm 雙剖雙收過轉模",
      printingNotesLeft: "獨立印刷2色版圓周420mm*1300mm\n1. 特橘 2.黑\n捲收後拉出方向尾出",
      printingNotesRight: "印3000M*2R/約260K\n條碼: 4712425028076",
      cuttingNotesLeft:
        "1.套字袋長41.2cm      2.內折4.5cm\n3.信封口4±0.3cm       4.手提部份寬度2cm\n5.孔距23cm            6.消風孔10mm*2個\n7.孔距孔離邊1.5公分    8.80PC/把, 640只/箱\n9.握把除料高度0.8~1.3cm 10.撕裂線1~1.5cm",
      cuttingNotesRight: "塑膠扣方向成品:短邊朝上\n長扣在上 短扣在下\n\n1.請拿2A紙箱,6箱下層,貼紙額外",
      status: "進行中",
      currentDept: "業務課",
      progress: 10,
      createdBy: "業務助理",
      createdDate: "2025-01-10",
      lastUpdate: "2025-01-10 14:30",
      workRecords: [],
      approver: "陳經理 07/14",
      manager: "業務助理 07/14",
    },
  ]
}

// 根據ID獲取特定訂單
export function getOrderById(id: string): OrderData | null {
  const orders = getOrders()
  return orders.find((order) => order.id === id) || null
}

// 更新訂單
export function updateOrder(id: string, updatedData: Partial<OrderData>): void {
  try {
    const orders = getOrders()
    const orderIndex = orders.findIndex((order) => order.id === id)
    if (orderIndex !== -1) {
      orders[orderIndex] = { ...orders[orderIndex], ...updatedData, lastUpdate: getCurrentDateTime() }
      localStorage.setItem("activeOrders", JSON.stringify(orders))
    }
  } catch (error) {
    console.error("Error updating order:", error)
  }
}

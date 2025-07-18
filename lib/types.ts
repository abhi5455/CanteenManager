export interface Student {
    name: string
    admissionNumber: string
    class: string
}

export interface MenuItem {
    id: number
    name: string
    price: number
    category: "main" | "snack" | "beverage"
    available: boolean
    description: string
    image?: string
}

export interface OrderItem {
    name: string
    price: number
    quantity: number
}

export interface Order {
    id: number
    studentName: string
    studentAdmissionNumber: string
    studentClass: string
    items: OrderItem[]
    total: number
    timeSlot: string
    status: "pending" | "preparing" | "ready" | "completed"
    timestamp: string
    orderNumber: string
}

export interface TimeSlot {
    id: string
    time: string
    label: string
    capacity: number
    currentOrders: number
}

export interface SystemStats {
    totalMealsOrdered: number
    todayRevenue: number
    pendingDues: number
    totalPendingOrders: number
}

export interface CanteenData {
    menu: MenuItem[]
    orders: Order[]
    timeSlots: TimeSlot[]
    systemStats: SystemStats
}

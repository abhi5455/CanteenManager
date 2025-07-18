"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChefHat, Clock, AlertCircle } from "lucide-react"
import type { Order } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface KitchenViewProps {
    orders: Order[]
    onUpdateStatus: (orderId: number, newStatus: Order["status"]) => void
}

export default function KitchenView({ orders, onUpdateStatus }: KitchenViewProps) {
    // Group orders by time slot and filter active orders
    const activeOrders = orders.filter((order) => order.status === "pending" || order.status === "preparing")

    const groupedOrders = activeOrders.reduce(
        (groups, order) => {
            const timeSlot = order.timeSlot
            if (!groups[timeSlot]) {
                groups[timeSlot] = []
            }
            groups[timeSlot].push(order)
            return groups
        },
        {} as Record<string, Order[]>,
    )

    const getOrderPriority = (order: Order) => {
        const orderTime = new Date(order.timestamp)
        const now = new Date()
        const minutesAgo = (now.getTime() - orderTime.getTime()) / (1000 * 60)

        if (minutesAgo > 15) return "high"
        if (minutesAgo > 10) return "medium"
        return "low"
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "border-red-500 bg-red-50"
            case "medium":
                return "border-yellow-500 bg-yellow-50"
            default:
                return "border-green-500 bg-green-50"
        }
    }

    const getPriorityIcon = (priority: string) => {
        if (priority === "high") {
            return <AlertCircle className="w-4 h-4 text-red-500" />
        }
        return <Clock className="w-4 h-4 text-gray-500" />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Kitchen View</h2>
                <Badge variant="secondary">{activeOrders.length} Active Orders</Badge>
            </div>

            {Object.keys(groupedOrders).length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <ChefHat className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-xl text-gray-500">No active orders</p>
                        <p className="text-gray-400">All caught up! 🎉</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedOrders).map(([timeSlot, slotOrders]) => (
                        <Card key={timeSlot}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        {timeSlot} Time Slot
                                    </div>
                                    <Badge variant="outline">{slotOrders.length} orders</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {slotOrders.map((order) => {
                                        const priority = getOrderPriority(order)
                                        const priorityColor = getPriorityColor(priority)
                                        const priorityIcon = getPriorityIcon(priority)

                                        return (
                                            <Card key={order.id} className={`border-2 ${priorityColor}`}>
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {priorityIcon}
                                                            <span className="font-mono text-sm">{order.orderNumber}</span>
                                                        </div>
                                                        <Badge
                                                            className={
                                                                order.status === "pending"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-blue-100 text-blue-800"
                                                            }
                                                        >
                                                            {order.status.toUpperCase()}
                                                        </Badge>
                                                    </div>

                                                    <div>
                                                        <p className="font-bold text-lg">{order.studentName}</p>
                                                        <p className="text-sm text-gray-600">{order.studentClass}</p>
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="space-y-3">
                                                    <div className="space-y-2">
                                                        {order.items.map((item, index) => (
                                                            <div key={index} className="flex justify-between text-sm">
                                <span className="font-medium">
                                  {item.name} ×{item.quantity}
                                </span>
                                                                <span className="text-gray-600">{formatCurrency(item.price * item.quantity)}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="border-t pt-2">
                                                        <div className="flex justify-between font-bold">
                                                            <span>Total:</span>
                                                            <span className="text-green-600">{formatCurrency(order.total)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {order.status === "pending" && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => onUpdateStatus(order.id, "preparing")}
                                                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                            >
                                                                Start Preparing
                                                            </Button>
                                                        )}
                                                        {order.status === "preparing" && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => onUpdateStatus(order.id, "ready")}
                                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                                            >
                                                                Mark Ready
                                                            </Button>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

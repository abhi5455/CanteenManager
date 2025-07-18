"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Receipt } from "lucide-react"
import type { Order } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface OrderConfirmationProps {
    order: Order
    onNewOrder: () => void
}

export default function OrderConfirmation({ order, onNewOrder }: OrderConfirmationProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-600">Order Confirmed!</CardTitle>
                    <p className="text-gray-600">Your order has been placed successfully</p>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Order Details */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Order Number:</span>
                            <Badge variant="secondary" className="font-mono">
                                {order.orderNumber}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="font-medium">Student:</span>
                            <span>{order.studentName}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="font-medium">Class:</span>
                            <span>{order.studentClass}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="font-medium">Admission Number:</span>
                            <span>{JSON.parse(localStorage.getItem("student") || "{}").admissionNumber}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="font-medium">Time Slot:</span>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4"/>
                                <span>{order.timeSlot}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                            <Receipt className="w-4 h-4"/>
                            Order Items
                        </h3>
                        <div className="space-y-2">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                                    <span>{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span className="text-orange-600">{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <Badge variant="secondary" className="mb-2">
                            {order.status.toUpperCase()}
                        </Badge>
                        <p className="text-sm text-gray-600">Your order is being prepared. Please wait for further updates.</p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                        <Button onClick={onNewOrder} className="w-full bg-orange-600 hover:bg-orange-700">
                            Place Another Order
                        </Button>
                        <Button variant="outline" className="w-full bg-transparent" onClick={() => window.print()}>
                            Print Receipt
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

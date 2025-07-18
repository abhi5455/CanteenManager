"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingCartIcon, Trash2Icon, PlusIcon, MinusIcon } from "lucide-react"
import type { OrderItem, Student } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface ShoppingCartProps {
    cart: OrderItem[]
    student: Student
    timeSlot: string
    onUpdateQuantity: (itemName: string, newQuantity: number) => void
    onRemoveItem: (itemName: string) => void
    onPlaceOrder: () => void
    isPlacingOrder: boolean
}

export default function ShoppingCartComponent({
                                                  cart,
                                                  student,
                                                  timeSlot,
                                                  onUpdateQuantity,
                                                  onRemoveItem,
                                                  onPlaceOrder,
                                                  isPlacingOrder,
                                              }: ShoppingCartProps) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    if (cart.length === 0) {
        return (
            <Card className="sticky top-4">
                <CardContent className="flex flex-col items-center justify-center py-8">
                    <ShoppingCartIcon className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center">Your cart is empty</p>
                    <p className="text-sm text-gray-400 text-center mt-1">Add items from the menu to get started</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="sticky top-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingCartIcon className="w-5 h-5" />
                    Your Order
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Student Info */}
                <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="font-medium text-orange-900">{student.name}</p>
                    <p className="text-sm text-orange-700">{student.class}</p>
                    <p className="text-sm text-orange-700">Time: {timeSlot}</p>
                </div>

                {/* Cart Items */}
                <div className="space-y-3">
                    {cart.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onUpdateQuantity(item.name, item.quantity - 1)}
                                        className="h-6 w-6 p-0"
                                    >
                                        <MinusIcon className="h-3 w-3" />
                                    </Button>
                                    <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onUpdateQuantity(item.name, item.quantity + 1)}
                                        className="h-6 w-6 p-0"
                                    >
                                        <PlusIcon className="h-3 w-3" />
                                    </Button>
                                </div>

                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onRemoveItem(item.name)}
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                >
                                    <Trash2Icon className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-orange-600">{formatCurrency(total)}</span>
                </div>

                {/* Place Order Button */}
                <Button onClick={onPlaceOrder} disabled={isPlacingOrder} className="w-full bg-orange-600 hover:bg-orange-700">
                    {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </Button>
            </CardContent>
        </Card>
    )
}

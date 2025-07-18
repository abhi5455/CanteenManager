"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChefHat, Clock, AlertCircle, Plus } from "lucide-react"
import type { Order } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import AdminMenuGrid from "@/app/admin/components/adminMenuGrid"
import { useState } from "react"
import axios from "axios"
import {BASE_URL} from "@/apiurl";

// API function to add order item (keeping original for backwards compatibility)
export const addOrderItem = async (orderId, item) => {
    const res = await axios.post(`${BASE_URL}/${orderId}/items`, item);
    return res.data;
};

// New API function to add item to menu
export const addMenuItem = async (item) => {
    const res = await axios.post(`${BASE_URL}/api/order-item/addItem`, item);
    return res.data;
};

interface KitchenViewProps {
    orders: Order[]
    onUpdateStatus: (orderId: number, newStatus: Order["status"]) => void
}

export default function KitchenView({ orders, onUpdateStatus }: KitchenViewProps) {
    const [selectedOrderId, setSelectedOrderId] = useState(null)
    const [isAddingItem, setIsAddingItem] = useState(false)

    // State variables for new item data (storing as strings as requested)
    const [itemName, setItemName] = useState("")
    const [itemPrice, setItemPrice] = useState("")
    const [itemQuantity, setItemQuantity] = useState("1")
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    const handleAddItem = async () => {
        if (!itemName.trim() || !itemPrice || parseFloat(itemPrice) <= 0) {
            alert("Please enter valid item name and price")
            return
        }

        setIsSubmitting(true)

        try {
            const item = {
                name: itemName.trim(),
                price: itemPrice, // Send as string to backend
                quantity: itemQuantity // Send as string to backend
            }
            console.log("Adding item:", item)

            await addMenuItem(item)

            // Reset form
            setItemName("")
            setItemPrice("")
            setItemQuantity("1")
            setIsAddingItem(false)

            alert("Item added successfully!")

            // You might want to refresh the menu or update the state here
            // depending on your state management approach

        } catch (error) {
            console.error("Error adding item:", error)
            alert("Failed to add item. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setItemName("")
        setItemPrice("")
        setItemQuantity("1")
        setIsAddingItem(false)
        setSelectedOrderId(null)
    }

    const AddItemForm = () => (
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    Add New Food Item to Menu
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Item Name</label>
                    <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter item name (e.g., Samosa)"
                        disabled={isSubmitting}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                            type="text"
                            value={itemPrice}
                            onChange={(e) => setItemPrice(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="15.00"
                            disabled={isSubmitting}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <input
                            type="text"
                            value={itemQuantity}
                            onChange={(e) => setItemQuantity(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="1"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handleAddItem}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        disabled={isSubmitting || !itemName.trim() || !itemPrice || parseFloat(itemPrice) <= 0}
                    >
                        {isSubmitting ? "Adding..." : "Add Item to Menu"}
                    </Button>
                    <Button
                        onClick={resetForm}
                        variant="outline"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ChefHat className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold">Kitchen View</h2>
                    <Badge variant="secondary">{activeOrders.length} Active Orders</Badge>
                </div>
                <Button
                    onClick={() => setIsAddingItem(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                    <Plus className="w-4 h-4" />
                    Add Food Item
                </Button>
            </div>

            {isAddingItem && <AddItemForm />}

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
                    <AdminMenuGrid/>
                </div>
            )}
        </div>
    )
}
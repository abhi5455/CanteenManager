"use client"

import {useEffect, useState} from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, User, GraduationCap, Clock, Receipt } from "lucide-react"
import type { Order } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import axios from "axios";
import {BASE_URL} from "@/apiurl";

interface OrderTableProps {
    orders: Order[]
    onUpdateStatus: (orderId: number, newStatus: Order["status"]) => void
}

export default function OrderTable({ orders, onUpdateStatus }: OrderTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [fetchedOrders, setFetchedOrders] = useState<Order[]>([])

    useEffect(() => {
        axios.get(`${BASE_URL}/api/admin/orders`)
            .then((res=>{
                setFetchedOrders(res.data)
            }))
    }, []);

    const filteredOrders = fetchedOrders.filter((order) => {
        const matchesSearch =
            order.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.studentClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || order.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const statusOptions = [
        { value: "all", label: "All Orders" },
        { value: "pending", label: "Pending" },
        { value: "preparing", label: "Preparing" },
        { value: "ready", label: "Ready" },
        { value: "completed", label: "Completed" },
    ]

    const handleFoodReceived = (orderId: number) => {
        console.log(`Food received button clicked for order ID: ${orderId}`)
        // Add your logic here to handle the food received action
        // For example, you could update the order status or make an API call
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Order Management
                </CardTitle>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search by student name, class, or order number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order #</TableHead>
                                <TableHead>Student Details</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Time Slot</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Payment Status</TableHead>
                                <TableHead>Food Received</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <div className="font-mono text-sm">{order.orderNumber}</div>
                                        <div className="text-xs text-gray-500">{new Date(order.timestamp).toLocaleTimeString()}</div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-600" />
                                                <span className="font-medium text-lg">{order.studentName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-green-600" />
                                                <Badge variant="outline" className="text-sm">
                                                    {order.studentClass}
                                                </Badge>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-1">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="text-sm">
                                                    <span className="font-medium">{item.name}</span>
                                                    <span className="text-gray-500 ml-2">×{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-orange-600" />
                                            <span className="font-medium">{order.timeSlot}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <span className="font-bold text-lg text-green-600">{formatCurrency(order.total)}</span>
                                    </TableCell>

                                    <TableCell>
                                        <Select
                                            defaultValue="pending"
                                            onValueChange={(value) => console.log(`Payment status changed to ${value} for order ${order.id}`)}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="paid">Amount Paid</SelectItem>
                                                <SelectItem value="pending">Amount Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>

                                    <TableCell>
                                        <button
                                            onClick={() => handleFoodReceived(order.id)}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                        >
                                            Food Received
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No orders found matching your criteria.</div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

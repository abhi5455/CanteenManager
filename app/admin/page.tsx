"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, Clock, ChefHat, ArrowLeft } from "lucide-react"
import Link from "next/link"
import StatsDashboard from "./components/StatsDashboard"
import TimeSlotAnalysis from "./components/TimeSlotAnalysis"
import OrderTable from "./components/OrderTable"
import KitchenView from "./components/KitchenView"
import type { Order } from "@/lib/types"
import canteenData from "@/lib/data.json"

export default function AdminPage() {
    const [orders, setOrders] = useState<Order[]>(canteenData.orders)
    const [currentTime, setCurrentTime] = useState(new Date())

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)

        return () => clearInterval(timer)
    }, [])

    const handleUpdateStatus = (orderId: number, newStatus: Order["status"]) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto p-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Chandrettan! 👋</h1>
                            <p className="text-gray-600 mt-1">St. Xavier's Canteen Management Dashboard</p>
                        </div>
                        <Link href="/student">
                            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                                <ArrowLeft className="w-4 h-4" />
                                Student View
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
              </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{orders.length} Total Orders</span>
                        </div>
                    </div>
                </div>

                {/* Stats Dashboard */}
                <div className="mb-8">
                    <StatsDashboard stats={canteenData.systemStats} />
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="orders" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="orders" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Orders
                        </TabsTrigger>
                        <TabsTrigger value="kitchen" className="flex items-center gap-2">
                            <ChefHat className="w-4 h-4" />
                            Kitchen
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders">
                        <OrderTable orders={orders} onUpdateStatus={handleUpdateStatus} />
                    </TabsContent>

                    <TabsContent value="kitchen">
                        <KitchenView orders={orders} onUpdateStatus={handleUpdateStatus} />
                    </TabsContent>

                    <TabsContent value="analytics">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Time Slot Analysis</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <TimeSlotAnalysis timeSlots={canteenData.timeSlots} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>System Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Settings panel coming soon. This will include menu management, time slot configuration, and system
                                    preferences.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

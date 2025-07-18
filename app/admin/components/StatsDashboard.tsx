"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Clock, ChefHat } from "lucide-react"
import type {Order, SystemStats} from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface StatsDashboardProps {
    stats: SystemStats
    fetchedOrders: Order[]
}

export default function StatsDashboard({fetchedOrders, stats }: StatsDashboardProps) {
    const statCards = [
        {
            title: "Total Orders Today",
            value: fetchedOrders.length,
            icon: ChefHat,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Today's Revenue",
            value: fetchedOrders.reduce((total, order) => total + order.total, 0),
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Pending Orders",
            value: fetchedOrders.filter(order => order.status === "pending").length,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Pending Dues",
            value: 0,
            icon: TrendingUp,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

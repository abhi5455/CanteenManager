"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Users } from "lucide-react"
import type { TimeSlot } from "@/lib/types"

interface TimeSlotAnalysisProps {
    timeSlots: TimeSlot[]
}

export default function TimeSlotAnalysis({ timeSlots }: TimeSlotAnalysisProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {timeSlots.map((slot) => {
                const utilizationPercentage = (slot.currentOrders / slot.capacity) * 100
                const remainingCapacity = slot.capacity - slot.currentOrders

                return (
                    <Card key={slot.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                {slot.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Capacity Utilization</span>
                                <span className="font-medium">
                  {slot.currentOrders}/{slot.capacity}
                </span>
                            </div>

                            <Progress value={utilizationPercentage} className="h-3" />

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-green-600" />
                                    <div>
                                        <p className="font-medium text-green-600">{slot.currentOrders}</p>
                                        <p className="text-gray-500">Orders Placed</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-blue-600">{remainingCapacity}</p>
                                        <p className="text-gray-500">Spots Available</p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                        utilizationPercentage < 50
                            ? "bg-green-100 text-green-800"
                            : utilizationPercentage < 80
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                    }`}
                >
                  {utilizationPercentage.toFixed(1)}% Utilized
                </span>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Users } from "lucide-react"
import type { TimeSlot } from "@/lib/types"
import {useEffect, useState} from "react";
import axios from "axios";
import {BASE_URL} from "@/apiurl";

interface TimeSlotSelectorProps {
    // timeSlots: TimeSlot[]
    selectedSlot: string | null
    onSelectSlot: (slot: TimeSlot) => void
    onContinue: () => void
}

export default function TimeSlotSelector({ selectedSlot, onSelectSlot, onContinue }: TimeSlotSelectorProps) {
    const getAvailabilityColor = (current: number, capacity: number) => {
        const percentage = (current / capacity) * 100
        if (percentage < 50) return "text-green-600"
        if (percentage < 80) return "text-yellow-600"
        return "text-red-600"
    }

    const getAvailabilityText = (current: number, capacity: number) => {
        const percentage = (current / capacity) * 100
        if (percentage < 50) return "Available"
        if (percentage < 80) return "Filling Up"
        return "Almost Full"
    }

    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

    useEffect(() => {
        axios.get(`${BASE_URL}/api/menu/timeslots`)
            .then(res => {
                console.log(res.data)
                setTimeSlots(res.data)
            })
            .catch(error => {
                console.error("Error fetching time slots:", error)
            })
    }, []);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Time Slot</h2>
                <p className="text-gray-600">Choose your preferred meal time</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {timeSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.id
                    const availabilityColor = getAvailabilityColor(slot.currentOrders, slot.capacity)
                    const availabilityText = getAvailabilityText(slot.currentOrders, slot.capacity)

                    return (
                        <Card
                            key={slot.id}
                            className={`cursor-pointer transition-all ${
                                isSelected ? "ring-2 ring-orange-500 bg-orange-50" : "hover:shadow-md"
                            }`}
                            onClick={() => onSelectSlot(slot)}
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-orange-600" />
                                        {slot.label}
                                    </div>
                                    {isSelected && <div className="w-3 h-3 bg-orange-500 rounded-full" />}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Capacity</span>
                                        <span className={availabilityColor}>
                      {slot.currentOrders}/{slot.capacity}
                    </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-orange-500 h-2 rounded-full transition-all"
                                            style={{ width: `${(slot.currentOrders / slot.capacity) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${availabilityColor}`}>{availabilityText}</span>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Users className="w-4 h-4" />
                                            {slot.capacity - slot.currentOrders} spots left
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {selectedSlot && (
                <div className="flex justify-center">
                    <Button onClick={onContinue} className="bg-orange-600 hover:bg-orange-700 px-8">
                        Continue to Menu
                    </Button>
                </div>
            )}
        </div>
    )
}

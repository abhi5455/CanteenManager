"use client"

import { useState } from "react"
import StudentForm from "./components/StudentForm"
import TimeSlotSelector from "./components/TimeSlotSelector"
import MenuGrid from "./components/MenuGrid"
import ShoppingCart from "./components/ShoppingCart"
import OrderConfirmation from "./components/OrderConfirmation"
import type { Student, MenuItem, OrderItem, Order } from "@/lib/types"
import { generateOrderNumber } from "@/lib/utils"
import canteenData from "@/lib/data.json"

type Step = "student-info" | "time-slot" | "menu" | "confirmation"

export default function StudentPage() {
    const [currentStep, setCurrentStep] = useState<Step>("student-info")
    const [student, setStudent] = useState<Student | null>(null)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
    const [cart, setCart] = useState<OrderItem[]>([])
    const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)

    const handleStudentSubmit = (studentData: Student) => {
        setStudent(studentData)
        setCurrentStep("time-slot")
    }

    const handleTimeSlotSelect = (slotId: string) => {
        setSelectedTimeSlot(slotId)
    }

    const handleTimeSlotContinue = () => {
        setCurrentStep("menu")
    }

    const handleAddToCart = (item: MenuItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.name === item.name)
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.name === item.name ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
                )
            } else {
                return [...prevCart, { name: item.name, price: item.price, quantity: 1 }]
            }
        })
    }

    const handleRemoveFromCart = (itemName: string) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.name === itemName)
            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map((cartItem) =>
                    cartItem.name === itemName ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
                )
            } else {
                return prevCart.filter((cartItem) => cartItem.name !== itemName)
            }
        })
    }

    const handleUpdateQuantity = (itemName: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveItem(itemName)
        } else {
            setCart((prevCart) =>
                prevCart.map((cartItem) => (cartItem.name === itemName ? { ...cartItem, quantity: newQuantity } : cartItem)),
            )
        }
    }

    const handleRemoveItem = (itemName: string) => {
        setCart((prevCart) => prevCart.filter((cartItem) => cartItem.name !== itemName))
    }

    const handlePlaceOrder = async () => {
        if (!student || !selectedTimeSlot || cart.length === 0) return

        setIsPlacingOrder(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const selectedSlot = canteenData.timeSlots.find((slot) => slot.id === selectedTimeSlot)
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

        const order: Order = {
            id: Date.now(),
            studentName: student.name,
            studentClass: student.class,
            items: cart,
            total,
            timeSlot: selectedSlot?.time || "",
            status: "pending",
            timestamp: new Date().toISOString(),
            orderNumber: generateOrderNumber(),
        }

        setConfirmedOrder(order)
        setCurrentStep("confirmation")
        setIsPlacingOrder(false)
    }

    const handleNewOrder = () => {
        setCurrentStep("student-info")
        setStudent(null)
        setSelectedTimeSlot(null)
        setCart([])
        setConfirmedOrder(null)
    }

    const getSelectedTimeSlotLabel = () => {
        const slot = canteenData.timeSlots.find((slot) => slot.id === selectedTimeSlot)
        return slot?.time || ""
    }

    if (currentStep === "student-info") {
        return <StudentForm onSubmit={handleStudentSubmit} />
    }

    if (currentStep === "time-slot") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
                <div className="max-w-4xl mx-auto py-8">
                    <TimeSlotSelector
                        // timeSlots={canteenData.timeSlots}
                        selectedSlot={selectedTimeSlot}
                        onSelectSlot={handleTimeSlotSelect}
                        onContinue={handleTimeSlotContinue}
                    />
                </div>
            </div>
        )
    }

    if (currentStep === "menu") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
                <div className="max-w-7xl mx-auto p-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <MenuGrid
                                // menu={canteenData.menu}
                                cart={cart}
                                onAddToCart={handleAddToCart}
                                onRemoveFromCart={handleRemoveFromCart}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <ShoppingCart
                                cart={cart}
                                student={student!}
                                timeSlot={getSelectedTimeSlotLabel()}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemoveItem={handleRemoveItem}
                                onPlaceOrder={handlePlaceOrder}
                                isPlacingOrder={isPlacingOrder}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (currentStep === "confirmation" && confirmedOrder) {
        return <OrderConfirmation order={confirmedOrder} onNewOrder={handleNewOrder} />
    }

    return null
}

"use client"

import { useState } from "react"
import StudentForm from "./components/StudentForm"
import TimeSlotSelector from "./components/TimeSlotSelector"
import MenuGrid from "./components/MenuGrid"
import ShoppingCart from "./components/ShoppingCart"
import OrderConfirmation from "./components/OrderConfirmation"
import type {Student, MenuItem, OrderItem, Order, TimeSlot} from "@/lib/types"
import { generateOrderNumber } from "@/lib/utils"
import canteenData from "@/lib/data.json"
import axios from "axios";
import {BASE_URL} from "@/apiurl";

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

    const handleTimeSlotSelect = (slot: TimeSlot) => {
        console.log("Selected Slot ID:", slot)
        localStorage.setItem("selectedTimeSlot", JSON.stringify(slot))

        setSelectedTimeSlot(slot.id)
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

        let selectedSlot = canteenData.timeSlots.find((slot) => slot.id === selectedTimeSlot)
        selectedSlot = JSON.parse(localStorage.getItem("selectedTimeSlot") || "{}")
        const orderingStudent: Student = JSON.parse(localStorage.getItem("student") || "{}")
        console.log("Selected student:", orderingStudent)
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

        const order = {
            id: Date.now(),
            admissionNumber: orderingStudent.admissionNumber,
            name: orderingStudent.name,
            class: orderingStudent.class,
            items: cart,
            total,
            timeSlot: selectedSlot?.id || "",
            status: "pending",
            timestamp: new Date().toISOString(),
            orderNumber: generateOrderNumber(),
        }

        console.log("Placing order:", order)
        let orderNumber = ''
        axios.post(`${BASE_URL}/api/student/order`, order)
            .then(response => {
                console.log("Order placed successfully:", response.data)
                orderNumber = response.data.orderNumber
            })
            .catch(error => {
                console.error("Error placing order:", error)
            })

        const confirmedOrder: Order = {
            id: Date.now(),
            studentAdmissionNumber: orderingStudent.admissionNumber,
            studentName: orderingStudent.name,
            studentClass: orderingStudent.class,
            items: cart,
            total,
            timeSlot: selectedSlot?.id || "",
            status: "pending",
            timestamp: new Date().toISOString(),
            orderNumber: orderNumber,
        }

        setConfirmedOrder(confirmedOrder)
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
        let slot = canteenData.timeSlots.find((slot) => slot.id === selectedTimeSlot)
        slot = JSON.parse(localStorage.getItem("selectedTimeSlot") || "{}")
        // console.log("Selected Slot:", slot)
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

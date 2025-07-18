"use client"

import {useEffect, useState} from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus } from "lucide-react"
import type { MenuItem, OrderItem } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import axios from "axios";
import {BASE_URL} from "@/apiurl";

interface MenuGridProps {
    // menu: MenuItem[]
    cart: OrderItem[]
    onAddToCart: (item: MenuItem) => void
    onRemoveFromCart: (itemName: string) => void
}

export default function AdminMenuGrid() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    const categories = [
        { id: "all", label: "All Items" },
        { id: "main", label: "Main Course" },
        { id: "snack", label: "Snacks" },
        { id: "beverage", label: "Beverages" },
    ]

    const [menu, setMenu] = useState<MenuItem[]>([])

    useEffect(() => {
        axios.get(`${BASE_URL}/api/menu`)
            .then(res => {
                console.log(res.data)
                setMenu(res.data)

            })
            .catch(error => {
                console.error("Error fetching categories:", error)
            })
    }, []);

    const filteredMenu = selectedCategory === "all" ? menu : menu.filter((item) => item.category === selectedCategory)

    const getItemQuantity = (itemName: string) => {
        // const cartItem = cart.find((item) => item.name === itemName)
        // return cartItem ? cartItem.quantity : 0
    }

    return (
        <div className="space-y-6">

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category.id)}
                        className={selectedCategory === category.id ? "bg-orange-600 hover:bg-orange-700" : ""}
                    >
                        {category.label}
                    </Button>
                ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenu.map((item) => {
                    const quantity = getItemQuantity(item.name)

                    return (
                        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48 px-4 rounded-lg">
                                <Image
                                    src={'/img2.webp' || "/placeholder.svg?height=200&width=300"}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                                {!item.available && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <Badge variant="destructive">Out of Stock</Badge>
                                    </div>
                                )}
                            </div>

                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{item.name}</CardTitle>
                                    <Badge variant="secondary" className="capitalize">
                                        {item.category}
                                    </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{item.description}</p>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-orange-600">{formatCurrency(item.price)}</span>

                                    {item.available ? (
                                        <Button size="sm" disabled className={'bg-green-400'}>
                                            Available
                                        </Button>
                                    ) : (
                                        <Button size="sm" disabled>
                                            Unavailable
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

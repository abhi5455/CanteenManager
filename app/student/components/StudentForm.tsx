"use client"

import type React from "react"

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, GraduationCap } from "lucide-react"
import type { Student } from "@/lib/types"
import { classOptions } from "@/lib/utils"
import axios from "axios";
import {BASE_URL} from "@/apiurl";

interface StudentFormProps {
    onSubmit: (student: Student) => void
}

export default function StudentForm({ onSubmit }: StudentFormProps) {
    const [name, setName] = useState("")
    const [admissionNumber, setAdmissionNumber] = useState("")
    const [selectedClass, setSelectedClass] = useState("")
    const [errors, setErrors] = useState<{ name?: string; class?: string }>({})

    useEffect(() => {
        axios.get(`${BASE_URL}/api/menu/timeslots`)
            .then((response) => {
                console.log("Time slots fetched successfully:", response.data)
        })
    }, []);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: { name?: string; class?: string } = {}

        if (!name.trim() || name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters long"
        }

        if (!selectedClass) {
            newErrors.class = "Please select your class"
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            onSubmit({ name: name.trim(), class: selectedClass })
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-orange-600">Welcome to St. Xavier's Canteen</CardTitle>
                    <CardDescription>Please enter your details to start ordering</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <User className="w-4 h-4"/>
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <User className="w-4 h-4"/>
                                Admission Number
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your admission number"
                                value={admissionNumber}
                                onChange={(e) => setAdmissionNumber(e.target.value)}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="class" className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4"/>
                                Class/Department
                            </Label>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger className={errors.class ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select your class"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {classOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.class && <p className="text-sm text-red-500">{errors.class}</p>}
                        </div>

                        <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                            Continue to Menu
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

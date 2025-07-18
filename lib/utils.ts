import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const classOptions = [
  "CS 1st Year",
  "CS 2nd Year",
  "CS 3rd Year",
  "CS 4th Year",
  "ME 1st Year",
  "ME 2nd Year",
  "ME 3rd Year",
  "ME 4th Year",
  "EC 1st Year",
  "EC 2nd Year",
  "EC 3rd Year",
  "EC 4th Year",
  "EEE 1st Year",
  "EEE 2nd Year",
  "EEE 3rd Year",
  "EEE 4th Year",
]

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  return `ORD${timestamp}`
}

export function formatCurrency(amount: number): string {
  return `₹${amount}`
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "preparing":
      return "bg-blue-100 text-blue-800"
    case "ready":
      return "bg-green-100 text-green-800"
    case "completed":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

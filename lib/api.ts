// lib/api.ts
import { toast } from "@/components/ui/use-toast"

// --- Mock Data & API Simulation ---

// Mock Alerts Data
const mockAlerts = [
  {
    id: "alert-1",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
    type: "High Usage",
    confidence: "High",
    description: "AC Unit consuming 3.5kW - 50% above normal.",
    image_url: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "alert-2",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    type: "Device Offline",
    confidence: "Critical",
    description: "Smart TV has been offline for 15 minutes.",
    image_url: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "alert-3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    type: "Unusual Pattern",
    confidence: "Medium",
    description: "Unusual power consumption pattern detected in kitchen.",
    image_url: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "alert-4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    type: "Cost Threshold Exceeded",
    confidence: "High",
    description: "Monthly electricity cost exceeded $400 threshold.",
    image_url: "/placeholder.svg?height=100&width=150",
  },
]

// Mock Events Log Data
const mockEvents = [
  { id: "event-1", timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(), type: "Device ON", device: "Living Room Lights", user: "John Doe" },
  { id: "event-2", timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), type: "Alert Triggered", device: "AC Unit", user: "System" },
  { id: "event-3", timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), type: "Device OFF", device: "Smart TV", user: "John Doe" },
  { id: "event-4", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), type: "User Login", device: "Dashboard", user: "John Doe" },
  { id: "event-5", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), type: "Device ON", device: "Water Heater", user: "System" },
  { id: "event-6", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), type: "Alert Resolved", device: "Smart TV", user: "Admin" },
  { id: "event-7", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), type: "Device Added", device: "Bedroom Fan", user: "Admin" },
  { id: "event-8", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), type: "Device OFF", device: "Kitchen Lights", user: "John Doe" },
  { id: "event-9", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), type: "User Logout", device: "Dashboard", user: "John Doe" },
  { id: "event-10", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), type: "System Update", device: "Backend", user: "System" },
]

// Mock Stats Data
const mockStats = {
  totalAlertsToday: 3,
  authorizedUsersCount: 5,
  lastIntrusionDetected: "None (2 days ago)", // Placeholder for surveillance context
}

// --- API Functions ---

/**
 * Fetches latest alerts from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of alerts.
 */
export async function fetchAlerts() {
  console.log("Fetching alerts from /api/alerts...")
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay
  return mockAlerts.map(alert => ({
    ...alert,
    timestamp: new Date(alert.timestamp).toLocaleString(), // Format timestamp for display
  }))
}

/**
 * Uploads an authorized person's data to the backend.
 * @param {string} name - The name of the authorized person.
 * @param {File} imageFile - The image file of the authorized person.
 * @returns {Promise<{success: boolean, message: string}>} A promise that resolves to a success/error object.
 */
export async function uploadAuthorizedPerson(name: string, imageFile: File) {
  console.log(`Uploading authorized person: ${name}, file: ${imageFile.name}`)
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate network delay

  // Simulate success or failure
  if (Math.random() > 0.2) { // 80% chance of success
    toast({
      title: "Success!",
      description: `${name} has been authorized.`,
      variant: "default",
    })
    return { success: true, message: "Person authorized successfully." }
  } else {
    toast({
      title: "Error!",
      description: `Failed to authorize ${name}. Please try again.`,
      variant: "destructive",
    })
    return { success: false, message: "Failed to authorize person." }
  }
}

/**
 * Fetches all events from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of events.
 */
export async function fetchEventsLog() {
  console.log("Fetching events log from /api/logs...")
  await new Promise((resolve) => setTimeout(resolve, 700)) // Simulate network delay
  return mockEvents.map(event => ({
    ...event,
    timestamp: new Date(event.timestamp).toLocaleString(), // Format timestamp for display
  }))
}

/**
 * Fetches statistics from the backend.
 * @returns {Promise<Object>} A promise that resolves to an object with statistics.
 */
export async function fetchStats() {
  console.log("Fetching stats from /api/stats...")
  await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay
  return mockStats
}

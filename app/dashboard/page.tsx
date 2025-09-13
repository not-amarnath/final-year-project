"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Zap, TrendingUp, TrendingDown, Power, Lightbulb, Tv, Wind, Thermometer, Wifi, WifiOff, AlertTriangle, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useEffect, useState } from "react"
import { fetchAlerts, fetchStats } from "@/lib/api" // Import API functions

// Mock data for charts (keeping these local as they are for display, not direct API fetch)
const hourlyData = [
  { time: "00:00", consumption: 10.2 },
  { time: "04:00", consumption: 1.8 },
  { time: "08:00", consumption: 3.2 },
  { time: "12:00", consumption: 4.5 },
  { time: "16:00", consumption: 3.8 },
  { time: "20:00", consumption: 5.2 },
  { time: "24:00", consumption: 2.8 },
]

const deviceData = [
  { name: "AC Unit", consumption: 2.8 },
  { name: "Refrigerator", consumption: 1.2 },
  { name: "TV", consumption: 0.8 },
  { name: "Lights", consumption: 0.6 },
  { name: "Others", consumption: 1.1 },
]

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAlertsToday: 0,
    authorizedUsersCount: 0,
    lastIntrusionDetected: "N/A",
  })
  const [liveAlerts, setLiveAlerts] = useState<any[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingAlerts, setLoadingAlerts] = useState(true)

  // Fetch Stats on component mount
  useEffect(() => {
    const getStats = async () => {
      setLoadingStats(true)
      try {
        const data = await fetchStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoadingStats(false)
      }
    }
    getStats()
  }, [])

  // Fetch Live Alerts with polling
  useEffect(() => {
    const getLiveAlerts = async () => {
      setLoadingAlerts(true)
      try {
        const data = await fetchAlerts()
        setLiveAlerts(data.slice(0, 3)) // Show only latest 3 alerts for live feed
      } catch (error) {
        console.error("Failed to fetch live alerts:", error)
      } finally {
        setLoadingAlerts(false)
      }
    }

    getLiveAlerts() // Initial fetch
    const interval = setInterval(getLiveAlerts, 5000) // Poll every 5 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Energy Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Usage</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2 kW</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -12% from yesterday
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.8 kWh</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% from yesterday
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts Today</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingStats ? "..." : stats.totalAlertsToday}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {loadingStats ? "..." : `${stats.authorizedUsersCount} Authorized Users`}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Intrusion</CardTitle>
              <Power className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loadingStats ? "..." : stats.lastIntrusionDetected}
              </div>
              <p className="text-xs text-muted-foreground">
                {loadingStats ? "..." : "from surveillance system"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Energy Consumption (24h)</CardTitle>
              <CardDescription>Hourly energy usage for the past 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="consumption"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: "#2563eb" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Live Alerts Feed</CardTitle>
              <CardDescription>Real-time alerts from your system (auto-refreshing)</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAlerts ? (
                <div className="text-center text-muted-foreground py-8">Loading alerts...</div>
              ) : liveAlerts.length > 0 ? (
                <div className="space-y-4">
                  {liveAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.title || alert.type}</p>
                        <p className="text-xs text-muted-foreground">{alert.description}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{alert.timestamp}</span>
                          <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-xs">
                            {alert.confidence}
                          </Badge>
                        </div>
                        {alert.image_url && (
                          <img
                            src={alert.image_url || "/placeholder.svg"}
                            alt="Alert image"
                            className="mt-2 rounded-md object-cover h-20 w-30"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">No recent alerts.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Device Control */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <CardTitle className="text-sm font-medium">Living Room Lights</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">0.6 kW</div>
                  <p className="text-xs text-muted-foreground">Current usage</p>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  ON
                </Button>
              </div>
              <Progress value={30} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Wind className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-sm font-medium">AC Unit</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">2.8 kW</div>
                  <p className="text-xs text-muted-foreground">Current usage</p>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  ON
                </Button>
              </div>
              <Progress value={85} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Tv className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-sm font-medium">Smart TV</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">0.0 kW</div>
                  <p className="text-xs text-muted-foreground">Current usage</p>
                </div>
                <Button size="sm" variant="outline" disabled>
                  OFF
                </Button>
              </div>
              <Progress value={0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-sm font-medium">Water Heater</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">1.5 kW</div>
                  <p className="text-xs text-muted-foreground">Current usage</p>
                </div>
                <Button size="sm" variant="outline">
                  OFF
                </Button>
              </div>
              <Progress value={45} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity (Keeping original for now, full alerts moved to Alerts page) */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest device status changes and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">AC Unit turned ON</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
                <Badge variant="secondary">Auto</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">High energy usage detected</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
                <Badge variant="outline">Alert</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Smart TV went offline</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <Badge variant="destructive">Offline</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Living Room Lights dimmed to 30%</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Badge variant="secondary">Manual</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}

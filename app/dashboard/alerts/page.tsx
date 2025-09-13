"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AlertTriangle, Bell, BellOff, Zap, TrendingUp, Settings, Check, X, Clock } from 'lucide-react'
import { useEffect, useState } from "react"
import { fetchAlerts } from "@/lib/api" // Import API function

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getAlerts = async () => {
      setLoading(true)
      try {
        const data = await fetchAlerts()
        setAlerts(data)
      } catch (error) {
        console.error("Failed to fetch alerts:", error)
      } finally {
        setLoading(false)
      }
    }
    getAlerts()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
      case "Critical":
        return "bg-red-100 text-red-800"
      case "warning":
      case "High":
        return "bg-yellow-100 text-yellow-800"
      case "info":
      case "Medium":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
      case "Critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
      case "High":
        return <TrendingUp className="h-4 w-4 text-yellow-600" />
      case "info":
      case "Medium":
        return <Zap className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  // Mock alert settings (keeping these local for now)
  const alertSettings = [
    {
      id: 1,
      name: "High Usage Alerts",
      description: "Get notified when device usage exceeds normal levels",
      enabled: true,
      threshold: "30% above average",
    },
    {
      id: 2,
      name: "Device Offline Alerts",
      description: "Alert when devices go offline unexpectedly",
      enabled: true,
      threshold: "After 30 minutes",
    },
    {
      id: 3,
      name: "Cost Threshold Alerts",
      description: "Notify when monthly costs exceed set limits",
      enabled: true,
      threshold: "$400 per month",
    },
    {
      id: 4,
      name: "Peak Usage Alerts",
      description: "Alert during high consumption periods",
      enabled: false,
      threshold: "Above 5kW total",
    },
    {
      id: 5,
      name: "Energy Saving Tips",
      description: "Receive personalized energy saving recommendations",
      enabled: true,
      threshold: "Weekly digest",
    },
  ]

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
                <BreadcrumbPage>Alerts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Alert Settings
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Alert Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {loading ? "..." : alerts.filter(a => !a.resolved).length}
              </div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {loading ? "..." : alerts.filter(a => a.resolved).length}
              </div>
              <p className="text-xs text-muted-foreground">Issues fixed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {loading ? "..." : alerts.filter(a => a.confidence === "Critical" && !a.resolved).length}
              </div>
              <p className="text-xs text-muted-foreground">Critical issues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : alerts.length}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>All Alerts</CardTitle>
            <CardDescription>Comprehensive list of all system alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-muted-foreground py-8">Loading alerts...</div>
            ) : alerts.length > 0 ? (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start space-x-4 p-4 rounded-lg border ${alert.resolved ? "bg-gray-50" : "bg-white"}`}
                  >
                    <div className="flex-shrink-0">{getSeverityIcon(alert.confidence)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-medium ${alert.resolved ? "text-gray-600" : "text-gray-900"}`}>
                          {alert.title || alert.type}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className={getSeverityColor(alert.confidence)}>
                            {alert.confidence}
                          </Badge>
                          {alert.resolved && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${alert.resolved ? "text-gray-500" : "text-gray-600"}`}>
                        {alert.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{alert.device}</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>
                        {!alert.resolved && (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Check className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                            <Button size="sm" variant="ghost">
                              <X className="h-3 w-3 mr-1" />
                              Dismiss
                            </Button>
                          </div>
                        )}
                      </div>
                      {alert.image_url && (
                        <img
                          src={alert.image_url || "/placeholder.svg"}
                          alt="Alert image"
                          className="mt-2 rounded-md object-cover h-24 w-36"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">No alerts found.</div>
            )}
          </CardContent>
        </Card>

        {/* Alert Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Settings</CardTitle>
            <CardDescription>Configure when and how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {alertSettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium">{setting.name}</h3>
                      {setting.enabled ? (
                        <Bell className="h-4 w-4 text-blue-600" />
                      ) : (
                        <BellOff className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Threshold: {setting.threshold}</p>
                  </div>
                  <Switch checked={setting.enabled} onCheckedChange={() => {}} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Notification Methods</CardTitle>
              <CardDescription>Choose how you want to receive alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Email Notifications</h3>
                    <p className="text-xs text-gray-600">Receive alerts via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Push Notifications</h3>
                    <p className="text-xs text-gray-600">Browser push notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">SMS Alerts</h3>
                    <p className="text-xs text-gray-600">Critical alerts via SMS</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Frequency</CardTitle>
              <CardDescription>Control how often you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Immediate Alerts</h3>
                    <p className="text-xs text-gray-600">Critical issues only</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Daily Summary</h3>
                    <p className="text-xs text-gray-600">Daily digest at 8:00 AM</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Weekly Report</h3>
                    <p className="text-xs text-gray-600">Weekly summary on Sundays</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}

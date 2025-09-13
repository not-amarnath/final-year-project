"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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
import { Lightbulb, Tv, Wind, Thermometer, Wifi, WifiOff, Settings, Plus, Trash2, Edit } from "lucide-react"
import { useState } from "react"

const devices = [
  {
    id: 1,
    name: "Living Room Lights",
    type: "Lighting",
    icon: Lightbulb,
    status: "online",
    power: 0.6,
    isOn: true,
    location: "Living Room",
    lastSeen: "Just now",
  },
  {
    id: 2,
    name: "AC Unit",
    type: "Climate",
    icon: Wind,
    status: "online",
    power: 2.8,
    isOn: true,
    location: "Bedroom",
    lastSeen: "Just now",
  },
  {
    id: 3,
    name: "Smart TV",
    type: "Entertainment",
    icon: Tv,
    status: "offline",
    power: 0.0,
    isOn: false,
    location: "Living Room",
    lastSeen: "1 hour ago",
  },
  {
    id: 4,
    name: "Water Heater",
    type: "Appliance",
    icon: Thermometer,
    status: "online",
    power: 1.5,
    isOn: false,
    location: "Utility Room",
    lastSeen: "Just now",
  },
  {
    id: 5,
    name: "Kitchen Lights",
    type: "Lighting",
    icon: Lightbulb,
    status: "online",
    power: 0.4,
    isOn: true,
    location: "Kitchen",
    lastSeen: "Just now",
  },
  {
    id: 6,
    name: "Bedroom Fan",
    type: "Climate",
    icon: Wind,
    status: "online",
    power: 0.3,
    isOn: false,
    location: "Bedroom",
    lastSeen: "Just now",
  },
]

export default function DevicesPage() {
  const [deviceStates, setDeviceStates] = useState(
    devices.reduce(
      (acc, device) => ({
        ...acc,
        [device.id]: device.isOn,
      }),
      {},
    ),
  )

  const toggleDevice = (deviceId: number) => {
    setDeviceStates((prev) => ({
      ...prev,
      [deviceId]: !prev[deviceId],
    }))
  }

  const getStatusColor = (status: string) => {
    return status === "online" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getStatusIcon = (status: string) => {
    return status === "online" ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />
  }

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
                <BreadcrumbPage>Devices</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Device Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Registered devices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Online</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">5</div>
              <p className="text-xs text-muted-foreground">Connected devices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Power</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.6 kW</div>
              <p className="text-xs text-muted-foreground">Current consumption</p>
            </CardContent>
          </Card>
        </div>

        {/* Device Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => {
            const IconComponent = device.icon
            const isOn = deviceStates[device.id]

            return (
              <Card key={device.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`h-5 w-5 ${isOn ? "text-blue-600" : "text-gray-400"}`} />
                      <CardTitle className="text-base">{device.name}</CardTitle>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(device.status)}>
                      {getStatusIcon(device.status)}
                      {device.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {device.type} • {device.location}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold">{device.power} kW</div>
                      <p className="text-xs text-muted-foreground">Current usage</p>
                    </div>
                    <Switch
                      checked={isOn}
                      onCheckedChange={() => toggleDevice(device.id)}
                      disabled={device.status === "offline"}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last seen: {device.lastSeen}</span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Device Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Device Categories</CardTitle>
            <CardDescription>Devices organized by type and location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="font-medium">Lighting</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Living Room Lights</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ON
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Kitchen Lights</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ON
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Climate</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>AC Unit</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ON
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Bedroom Fan</span>
                    <Badge variant="outline">OFF</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Appliances</h3>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Smart TV</span>
                    <Badge variant="destructive">OFFLINE</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Water Heater</span>
                    <Badge variant="outline">OFF</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}

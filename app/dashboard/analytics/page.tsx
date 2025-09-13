"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { TrendingUp, TrendingDown, Calendar, Download, DollarSign, Zap } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

// Mock data for different time periods
const dailyData = [
  { date: "Mon", consumption: 24.5, cost: 12.25 },
  { date: "Tue", consumption: 28.2, cost: 14.1 },
  { date: "Wed", consumption: 22.8, cost: 11.4 },
  { date: "Thu", consumption: 26.1, cost: 13.05 },
  { date: "Fri", consumption: 29.4, cost: 14.7 },
  { date: "Sat", consumption: 31.2, cost: 15.6 },
  { date: "Sun", consumption: 27.8, cost: 13.9 },
]

const monthlyData = [
  { month: "Jan", consumption: 780, cost: 390 },
  { month: "Feb", consumption: 720, cost: 360 },
  { month: "Mar", consumption: 850, cost: 425 },
  { month: "Apr", consumption: 690, cost: 345 },
  { month: "May", consumption: 920, cost: 460 },
  { month: "Jun", consumption: 1100, cost: 550 },
  { month: "Jul", consumption: 1250, cost: 625 },
  { month: "Aug", consumption: 1180, cost: 590 },
  { month: "Sep", consumption: 980, cost: 490 },
  { month: "Oct", consumption: 820, cost: 410 },
  { month: "Nov", consumption: 750, cost: 375 },
  { month: "Dec", consumption: 800, cost: 400 },
]

const deviceBreakdown = [
  { name: "AC Unit", value: 35, color: "#2563eb" },
  { name: "Water Heater", value: 20, color: "#dc2626" },
  { name: "Lighting", value: 15, color: "#eab308" },
  { name: "TV & Electronics", value: 12, color: "#7c3aed" },
  { name: "Refrigerator", value: 10, color: "#059669" },
  { name: "Others", value: 8, color: "#6b7280" },
]

const hourlyPattern = [
  { hour: "00", consumption: 2.1 },
  { hour: "01", consumption: 1.8 },
  { hour: "02", consumption: 1.6 },
  { hour: "03", consumption: 1.5 },
  { hour: "04", consumption: 1.4 },
  { hour: "05", consumption: 1.6 },
  { hour: "06", consumption: 2.2 },
  { hour: "07", consumption: 3.1 },
  { hour: "08", consumption: 3.8 },
  { hour: "09", consumption: 3.2 },
  { hour: "10", consumption: 2.9 },
  { hour: "11", consumption: 3.4 },
  { hour: "12", consumption: 4.2 },
  { hour: "13", consumption: 4.5 },
  { hour: "14", consumption: 4.1 },
  { hour: "15", consumption: 3.9 },
  { hour: "16", consumption: 3.7 },
  { hour: "17", consumption: 4.3 },
  { hour: "18", consumption: 5.1 },
  { hour: "19", consumption: 5.8 },
  { hour: "20", consumption: 5.2 },
  { hour: "21", consumption: 4.6 },
  { hour: "22", consumption: 3.8 },
  { hour: "23", consumption: 2.9 },
]

export default function AnalyticsPage() {
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
                <BreadcrumbPage>Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">847 kWh</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -8% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$423.50</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -8% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Daily Usage</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">27.3 kWh</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7:00 PM</div>
              <p className="text-xs text-muted-foreground">5.8 kWh average</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="consumption" className="space-y-4">
          <TabsList>
            <TabsTrigger value="consumption">Consumption</TabsTrigger>
            <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
            <TabsTrigger value="devices">Device Breakdown</TabsTrigger>
            <TabsTrigger value="patterns">Usage Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="consumption" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Consumption</CardTitle>
                  <CardDescription>Daily energy usage for the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="consumption" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trend</CardTitle>
                  <CardDescription>Energy consumption over the past 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="consumption" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cost" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Cost</CardTitle>
                  <CardDescription>Daily electricity costs for the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="cost" stroke="#dc2626" strokeWidth={2} dot={{ fill: "#dc2626" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Cost Trend</CardTitle>
                  <CardDescription>Electricity costs over the past 12 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cost" fill="#dc2626" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Detailed analysis of your electricity costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Base Rate</span>
                      <span className="text-sm">$0.12/kWh</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Peak Rate</span>
                      <span className="text-sm">$0.18/kWh</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Off-Peak Rate</span>
                      <span className="text-sm">$0.08/kWh</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Energy Charge</span>
                      <span className="text-sm">$380.25</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Service Fee</span>
                      <span className="text-sm">$25.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Taxes</span>
                      <span className="text-sm">$18.25</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-sm">Total Cost</span>
                      <span className="text-sm">$423.50</span>
                    </div>
                    <div className="flex items-center justify-between text-green-600">
                      <span className="text-sm">Savings</span>
                      <span className="text-sm">-$37.20</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Device Consumption</CardTitle>
                  <CardDescription>Energy usage breakdown by device category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={deviceBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Energy Consumers</CardTitle>
                  <CardDescription>Devices with highest energy consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deviceBreakdown.map((device, index) => (
                      <div key={device.name} className="flex items-center space-x-4">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: device.color }} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{device.name}</span>
                            <span className="text-sm text-muted-foreground">{device.value}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${device.value}%`,
                                backgroundColor: device.color,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>24-Hour Usage Pattern</CardTitle>
                <CardDescription>Average hourly energy consumption pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={hourlyPattern}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="consumption" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Peak Hours</CardTitle>
                  <CardDescription>Highest consumption periods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">7:00 PM - 9:00 PM</span>
                      <Badge variant="destructive">High</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">12:00 PM - 2:00 PM</span>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">8:00 AM - 10:00 AM</span>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Off-Peak Hours</CardTitle>
                  <CardDescription>Lowest consumption periods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">2:00 AM - 6:00 AM</span>
                      <Badge variant="outline">Low</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">10:00 PM - 12:00 AM</span>
                      <Badge variant="outline">Low</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">10:00 AM - 12:00 PM</span>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Energy saving suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>• Run dishwasher during off-peak hours (2-6 AM)</p>
                    <p>• Set AC to eco mode during peak hours</p>
                    <p>• Use timer for water heater (avoid 7-9 PM)</p>
                    <p>• Consider solar panels for daytime usage</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}

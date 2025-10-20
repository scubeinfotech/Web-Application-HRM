'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Briefcase,
  UserPlus,
  FileText,
  Settings,
  Bell,
  Search,
  Menu,
  Home,
  Building,
  Target,
  LogOut,
  ChevronRight
} from 'lucide-react'

export default function HRMDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for demonstration
  const stats = {
    totalEmployees: 24,
    activeProjects: 8,
    pendingTimesheets: 12,
    monthlyPayroll: 125000
  }

  const recentActivities = [
    { id: 1, type: 'employee', message: 'New employee John Doe onboarded', time: '2 hours ago', icon: UserPlus },
    { id: 2, type: 'timesheet', message: 'Timesheet approved for Sarah Chen', time: '3 hours ago', icon: Clock },
    { id: 3, type: 'leave', message: 'Leave request approved for Mike Wong', time: '5 hours ago', icon: Calendar },
    { id: 4, type: 'salary', message: 'Salary slip generated for Tech Solutions Pte Ltd', time: '1 day ago', icon: DollarSign }
  ]

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'employees', label: 'Employee Management', icon: Users },
    { id: 'timesheets', label: 'Time Sheets', icon: Clock },
    { id: 'leaves', label: 'Leave Management', icon: Calendar },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'clients', label: 'Clients', icon: Building },
    { id: 'projects', label: 'Projects', icon: Target },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-lg`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-gray-800">HRM System</h1>
                  <p className="text-xs text-gray-500">Singapore Standards</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className={`w-full justify-start ${!sidebarOpen && 'justify-center'}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {sidebarOpen && <span className="ml-3">{item.label}</span>}
                  </Button>
                )
              })}
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://picsum.photos/seed/admin/40/40.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@hrm.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+2</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeProjects}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-blue-600">+1</span> new this week
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Timesheets</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingTimesheets}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-orange-600">Requires approval</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.monthlyPayroll.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">On track</span>
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks you can perform</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add New Employee
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Clock className="w-4 h-4 mr-2" />
                      Approve Timesheets
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Generate Payroll
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Leave Requests
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Latest updates in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => {
                        const Icon = activity.icon
                        return (
                          <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Icon className="w-4 h-4 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {activity.message}
                              </p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Employee Distribution</CardTitle>
                    <CardDescription>By work pass type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Singaporean</span>
                        </div>
                        <span className="text-sm font-medium">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">PR</span>
                        </div>
                        <span className="text-sm font-medium">6</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">S Pass</span>
                        </div>
                        <span className="text-sm font-medium">4</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">Employment Pass</span>
                        </div>
                        <span className="text-sm font-medium">2</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Status</CardTitle>
                    <CardDescription>Current project overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">In Progress</span>
                        <Badge variant="default">5</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Planning</span>
                        <Badge variant="secondary">2</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completed</span>
                        <Badge variant="outline">1</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== 'overview' && (
            <Card>
              <CardHeader>
                <CardTitle>{menuItems.find(item => item.id === activeTab)?.label}</CardTitle>
                <CardDescription>
                  {menuItems.find(item => item.id === activeTab)?.label} module is under development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {(() => {
                      const Icon = menuItems.find(item => item.id === activeTab)?.icon || Settings
                      return <Icon className="w-8 h-8 text-gray-400" />
                    })()}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-gray-500">
                    This module is currently being developed with all the features you requested.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, FileText, Scissors, TrendingUp, Calendar } from 'lucide-react';
import { userService, leaveService } from '@/services/apiService';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    totalServices: 12, // Mock data since service management is UI-only
    upcomingShifts: 8, // Mock data since shift management is UI-only
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch employees
      const employeesResponse = await userService.getAllEmployees();
      const employees = employeesResponse.employees || [];

      // Fetch leave requests
      const leavesResponse = await leaveService.getAllLeaveRequests();
      const leaves = leavesResponse.leaves || [];
      const pendingLeaves = leaves.filter(leave => leave.status === 'Pending');

      setStats({
        totalEmployees: employees.length,
        pendingLeaves: pendingLeaves.length,
        totalServices: 12, // Mock data
        upcomingShifts: 8, // Mock data
      });

      // Get recent leave requests (last 5)
      setRecentLeaves(leaves.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'bg-blue-500',
      change: '+2 this month',
    },
    {
      title: 'Pending Leaves',
      value: stats.pendingLeaves,
      icon: FileText,
      color: 'bg-orange-500',
      change: 'Needs review',
    },
    {
      title: 'Active Services',
      value: stats.totalServices,
      icon: Scissors,
      color: 'bg-green-500',
      change: '100% operational',
    },
    {
      title: 'Upcoming Shifts',
      value: stats.upcomingShifts,
      icon: Clock,
      color: 'bg-purple-500',
      change: 'Next 7 days',
    },
  ];

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-gray-600">Here's what's happening at your salon today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.color} text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
            <CardDescription>Latest employee leave applications</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLeaves.length > 0 ? (
              <div className="space-y-4">
                {recentLeaves.map((leave) => (
                  <div key={leave._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">Employee ID: {leave.userid}</p>
                      <p className="text-sm text-gray-600">{leave.reason}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusBadge(leave.status)}>
                      {leave.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent leave requests</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Key metrics for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Employee Satisfaction</span>
                <span className="text-sm text-green-600 font-semibold">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Service Completion</span>
                <span className="text-sm text-blue-600 font-semibold">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Revenue Growth</span>
                <span className="text-sm text-purple-600 font-semibold">+15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used management tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium">Add Employee</p>
            </div>
            <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium">Schedule Shift</p>
            </div>
            <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
              <Scissors className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-sm font-medium">Manage Services</p>
            </div>
            <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-sm font-medium">View Reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;
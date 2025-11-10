import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Calendar, IndianRupee, TrendingUp, 
  Clock, AlertTriangle, CheckCircle, XCircle,
  BarChart3, PieChart, Activity, Star
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';

// Chart components (using recharts)
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';

const ManagerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentBookings: [],
    popularServices: [],
    employeePerformance: [],
    upcomingShifts: [],
    revenue: [],
    leaveRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple data sources with individual error handling
      const [
        statsResponse,
        bookingsResponse,
        servicesResponse,
        shiftsResponse,
        revenueResponse,
        leaveResponse
      ] = await Promise.allSettled([
        api.get(`/dashboard/stats?period=${selectedPeriod}`),
        api.get('/bookings?limit=5&sort=createdAt'),
        api.get('/services/popular?limit=5'),
        api.get('/shifts?status=Scheduled&limit=5'),
        api.get(`/dashboard/revenue?period=${selectedPeriod}`),
        api.get('/leave-requests?status=Pending&limit=5')
      ]);

      // Helper function to safely extract data
      const extractData = (response, defaultValue = {}) => {
        return response.status === 'fulfilled' ? response.value.data : defaultValue;
      };

      const extractArray = (response, key, defaultValue = []) => {
        const data = extractData(response, {});
        return Array.isArray(data[key]) ? data[key] : defaultValue;
      };

      setDashboardData({
        stats: extractData(statsResponse, {}),
        recentBookings: extractArray(bookingsResponse, 'bookings'),
        popularServices: extractArray(servicesResponse, 'services'),
        employeePerformance: Array.isArray(extractData(statsResponse, {}).employeePerformance) 
          ? extractData(statsResponse, {}).employeePerformance 
          : [],
        upcomingShifts: extractArray(shiftsResponse, 'shifts'),
        revenue: extractArray(revenueResponse, 'revenue'),
        leaveRequests: extractArray(leaveResponse, 'leaves')
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
      
      // Set default empty data structure
      setDashboardData({
        stats: {},
        recentBookings: [],
        popularServices: [],
        employeePerformance: [],
        upcomingShifts: [],
        revenue: [],
        leaveRequests: []
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Helper function to ensure safe chart data
  const getSafeChartData = (data, defaultValue = []) => {
    return Array.isArray(data) ? data : defaultValue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600">Overview of salon performance and operations</p>
        </div>
        
        <div className="flex gap-2">
          {['week', 'month', 'quarter'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.stats.totalRevenue || 0)}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{dashboardData.stats.revenueGrowth || 0}% from last {selectedPeriod}
                </p>
              </div>
              <IndianRupee className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.totalBookings || 0}
                </p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {dashboardData.stats.bookingsToday || 0} today
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.activeStaff || 0}
                </p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Users className="h-3 w-3 mr-1" />
                  {dashboardData.stats.staffOnDuty || 0} on duty now
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.averageRating || 0}/5
                </p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Star className="h-3 w-3 mr-1" />
                  {dashboardData.stats.totalReviews || 0} reviews
                </p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Revenue performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getSafeChartData(dashboardData.revenue)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Popular Services
            </CardTitle>
            <CardDescription>Most booked services this {selectedPeriod}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={getSafeChartData(dashboardData.popularServices)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="bookings"
                >
                  {getSafeChartData(dashboardData.popularServices).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance & Upcoming Shifts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Employee Performance
            </CardTitle>
            <CardDescription>Top performing employees this {selectedPeriod}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getSafeChartData(dashboardData.employeePerformance).map((employee, index) => (
                <div key={employee._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-600">{employee.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(employee.revenue)}</p>
                    <p className="text-sm text-gray-600">{employee.bookings} bookings</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Shifts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Shifts
            </CardTitle>
            <CardDescription>Staff schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getSafeChartData(dashboardData.upcomingShifts).map((shift) => (
                <div key={shift._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{shift.employee?.name || 'Unassigned'}</p>
                    <p className="text-sm text-gray-600">
                      {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(shift.status)}>
                      {shift.status}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">{shift.shiftType}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest customer appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getSafeChartData(dashboardData.recentBookings).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-sm text-gray-600">{booking.serviceName}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(booking.appointmentDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Pending Leave Requests
            </CardTitle>
            <CardDescription>Requests requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getSafeChartData(dashboardData.leaveRequests).length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>No pending requests</p>
                </div>
              ) : (
                getSafeChartData(dashboardData.leaveRequests).map((request) => (
                  <div key={request._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{request.userid?.name || 'Unknown Employee'}</p>
                      <p className="text-sm text-gray-600">{request.reason || 'No reason provided'}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
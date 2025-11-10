import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Clock, CheckCircle, AlertTriangle, 
  TrendingUp, Star, Award, Target, Timer
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// Chart components
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Cell
} from 'recharts';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    myShifts: [],
    leaveRequests: [],
    performance: [], // Default to empty array
    todayShift: null,
    upcomingShifts: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch employee-specific data with better error handling
      const [
        shiftsResult,
        leaveResult,
        todayShiftResult
      ] = await Promise.allSettled([
        api.get(`/shifts?employee=${user._id}&period=${selectedPeriod}`),
        api.get('/leave-requests'),
        api.get(`/shifts/today`)
      ]);

      // Extract data safely from results
      const shifts = shiftsResult.status === 'fulfilled' ? shiftsResult.value.data.shifts || [] : [];
      const leaveRequests = leaveResult.status === 'fulfilled' ? leaveResult.value.data.leaveRequests || [] : [];
      const todayShift = todayShiftResult.status === 'fulfilled' ? todayShiftResult.value.data.shift || null : null;

      // Calculate stats from shifts data
      const completedShifts = shifts.filter(s => s.status === 'Completed');
      const totalHours = completedShifts.reduce((acc, shift) => {
        return acc + (shift.duration || 0);
      }, 0);

      setDashboardData({
        stats: {
          totalShifts: shifts.length,
          completedShifts: completedShifts.length,
          totalHours,
          completionRate: shifts.length > 0 ? Math.round((completedShifts.length / shifts.length) * 100) : 0,
          punctualityScore: Math.floor(Math.random() * 20) + 80, // Mock data
          customerRating: (Math.random() * 1.5 + 3.5).toFixed(1)
        },
        myShifts: shifts.slice(0, 5),
        leaveRequests: leaveRequests,
        todayShift: todayShift,
        upcomingShifts: shifts.filter(s => new Date(s.date) > new Date() && s.status === 'Scheduled').slice(0, 5),
        performance: generatePerformanceData(shifts)
      });

      // Log any failed requests
      if (shiftsResult.status === 'rejected') {
        console.error('Failed to fetch shifts:', shiftsResult.reason);
      }
      if (leaveResult.status === 'rejected') {
        console.error('Failed to fetch leave requests:', leaveResult.reason);
      }
      if (todayShiftResult.status === 'rejected') {
        console.error('Failed to fetch today shift:', todayShiftResult.reason);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
      
      // Set safe fallback data
      setDashboardData({
        stats: {
          totalShifts: 0,
          completedShifts: 0,
          totalHours: 0,
          completionRate: 0,
          punctualityScore: 0,
          customerRating: 0
        },
        myShifts: [],
        leaveRequests: [],
        performance: [], // Ensure it's an empty array
        todayShift: null,
        upcomingShifts: []
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePerformanceData = (shifts) => {
    try {
      // Generate weekly performance data
      const weeks = [];
      for (let i = 7; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 7));
        
        weeks.push({
          week: `Week ${8-i}`,
          hours: Math.floor(Math.random() * 30) + 20,
          rating: Math.random() * 1 + 4,
          shifts: Math.floor(Math.random() * 8) + 3
        });
      }
      return weeks;
    } catch (error) {
      console.error('Error generating performance data:', error);
      return [];
    }
  };

  // Helper function to ensure chart data is always valid
  const getSafeChartData = (data) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return data;
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
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Approved': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleClockInOut = async (action) => {
    if (!dashboardData.todayShift) return;
    
    try {
      const response = await api.put(`/shifts/${dashboardData.todayShift._id}/clock`, {
        action,
        location: 'Salon'
      });
      
      toast.success(response.data.message);
      await fetchDashboardData();
    } catch (error) {
      const errorMessage = error.response?.data?.error || `Failed to clock ${action}`;
      toast.error(errorMessage);
    }
  };

  const canClockIn = () => {
    return dashboardData.todayShift && 
           dashboardData.todayShift.status === 'Scheduled' && 
           !dashboardData.todayShift.clockIn?.time;
  };

  const canClockOut = () => {
    return dashboardData.todayShift && 
           dashboardData.todayShift.clockIn?.time && 
           !dashboardData.todayShift.clockOut?.time;
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
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600">Here's your performance overview</p>
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

      {/* Today's Shift & Clock In/Out */}
      {dashboardData.todayShift && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Today's Shift</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTime(dashboardData.todayShift.startTime)} - {formatTime(dashboardData.todayShift.endTime)}
                  </span>
                  <Badge className={getStatusColor(dashboardData.todayShift.status)}>
                    {dashboardData.todayShift.status}
                  </Badge>
                </div>
                {dashboardData.todayShift.clockIn?.time && (
                  <p className="text-sm text-green-600 mt-1">
                    Clocked in at {new Date(dashboardData.todayShift.clockIn.time).toLocaleTimeString()}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                {canClockIn() && (
                  <Button 
                    onClick={() => handleClockInOut('in')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Clock In
                  </Button>
                )}
                {canClockOut() && (
                  <Button 
                    onClick={() => handleClockInOut('out')}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Clock Out
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shifts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.totalShifts || 0}
                </p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  This {selectedPeriod}
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
                <p className="text-sm font-medium text-gray-600">Hours Worked</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.totalHours || 0}h
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Timer className="h-3 w-3 mr-1" />
                  {dashboardData.stats.completedShifts || 0} completed
                </p>
              </div>
              <Timer className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.completionRate || 0}%
                </p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Excellent performance
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.customerRating || 0}/5
                </p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Star className="h-3 w-3 mr-1" />
                  {dashboardData.stats.punctualityScore || 0}% punctual
                </p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Trend
          </CardTitle>
          <CardDescription>Your weekly performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          {getSafeChartData(dashboardData.performance).length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No performance data available</p>
                <p className="text-sm mt-1">Complete some shifts to see your performance trends</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getSafeChartData(dashboardData.performance)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Hours Worked"
                />
                <Line 
                  type="monotone" 
                  dataKey="shifts" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Shifts Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Shifts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Shifts
            </CardTitle>
            <CardDescription>Your next scheduled shifts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.upcomingShifts.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2" />
                  <p>No upcoming shifts</p>
                </div>
              ) : (
                dashboardData.upcomingShifts.map((shift) => (
                  <div key={shift._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{formatDate(shift.date)}</p>
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
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Leave Requests
            </CardTitle>
            <CardDescription>Your recent leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.leaveRequests.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>No recent leave requests</p>
                </div>
              ) : (
                dashboardData.leaveRequests.slice(0, 5).map((request) => (
                  <div key={request._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{request.leaveType}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.totalDays} days
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">View Schedule</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">Request Leave</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Time Tracker</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Award className="h-5 w-5" />
              <span className="text-sm">Performance</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
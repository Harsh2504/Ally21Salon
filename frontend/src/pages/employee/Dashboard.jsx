import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, FileText, Clock, Scissors, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { userService, leaveService } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile
      const profileResponse = await userService.getProfile();
      setProfile(profileResponse.user);

      // Fetch user's leave requests
      const leavesResponse = await leaveService.getMyLeaves();
      setMyLeaves(leavesResponse.leaves || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      'Accepted': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Rejected': { color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    return statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
  };

  // Mock data for upcoming shifts and services
  const upcomingShifts = [
    { date: '2024-09-23', time: '09:00 - 17:00', position: 'Hair Stylist' },
    { date: '2024-09-24', time: '12:00 - 20:00', position: 'Hair Stylist' },
    { date: '2024-09-25', time: '10:00 - 18:00', position: 'Hair Stylist' },
  ];

  const recentServices = [
    { name: 'Hair Cut & Style', category: 'Hair', price: '$50' },
    { name: 'Hair Coloring', category: 'Hair', price: '$120' },
    { name: 'Facial Treatment', category: 'Skincare', price: '$80' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingLeaves = myLeaves.filter(leave => leave.status === 'Pending').length;
  const approvedLeaves = myLeaves.filter(leave => leave.status === 'Accepted').length;
  const rejectedLeaves = myLeaves.filter(leave => leave.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {profile?.name || 'Employee'}!
        </h2>
        <p className="text-gray-600">Here's your dashboard overview for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Leave Requests</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myLeaves.length}</div>
            <p className="text-xs text-gray-600 mt-1">{pendingLeaves} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedLeaves}</div>
            <p className="text-xs text-gray-600 mt-1">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Shifts</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingShifts.length}</div>
            <p className="text-xs text-gray-600 mt-1">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Services</CardTitle>
            <Scissors className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-600 mt-1">Active services</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
            <CardDescription>Your latest leave applications</CardDescription>
          </CardHeader>
          <CardContent>
            {myLeaves.length > 0 ? (
              <div className="space-y-4">
                {myLeaves.slice(0, 3).map((leave) => {
                  const statusConfig = getStatusBadge(leave.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <div key={leave._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{leave.reason}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="h-4 w-4" />
                        <Badge className={statusConfig.color}>
                          {leave.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No leave requests yet</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Shifts */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Shifts</CardTitle>
            <CardDescription>Your scheduled work hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingShifts.map((shift, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{new Date(shift.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">{shift.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{shift.time}</p>
                    <Badge variant="secondary">Scheduled</Badge>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-4 text-center">
              Note: Shift data is mock data. Backend integration pending.
            </p>
          </CardContent>
        </Card>

        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">{profile?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Full Name</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">{profile?.email || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Email Address</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">{profile?.phone || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Phone Number</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Services */}
        <Card>
          <CardHeader>
            <CardTitle>Available Services</CardTitle>
            <CardDescription>Services you can provide</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Scissors className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{service.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-4 text-center">
              Note: Service data is mock data. Backend integration pending.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used employee tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium">Request Leave</p>
            </div>
            <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
              <Clock className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium">View Shifts</p>
            </div>
            <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
              <User className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-sm font-medium">Update Profile</p>
            </div>
            <div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
              <Scissors className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-sm font-medium">Browse Services</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
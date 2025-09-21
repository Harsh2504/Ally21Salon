import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const MyShifts = () => {
  // Mock data for shifts - this will be replaced with API calls later
  const [shifts] = useState([
    {
      id: 1,
      date: '2024-09-23',
      startTime: '09:00',
      endTime: '17:00',
      position: 'Hair Stylist',
      status: 'Scheduled',
      location: 'Main Floor',
      clients: 6,
      services: ['Hair Cut', 'Hair Styling', 'Hair Coloring']
    },
    {
      id: 2,
      date: '2024-09-24',
      startTime: '12:00',
      endTime: '20:00',
      position: 'Hair Stylist',
      status: 'Scheduled',
      location: 'Main Floor',
      clients: 8,
      services: ['Hair Cut', 'Hair Styling']
    },
    {
      id: 3,
      date: '2024-09-25',
      startTime: '10:00',
      endTime: '18:00',
      position: 'Hair Stylist',
      status: 'Scheduled',
      location: 'Main Floor',
      clients: 7,
      services: ['Hair Cut', 'Hair Styling', 'Hair Washing']
    },
    {
      id: 4,
      date: '2024-09-20',
      startTime: '09:00',
      endTime: '17:00',
      position: 'Hair Stylist',
      status: 'Completed',
      location: 'Main Floor',
      clients: 5,
      services: ['Hair Cut', 'Hair Styling']
    },
    {
      id: 5,
      date: '2024-09-21',
      startTime: '11:00',
      endTime: '19:00',
      position: 'Hair Stylist',
      status: 'Completed',
      location: 'Main Floor',
      clients: 6,
      services: ['Hair Cut', 'Hair Coloring']
    },
    {
      id: 6,
      date: '2024-09-26',
      startTime: '08:00',
      endTime: '16:00',
      position: 'Hair Stylist',
      status: 'Scheduled',
      location: 'Main Floor',
      clients: 5,
      services: ['Hair Cut', 'Hair Styling']
    },
    {
      id: 7,
      date: '2024-09-27',
      startTime: '13:00',
      endTime: '21:00',
      position: 'Hair Stylist',
      status: 'Scheduled',
      location: 'Main Floor',
      clients: 7,
      services: ['Hair Cut', 'Hair Styling', 'Hair Treatment']
    }
  ]);

  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week, 1 = next week, -1 = previous week
  const [filterStatus, setFilterStatus] = useState('All');

  const calculateHours = (startTime, endTime) => {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours;
  };

  const getWeekRange = (weekOffset = 0) => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + (weekOffset * 7));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return { start: startOfWeek, end: endOfWeek };
  };

  const formatDateRange = (start, end) => {
    const options = { month: 'short', day: 'numeric' };
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${start.getFullYear()}`;
  };

  const isDateInWeek = (dateString, weekStart, weekEnd) => {
    const date = new Date(dateString);
    return date >= weekStart && date <= weekEnd;
  };

  const { start: weekStart, end: weekEnd } = getWeekRange(selectedWeek);
  
  const filteredShifts = shifts.filter(shift => {
    const matchesWeek = isDateInWeek(shift.date, weekStart, weekEnd);
    const matchesStatus = filterStatus === 'All' || shift.status === filterStatus;
    return matchesWeek && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusColors = {
      'Scheduled': 'bg-blue-100 text-blue-800 border-blue-300',
      'Completed': 'bg-green-100 text-green-800 border-green-300',
      'Cancelled': 'bg-red-100 text-red-800 border-red-300',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const totalHours = filteredShifts.reduce((sum, shift) => sum + calculateHours(shift.startTime, shift.endTime), 0);
  const totalClients = filteredShifts.reduce((sum, shift) => sum + shift.clients, 0);
  const scheduledShifts = filteredShifts.filter(s => s.status === 'Scheduled').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">My Shifts</h2>
        <p className="text-gray-600">View your work schedule and shift details</p>
      </div>

      {/* Note about UI-only implementation */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a UI-only implementation. Shift data is mock data and will be lost on refresh. 
            Backend integration for shift management will be implemented in future updates.
          </p>
        </CardContent>
      </Card>

      {/* Week Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(selectedWeek - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-center">
                <h3 className="font-semibold text-lg">
                  {formatDateRange(weekStart, weekEnd)}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedWeek === 0 ? 'Current Week' : 
                   selectedWeek > 0 ? `${selectedWeek} week${selectedWeek > 1 ? 's' : ''} ahead` : 
                   `${Math.abs(selectedWeek)} week${Math.abs(selectedWeek) > 1 ? 's' : ''} ago`}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(selectedWeek + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{filteredShifts.length}</p>
                <p className="text-sm text-gray-600">Total Shifts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{totalHours}h</p>
                <p className="text-sm text-gray-600">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{scheduledShifts}</p>
                <p className="text-sm text-gray-600">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{totalClients}</p>
                <p className="text-sm text-gray-600">Total Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shifts Grid */}
      {filteredShifts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShifts.map((shift) => (
            <Card key={shift.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {new Date(shift.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </CardTitle>
                  <Badge className={getStatusBadge(shift.status)}>
                    {shift.status}
                  </Badge>
                </div>
                <CardDescription>{shift.position}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{shift.startTime} - {shift.endTime}</span>
                  <span className="text-gray-500">
                    ({calculateHours(shift.startTime, shift.endTime)}h)
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{shift.location}</span>
                </div>

                <div className="text-sm">
                  <p className="font-medium text-gray-700">Scheduled Clients: {shift.clients}</p>
                </div>

                <div className="text-sm">
                  <p className="font-medium text-gray-700 mb-1">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {shift.services.map((service, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {shift.status === 'Scheduled' && (
                  <div className="pt-2 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts found</h3>
            <p className="text-gray-500">
              {filterStatus === 'All' 
                ? 'No shifts scheduled for this week.'
                : `No ${filterStatus.toLowerCase()} shifts for this week.`
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Weekly Summary */}
      {filteredShifts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Week Summary</CardTitle>
            <CardDescription>Overview of your work week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{totalHours}</div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{totalClients}</div>
                <div className="text-sm text-gray-600">Total Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  ${(totalHours * 15).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">Estimated Earnings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyShifts;
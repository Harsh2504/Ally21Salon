import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, Clock, LogIn, LogOut, 
  AlertCircle, MapPin, Timer, CalendarDays
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

const MyShifts = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clockLoading, setClockLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(getStartOfWeek(new Date()));
  const [shiftStats, setShiftStats] = useState({});

  useEffect(() => {
    fetchShifts();
    fetchShiftStats();
  }, [selectedWeek]);

  function getStartOfWeek(date) {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    start.setDate(diff);
    return start.toISOString().split('T')[0];
  }

  function getEndOfWeek(startDate) {
    const end = new Date(startDate);
    end.setDate(end.getDate() + 6);
    return end.toISOString().split('T')[0];
  }

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const startDate = selectedWeek;
      const endDate = getEndOfWeek(startDate);
      
      const response = await api.get(`/shifts?startDate=${startDate}&endDate=${endDate}`);
      setShifts(response.data.shifts || []);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      toast.error('Failed to fetch shifts');
      setShifts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchShiftStats = async () => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const endDate = new Date();
      
      const response = await api.get(
        `/shifts/stats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      setShiftStats(response.data);
    } catch (error) {
      console.error('Error fetching shift stats:', error);
    }
  };

  const handleClockInOut = async (shiftId, action) => {
    setClockLoading(true);
    try {
      const response = await api.put(`/shifts/${shiftId}/clock`, {
        action,
        location: 'Salon',
      });
      
      toast.success(response.data.message);
      await fetchShifts();
    } catch (error) {
      const errorMessage = error.response?.data?.error || `Failed to clock ${action}`;
      toast.error(errorMessage);
    } finally {
      setClockLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-gray-100 text-gray-800',
      'No Show': 'bg-red-100 text-red-800',
    };
    return classes[status] || '';
  };

  const canClockIn = (shift) => {
    const now = new Date();
    const shiftDate = new Date(shift.date);
    const today = new Date().toDateString();
    const shiftDateString = shiftDate.toDateString();
    
    return (
      shiftDateString === today &&
      shift.status === 'Scheduled' &&
      !shift.clockIn?.time
    );
  };

  const canClockOut = (shift) => {
    return (
      shift.status === 'Scheduled' &&
      shift.clockIn?.time &&
      !shift.clockOut?.time
    );
  };

  const calculateWorkedHours = (shift) => {
    if (shift.clockIn?.time && shift.clockOut?.time) {
      const start = new Date(shift.clockIn.time);
      const end = new Date(shift.clockOut.time);
      const hours = (end - start) / (1000 * 60 * 60);
      return hours.toFixed(2);
    }
    return null;
  };

  const navigateWeek = (direction) => {
    const currentStart = new Date(selectedWeek);
    if (direction === 'prev') {
      currentStart.setDate(currentStart.getDate() - 7);
    } else {
      currentStart.setDate(currentStart.getDate() + 7);
    }
    setSelectedWeek(currentStart.toISOString().split('T')[0]);
  };

  const goToCurrentWeek = () => {
    setSelectedWeek(getStartOfWeek(new Date()));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Shifts</h1>
          <p className="text-gray-600">View your schedule and clock in/out</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{shifts.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-green-600">{shiftStats.totalShifts || 0}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hours Worked</p>
                <p className="text-2xl font-bold text-purple-600">
                  {shiftStats.totalWorkingHours || 0}h
                </p>
              </div>
              <Timer className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {shiftStats.completionRate || 0}%
                </p>
              </div>
              <LogIn className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigateWeek('prev')}>
              ← Previous Week
            </Button>
            <div className="text-center">
              <h3 className="font-semibold">
                {formatDate(selectedWeek)} - {formatDate(getEndOfWeek(selectedWeek))}
              </h3>
              <Button variant="ghost" size="sm" onClick={goToCurrentWeek} className="mt-1">
                Go to Current Week
              </Button>
            </div>
            <Button variant="outline" onClick={() => navigateWeek('next')}>
              Next Week →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shifts */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>
            Your shifts for the selected week
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : shifts.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts scheduled</h3>
              <p className="text-gray-600">
                You don't have any shifts scheduled for this week.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {shifts.map((shift) => (
                <Card key={shift._id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {formatDateShort(shift.date)}
                          </h3>
                          <Badge 
                            className={getStatusBadgeClass(shift.status)}
                          >
                            {shift.status}
                          </Badge>
                          <Badge variant="outline">{shift.shiftType}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-gray-500" />
                            <span>{shift.duration}h scheduled</span>
                          </div>
                          
                          {shift.breakTime && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span>Break: {shift.breakTime.duration}min</span>
                            </div>
                          )}
                          
                          {shift.clockIn?.time && (
                            <div className="flex items-center gap-2">
                              <LogIn className="h-4 w-4 text-green-500" />
                              <span>In: {new Date(shift.clockIn.time).toLocaleTimeString()}</span>
                            </div>
                          )}
                          
                          {shift.clockOut?.time && (
                            <div className="flex items-center gap-2">
                              <LogOut className="h-4 w-4 text-red-500" />
                              <span>Out: {new Date(shift.clockOut.time).toLocaleTimeString()}</span>
                            </div>
                          )}
                        </div>
                        
                        {shift.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Notes:</strong> {shift.notes}
                            </p>
                          </div>
                        )}
                        
                        {calculateWorkedHours(shift) && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-700">
                              <strong>Total Hours Worked:</strong> {calculateWorkedHours(shift)}h
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {canClockIn(shift) && (
                          <Button
                            onClick={() => handleClockInOut(shift._id, 'in')}
                            disabled={clockLoading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <LogIn className="h-4 w-4 mr-2" />
                            Clock In
                          </Button>
                        )}
                        
                        {canClockOut(shift) && (
                          <Button
                            onClick={() => handleClockInOut(shift._id, 'out')}
                            disabled={clockLoading}
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Clock Out
                          </Button>
                        )}
                        
                        {shift.status === 'Completed' && (
                          <div className="text-center">
                            <Badge className="bg-green-100 text-green-800">
                              Shift Complete
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Clock In/Out Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <p>• You can only clock in on the day of your scheduled shift</p>
          <p>• Clock in when you arrive at work and are ready to start</p>
          <p>• Clock out when you finish your shift and are ready to leave</p>
          <p>• All clock-in/out times are automatically recorded with location</p>
          <p>• Contact your manager if you need to make any adjustments</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyShifts;
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Edit, Trash2, Search, Clock, Calendar, 
  Users, CheckCircle, X, Save, AlertCircle, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [formData, setFormData] = useState({
    employeeId: '',
    date: '',
    startTime: '',
    endTime: '',
    shiftType: 'Regular',
    notes: '',
    breakTime: {
      start: '12:00',
      end: '13:00',
      duration: 60,
    },
    services: [],
  });
  const [error, setError] = useState('');

  const shiftTypes = ['Regular', 'Overtime', 'Holiday', 'Training'];
  const shiftStatuses = ['Scheduled', 'Completed', 'Cancelled', 'No Show'];

  useEffect(() => {
    fetchShifts();
    fetchEmployees();
    fetchServices();
  }, []);

  useEffect(() => {
    fetchShifts();
  }, [selectedDate, selectedEmployee, selectedStatus]);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Set date range for the selected date
      if (selectedDate) {
        const startDate = new Date(selectedDate);
        const endDate = new Date(selectedDate);
        endDate.setDate(endDate.getDate() + 1);
        
        params.append('startDate', startDate.toISOString());
        params.append('endDate', endDate.toISOString());
      }
      
      if (selectedEmployee) params.append('employeeId', selectedEmployee);
      if (selectedStatus) params.append('status', selectedStatus);
      
      const response = await api.get(`/shifts?${params.toString()}`);
      setShifts(response.data.shifts || []);
    } catch (error) {
      console.error('Error fetching shifts:', error);
      toast.error('Failed to fetch shifts');
      setShifts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/users/employees');
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/services?isActive=true');
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('breakTime.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        breakTime: {
          ...prev.breakTime,
          [field]: field === 'duration' ? parseInt(value) : value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      date: '',
      startTime: '',
      endTime: '',
      shiftType: 'Regular',
      notes: '',
      breakTime: {
        start: '12:00',
        end: '13:00',
        duration: 60,
      },
      services: [],
    });
    setError('');
  };

  const handleAddShift = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      await api.post('/shifts', formData);
      await fetchShifts();
      setShowAddForm(false);
      resetForm();
      toast.success('Shift created successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create shift';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditShift = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      await api.put(`/shifts/${editingShift._id}`, formData);
      await fetchShifts();
      setEditingShift(null);
      setShowAddForm(false);
      resetForm();
      toast.success('Shift updated successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update shift';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteShift = async (shiftId) => {
    if (!window.confirm('Are you sure you want to delete this shift?')) {
      return;
    }

    try {
      await api.delete(`/shifts/${shiftId}`);
      await fetchShifts();
      toast.success('Shift deleted successfully!');
    } catch (error) {
      const errorMessage = 'Failed to delete shift';
      toast.error(errorMessage);
    }
  };

  const startEditShift = (shift) => {
    setEditingShift(shift);
    setFormData({
      employeeId: shift.employeeId._id,
      date: new Date(shift.date).toISOString().split('T')[0],
      startTime: shift.startTime,
      endTime: shift.endTime,
      shiftType: shift.shiftType,
      notes: shift.notes || '',
      breakTime: shift.breakTime || {
        start: '12:00',
        end: '13:00',
        duration: 60,
      },
      services: shift.services || [],
    });
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingShift(null);
    setShowAddForm(false);
    resetForm();
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      'Scheduled': 'default',
      'Completed': 'default',
      'Cancelled': 'secondary',
      'No Show': 'destructive',
    };
    return variants[status] || 'secondary';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Management</h1>
          <p className="text-gray-600">Manage employee schedules and shifts</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Create Shift
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shifts</p>
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
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">
                  {shifts.filter(s => s.status === 'Scheduled').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {shifts.filter(s => s.status === 'Completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(shifts.map(s => s.employeeId._id)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingShift ? 'Edit Shift' : 'Create New Shift'}</span>
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingShift ? handleEditShift : handleAddShift} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="employeeId">Employee *</Label>
                  <select
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select employee</option>
                    {employees.map(employee => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="shiftType">Shift Type</Label>
                  <select
                    id="shiftType"
                    name="shiftType"
                    value={formData.shiftType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {shiftTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="breakTime.start">Break Start</Label>
                  <Input
                    id="breakTime.start"
                    name="breakTime.start"
                    type="time"
                    value={formData.breakTime.start}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="breakTime.end">Break End</Label>
                  <Input
                    id="breakTime.end"
                    name="breakTime.end"
                    type="time"
                    value={formData.breakTime.end}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="breakTime.duration">Break Duration (min)</Label>
                  <Input
                    id="breakTime.duration"
                    name="breakTime.duration"
                    type="number"
                    min="15"
                    max="180"
                    value={formData.breakTime.duration}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes about this shift"
                  maxLength="500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={formLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {formLoading ? 'Saving...' : editingShift ? 'Update Shift' : 'Create Shift'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="dateFilter">Date</Label>
              <Input
                id="dateFilter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="employeeFilter">Employee</Label>
              <select
                id="employeeFilter"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Employees</option>
                {employees.map(employee => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <Label htmlFor="statusFilter">Status</Label>
              <select
                id="statusFilter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {shiftStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shifts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shifts</CardTitle>
          <CardDescription>
            {shifts.length} shift{shifts.length !== 1 ? 's' : ''} for {formatDate(selectedDate)}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts found</h3>
              <p className="text-gray-600 mb-4">
                No shifts scheduled for the selected criteria
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Shift
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map((shift) => (
                    <TableRow key={shift._id}>
                      <TableCell>
                        <div className="font-medium">{shift.employeeId.name}</div>
                        <div className="text-sm text-gray-600">{shift.employeeId.email}</div>
                      </TableCell>
                      <TableCell>{formatDate(shift.date)}</TableCell>
                      <TableCell>
                        <div>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</div>
                        {shift.breakTime && (
                          <div className="text-xs text-gray-600">
                            Break: {shift.breakTime.duration}min
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{shift.duration ? `${shift.duration}h` : 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{shift.shiftType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadgeVariant(shift.status)}
                          className={getStatusBadgeClass(shift.status)}
                        >
                          {shift.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditShift(shift)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteShift(shift._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftManagement;
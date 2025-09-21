import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Clock, Calendar, Users } from 'lucide-react';

const ShiftManagement = () => {
  // Mock data for shifts - this will be replaced with API calls later
  const [shifts, setShifts] = useState([
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      date: '2024-09-23',
      startTime: '09:00',
      endTime: '17:00',
      position: 'Hair Stylist',
      status: 'Scheduled'
    },
    {
      id: 2,
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      date: '2024-09-23',
      startTime: '10:00',
      endTime: '18:00',
      position: 'Nail Technician',
      status: 'Scheduled'
    },
    {
      id: 3,
      employeeId: 'EMP003',
      employeeName: 'Alice Johnson',
      date: '2024-09-24',
      startTime: '08:00',
      endTime: '16:00',
      position: 'Esthetician',
      status: 'Scheduled'
    },
    {
      id: 4,
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      date: '2024-09-24',
      startTime: '12:00',
      endTime: '20:00',
      position: 'Hair Stylist',
      status: 'Scheduled'
    },
    {
      id: 5,
      employeeId: 'EMP004',
      employeeName: 'Bob Wilson',
      date: '2024-09-25',
      startTime: '09:00',
      endTime: '17:00',
      position: 'Receptionist',
      status: 'Completed'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    date: '',
    startTime: '',
    endTime: '',
    position: 'Hair Stylist'
  });

  const positions = ['Hair Stylist', 'Nail Technician', 'Esthetician', 'Receptionist', 'Manager'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddShift = (e) => {
    e.preventDefault();
    const newShift = {
      id: shifts.length + 1,
      ...formData,
      status: 'Scheduled'
    };
    setShifts([...shifts, newShift]);
    setShowAddForm(false);
    setFormData({
      employeeId: '',
      employeeName: '',
      date: '',
      startTime: '',
      endTime: '',
      position: 'Hair Stylist'
    });
  };

  const handleEditShift = (e) => {
    e.preventDefault();
    const updatedShifts = shifts.map(shift =>
      shift.id === editingShift.id ? { ...shift, ...formData } : shift
    );
    setShifts(updatedShifts);
    setEditingShift(null);
    setFormData({
      employeeId: '',
      employeeName: '',
      date: '',
      startTime: '',
      endTime: '',
      position: 'Hair Stylist'
    });
  };

  const handleDeleteShift = (shiftId) => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      setShifts(shifts.filter(shift => shift.id !== shiftId));
    }
  };

  const startEdit = (shift) => {
    setEditingShift(shift);
    setFormData({
      employeeId: shift.employeeId,
      employeeName: shift.employeeName,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      position: shift.position
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingShift(null);
    setFormData({
      employeeId: '',
      employeeName: '',
      date: '',
      startTime: '',
      endTime: '',
      position: 'Hair Stylist'
    });
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setFormData({
      employeeId: '',
      employeeName: '',
      date: '',
      startTime: '',
      endTime: '',
      position: 'Hair Stylist'
    });
  };

  const calculateHours = (startTime, endTime) => {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours;
  };

  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = shift.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || shift.date === filterDate;
    return matchesSearch && matchesDate;
  });

  // Get unique dates for filter
  const uniqueDates = [...new Set(shifts.map(shift => shift.date))].sort();

  const totalShifts = shifts.length;
  const scheduledShifts = shifts.filter(s => s.status === 'Scheduled').length;
  const completedShifts = shifts.filter(s => s.status === 'Completed').length;
  const totalHours = shifts.reduce((sum, shift) => sum + calculateHours(shift.startTime, shift.endTime), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Shift Management</h2>
          <p className="text-gray-600">Schedule and manage employee shifts</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm || editingShift}
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule Shift
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalShifts}</p>
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
                <p className="text-2xl font-bold">{scheduledShifts}</p>
                <p className="text-sm text-gray-600">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{completedShifts}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
                <p className="text-sm text-gray-600">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Note about UI-only implementation */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a UI-only implementation. Shift data is stored locally and will be lost on refresh. 
            Backend integration for shift management will be implemented in future updates.
          </p>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by employee or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Dates</option>
          {uniqueDates.map(date => (
            <option key={date} value={date}>{new Date(date).toLocaleDateString()}</option>
          ))}
        </select>
      </div>

      {/* Add Shift Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Shift</CardTitle>
            <CardDescription>Create a new employee shift</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddShift} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    placeholder="e.g., EMP001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeName">Employee Name</Label>
                  <Input
                    id="employeeName"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
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
              
              <div className="flex space-x-2">
                <Button type="submit">Schedule Shift</Button>
                <Button type="button" variant="outline" onClick={cancelAdd}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Shift Form */}
      {editingShift && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Shift</CardTitle>
            <CardDescription>Update shift information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEditShift} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-employeeId">Employee ID</Label>
                  <Input
                    id="edit-employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-employeeName">Employee Name</Label>
                  <Input
                    id="edit-employeeName"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position</Label>
                  <select
                    id="edit-position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-startTime">Start Time</Label>
                  <Input
                    id="edit-startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endTime">End Time</Label>
                  <Input
                    id="edit-endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit">Update Shift</Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Shifts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Shifts ({filteredShifts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredShifts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{shift.employeeName}</p>
                        <p className="text-sm text-gray-600">{shift.employeeId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(shift.date).toLocaleDateString()}</TableCell>
                    <TableCell>{shift.startTime} - {shift.endTime}</TableCell>
                    <TableCell>{shift.position}</TableCell>
                    <TableCell>{calculateHours(shift.startTime, shift.endTime)}h</TableCell>
                    <TableCell>
                      <Badge 
                        className={shift.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                      >
                        {shift.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(shift)}
                          disabled={showAddForm || editingShift}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteShift(shift.id)}
                          disabled={showAddForm || editingShift}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-8">No shifts found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftManagement;
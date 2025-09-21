import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { leaveService } from '@/services/apiService';
import { Plus, Edit, Trash2, Eye, Calendar, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    description: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  const leaveReasons = [
    'Vacation',
    'Sick Leave',
    'Personal',
    'Family Emergency',
    'Medical Appointment',
    'Bereavement',
    'Other'
  ];

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    try {
      const response = await leaveService.getMyLeaves();
      setLeaves(response.leaves || []);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setError('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      setError('Start date cannot be in the past');
      setFormLoading(false);
      return;
    }

    if (endDate < startDate) {
      setError('End date cannot be before start date');
      setFormLoading(false);
      return;
    }

    try {
      if (editingLeave) {
        await leaveService.updateLeaveRequest(editingLeave._id, formData);
        setEditingLeave(null);
      } else {
        await leaveService.createLeaveRequest(formData);
        setShowAddForm(false);
      }
      
      await fetchMyLeaves();
      setFormData({ startDate: '', endDate: '', reason: '', description: '' });
    } catch (error) {
      console.error('Error submitting leave:', error);
      setError(error.response?.data?.error || 'Failed to submit leave request');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteLeave = async (leaveId) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) {
      return;
    }

    try {
      await leaveService.deleteLeaveRequest(leaveId);
      await fetchMyLeaves();
    } catch (error) {
      console.error('Error deleting leave:', error);
      setError('Failed to delete leave request');
    }
  };

  const startEdit = (leave) => {
    if (leave.status !== 'Pending') {
      setError('You can only edit pending leave requests');
      return;
    }
    
    setEditingLeave(leave);
    setFormData({
      startDate: leave.startDate.split('T')[0],
      endDate: leave.endDate.split('T')[0],
      reason: leave.reason,
      description: leave.description || '',
    });
    setShowAddForm(false);
    setSelectedLeave(null);
  };

  const cancelEdit = () => {
    setEditingLeave(null);
    setFormData({ startDate: '', endDate: '', reason: '', description: '' });
    setError('');
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setFormData({ startDate: '', endDate: '', reason: '', description: '' });
    setError('');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: AlertCircle },
      'Accepted': { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
      'Rejected': { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle },
    };
    return statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Get summary statistics
  const pendingLeaves = leaves.filter(leave => leave.status === 'Pending').length;
  const approvedLeaves = leaves.filter(leave => leave.status === 'Accepted').length;
  const rejectedLeaves = leaves.filter(leave => leave.status === 'Rejected').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Leave Requests</h2>
          <p className="text-gray-600">Manage your leave applications and track their status</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm || editingLeave}
        >
          <Plus className="mr-2 h-4 w-4" />
          Request Leave
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{leaves.length}</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{pendingLeaves}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{approvedLeaves}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{rejectedLeaves}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Add Leave Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Request New Leave</CardTitle>
            <CardDescription>Submit a new leave request for approval</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitLeave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a reason</option>
                  {leaveReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide additional details about your leave request..."
                  rows={3}
                />
              </div>

              {formData.startDate && formData.endDate && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Duration:</strong> {calculateDays(formData.startDate, formData.endDate)} day(s)
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelAdd}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Leave Form */}
      {editingLeave && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Leave Request</CardTitle>
            <CardDescription>Update your pending leave request</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitLeave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input
                    id="edit-endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-reason">Reason</Label>
                <select
                  id="edit-reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a reason</option>
                  {leaveReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide additional details about your leave request..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Updating...' : 'Update Request'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Leave Detail Modal */}
      {selectedLeave && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Leave Request Details</CardTitle>
            <CardDescription>View your leave request information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <p className="font-medium">{new Date(selectedLeave.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label>End Date</Label>
                <p className="font-medium">{new Date(selectedLeave.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label>Duration</Label>
                <p className="font-medium">{calculateDays(selectedLeave.startDate, selectedLeave.endDate)} days</p>
              </div>
              <div>
                <Label>Reason</Label>
                <p className="font-medium">{selectedLeave.reason}</p>
              </div>
              {selectedLeave.description && (
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <p className="text-gray-700">{selectedLeave.description}</p>
                </div>
              )}
              <div>
                <Label>Status</Label>
                <Badge className={getStatusBadge(selectedLeave.status).color}>
                  {selectedLeave.status}
                </Badge>
              </div>
              <div>
                <Label>Submitted Date</Label>
                <p className="font-medium">{new Date(selectedLeave.created_at).toLocaleDateString()}</p>
              </div>
              {selectedLeave.remark && (
                <div className="md:col-span-2">
                  <Label>Manager's Remark</Label>
                  <p className="text-gray-700">{selectedLeave.remark}</p>
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <Button onClick={() => setSelectedLeave(null)} variant="outline">
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Leave Requests ({leaves.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {leaves.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dates</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaves.map((leave) => {
                  const statusConfig = getStatusBadge(leave.status);
                  return (
                    <TableRow key={leave._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{new Date(leave.startDate).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">to {new Date(leave.endDate).toLocaleDateString()}</p>
                        </div>
                      </TableCell>
                      <TableCell>{leave.reason}</TableCell>
                      <TableCell>{calculateDays(leave.startDate, leave.endDate)} days</TableCell>
                      <TableCell>
                        <Badge className={statusConfig.color}>
                          {leave.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(leave.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-1 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedLeave(leave)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {leave.status === 'Pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(leave)}
                                disabled={showAddForm || editingLeave}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteLeave(leave._id)}
                                disabled={showAddForm || editingLeave}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No leave requests yet</p>
              <Button 
                onClick={() => setShowAddForm(true)} 
                variant="outline" 
                className="mt-4"
                disabled={showAddForm}
              >
                Request Your First Leave
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyLeaves;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { leaveService } from '@/services/apiService';
import { Check, X, Eye, Search, Calendar } from 'lucide-react';

const LeaveApprovals = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [remark, setRemark] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await leaveService.getAllLeaveRequests();
      setLeaves(response.leaves || []);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (leaveId, status) => {
    setActionLoading(true);
    try {
      await leaveService.approveRejectLeave(leaveId, {
        status,
        remark: remark || `Leave ${status.toLowerCase()}`
      });
      await fetchLeaveRequests();
      setSelectedLeave(null);
      setRemark('');
    } catch (error) {
      console.error(`Error ${status.toLowerCase()} leave:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Accepted': 'bg-green-100 text-green-800 border-green-300',
      'Rejected': 'bg-red-100 text-red-800 border-red-300',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.userid.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || leave.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = leaves.filter(leave => leave.status === 'Pending').length;
  const approvedCount = leaves.filter(leave => leave.status === 'Accepted').length;
  const rejectedCount = leaves.filter(leave => leave.status === 'Rejected').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div>
        <h2 className="text-2xl font-bold">Leave Request Management</h2>
        <p className="text-gray-600">Review and approve employee leave requests</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-blue-500" />
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
                <Calendar className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{rejectedCount}</p>
                  <p className="text-sm text-gray-600">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by employee ID or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Leave Detail Modal */}
      {selectedLeave && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Leave Request Details</CardTitle>
            <CardDescription>Review and take action on this leave request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Employee ID</Label>
                <p className="font-medium">{selectedLeave.userid}</p>
              </div>
              <div>
                <Label>Leave Duration</Label>
                <p className="font-medium">
                  {calculateDays(selectedLeave.startDate, selectedLeave.endDate)} days
                </p>
              </div>
              <div>
                <Label>Start Date</Label>
                <p className="font-medium">{new Date(selectedLeave.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label>End Date</Label>
                <p className="font-medium">{new Date(selectedLeave.endDate).toLocaleDateString()}</p>
              </div>
              <div className="md:col-span-2">
                <Label>Reason</Label>
                <p className="font-medium">{selectedLeave.reason}</p>
              </div>
              {selectedLeave.description && (
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <p className="text-gray-700">{selectedLeave.description}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <Label>Current Status</Label>
                <Badge className={getStatusBadge(selectedLeave.status)}>
                  {selectedLeave.status}
                </Badge>
              </div>
            </div>

            {selectedLeave.status === 'Pending' && (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <Label htmlFor="remark">Remark (Optional)</Label>
                  <Textarea
                    id="remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Add a remark for this decision..."
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleApproveReject(selectedLeave._id, 'Accepted')}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleApproveReject(selectedLeave._id, 'Rejected')}
                    disabled={actionLoading}
                    variant="destructive"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => setSelectedLeave(null)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {selectedLeave.status !== 'Pending' && (
              <div className="border-t pt-4">
                <Button onClick={() => setSelectedLeave(null)} variant="outline">
                  Close
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Leave Requests ({filteredLeaves.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLeaves.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaves.map((leave) => (
                  <TableRow key={leave._id}>
                    <TableCell className="font-medium">{leave.userid}</TableCell>
                    <TableCell>{leave.reason}</TableCell>
                    <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{calculateDays(leave.startDate, leave.endDate)} days</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(leave.status)}>
                        {leave.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedLeave(leave)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-8">No leave requests found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveApprovals;
import api from './api';

// Auth Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// User Services
export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  changePassword: async (passwordData) => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  },
  // Manager-only: Employee management
  getAllEmployees: async () => {
    const response = await api.get('/users/employees');
    return response.data;
  },
  getEmployeeById: async (id) => {
    const response = await api.get(`/users/employees/${id}`);
    return response.data;
  },
  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/users/employees/${id}`, employeeData);
    return response.data;
  },
  deleteEmployee: async (id) => {
    const response = await api.delete(`/users/employees/${id}`);
    return response.data;
  },
};

// Leave Services
export const leaveService = {
  // Employee: Manage own leaves
  createLeaveRequest: async (leaveData) => {
    const response = await api.post('/leave/leaves', leaveData);
    return response.data;
  },
  getMyLeaves: async () => {
    const response = await api.get('/leave/leaves');
    return response.data;
  },
  getLeaveById: async (id) => {
    const response = await api.get(`/leave/leaves/${id}`);
    return response.data;
  },
  updateLeaveRequest: async (id, leaveData) => {
    const response = await api.put(`/leave/leaves/${id}`, leaveData);
    return response.data;
  },
  deleteLeaveRequest: async (id) => {
    const response = await api.delete(`/leave/leaves/${id}`);
    return response.data;
  },
  // Manager: View and approve/reject leaves
  getAllLeaveRequests: async () => {
    const response = await api.get('/leave/viewleaves/manager');
    return response.data;
  },
  approveRejectLeave: async (id, decision) => {
    const response = await api.put(`/leave/viewleaves/manager/${id}`, decision);
    return response.data;
  },
};
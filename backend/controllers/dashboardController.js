const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const Service = require('../models/Service');

// Dashboard statistics for managers
const getDashboardStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const now = new Date();
    let startDate;

    // Calculate date range based on period
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Mock data for demonstration - in real app, would calculate from actual bookings
    const stats = {
      totalRevenue: Math.floor(Math.random() * 50000) + 15000,
      revenueGrowth: Math.floor(Math.random() * 20) + 5,
      totalBookings: Math.floor(Math.random() * 500) + 100,
      bookingsToday: Math.floor(Math.random() * 25) + 5,
      activeStaff: await User.countDocuments({ role: 'employee', isActive: true }),
      staffOnDuty: Math.floor(Math.random() * 8) + 3,
      averageRating: (Math.random() * 1.5 + 3.5).toFixed(1),
      totalReviews: Math.floor(Math.random() * 200) + 50,
      employeePerformance: await getEmployeePerformance(period)
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ error: 'Failed to get dashboard statistics' });
  }
};

// Revenue data for charts
const getRevenue = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    // Mock revenue data - replace with actual booking aggregation
    const revenue = [];
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      revenue.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Math.floor(Math.random() * 2000) + 500
      });
    }

    res.json({ revenue });
  } catch (error) {
    console.error('Error getting revenue data:', error);
    res.status(500).json({ error: 'Failed to get revenue data' });
  }
};

// Employee performance data
const getEmployeePerformance = async (period) => {
  try {
    const employees = await User.find({ role: 'employee' }).limit(5);
    
    return employees.map(employee => ({
      _id: employee._id,
      name: employee.firstName + ' ' + employee.lastName,
      role: 'Stylist', // Could be from employee profile
      revenue: Math.floor(Math.random() * 5000) + 1000,
      bookings: Math.floor(Math.random() * 30) + 10
    }));
  } catch (error) {
    console.error('Error getting employee performance:', error);
    return [];
  }
};

// Popular services data
const getPopularServices = async (req, res) => {
  try {
    const services = await Service.find({}).limit(5);
    
    // Mock booking data for services
    const popularServices = services.map(service => ({
      _id: service._id,
      name: service.name,
      bookings: Math.floor(Math.random() * 50) + 10
    }));

    res.json({ services: popularServices });
  } catch (error) {
    console.error('Error getting popular services:', error);
    res.status(500).json({ error: 'Failed to get popular services' });
  }
};

// Mock bookings data
const getRecentBookings = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    // Mock booking data - replace with actual booking model
    const bookings = [];
    const statuses = ['Confirmed', 'Pending', 'Completed', 'Cancelled'];
    const names = ['John Smith', 'Sarah Johnson', 'Mike Brown', 'Emma Davis', 'Chris Wilson'];
    const services = ['Haircut', 'Hair Color', 'Manicure', 'Facial', 'Massage'];
    
    for (let i = 0; i < parseInt(limit); i++) {
      bookings.push({
        _id: `booking_${i}`,
        customerName: names[Math.floor(Math.random() * names.length)],
        serviceName: services[Math.floor(Math.random() * services.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        appointmentDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      });
    }

    res.json({ bookings });
  } catch (error) {
    console.error('Error getting recent bookings:', error);
    res.status(500).json({ error: 'Failed to get recent bookings' });
  }
};

module.exports = {
  getDashboardStats,
  getRevenue,
  getPopularServices,
  getRecentBookings
};
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get user profile
const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;  // We get this from the authMiddleware
        const user = await User.findById(userId).select('-password');  // Exclude password from response
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

// Update user profile
const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;  // We get this from the authMiddleware
        const { name, email, phone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { name, email, phone, updated_at: Date.now() },
            { new: true }
        ).select('-password');  // Exclude password from response

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', updatedUser });
    } catch (error) {
        next(error);
    }
};

// Change user password
const changePassword = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.updated_at = Date.now();
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        next(error);
    }
};

// Get all employees
const getAllEmployees = async (req, res, next) => {
    try {
        const employees = await User.find({ role: 'Employee' }).select('-password');  // Exclude password
        if (employees.length === 0) {
            return res.status(404).json({ message: 'No employees found' });
        }
        res.status(200).json({ employees });
    } catch (error) {
        next(error);
    }
};


const getEmployeeById = async (req, res, next) => {
    try {
        const employeeId = req.params.id;
        const employee = await User.findById(employeeId).select('-password');
        if (!employee || employee.role !== 'Employee') {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ employee });
    } catch (error) {
        next(error);
    }
};

const updateEmployee = async (req, res, next) => {
    try {
        const employeeId = req.params.id;
        const { name, email, phone } = req.body;
        const updatedEmployee = await User.findByIdAndUpdate(
            employeeId, 
            { name, email, phone, updated_at: Date.now() },
            { new: true }
        ).select('-password');
        if (!updatedEmployee || updatedEmployee.role !== 'Employee') {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee updated successfully', updatedEmployee });
    } catch (error) {
        next(error);
    }
};

const deleteEmployee = async (req, res, next) => {
    try {
        const employeeId = req.params.id;
        const employee = await User.findById(employeeId);
        if (!employee || employee.role !== 'Employee') {
            return res.status(404).json({ error: 'Employee not found' });
        }
        await User.findByIdAndDelete(employeeId);
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUserProfile, updateUserProfile, changePassword , getAllEmployees , getEmployeeById ,updateEmployee , deleteEmployee};

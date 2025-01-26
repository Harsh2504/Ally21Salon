const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

// Create leave request (Employee)
const createLeaveRequest = async (req, res, next) => {
    try {
        const { startDate, endDate, reason, description } = req.body;
        const userId = req.user._id;

        const leaveRequest = new LeaveRequest({
            userid: userId,
            startDate,
            endDate,
            reason,
            description,
        });

        await leaveRequest.save();
        res.status(201).json({ message: 'Leave request created successfully', leaveRequest });
    } catch (error) {
        next(error);
    }
};

// Get all leave requests for an employee
const getEmployeeLeaves = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const leaves = await LeaveRequest.find({ userid: userId });

        if (leaves.length === 0) {
            return res.status(404).json({ message: 'No leaves found for this employee' });
        }

        res.status(200).json({ leaves });
    } catch (error) {
        next(error);
    }
};

// Get a single leave request for an employee
const getSingleLeaveRequest = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const leaveId = req.params.id;

        const leave = await LeaveRequest.findOne({ _id: leaveId, userid: userId });

        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found for this employee' });
        }

        res.status(200).json({ leave });
    } catch (error) {
        next(error);
    }
};

// Update a leave request (Employee)
const updateLeaveRequest = async (req, res, next) => {
    try {
        const leaveId = req.params.id;
        const { startDate, endDate, reason, description } = req.body;

        const updatedLeave = await LeaveRequest.findByIdAndUpdate(
            leaveId,
            { startDate, endDate, reason, description, updated_at: Date.now() },
            { new: true }
        );

        if (!updatedLeave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        res.status(200).json({ message: 'Leave request updated successfully', updatedLeave });
    } catch (error) {
        next(error);
    }
};

// Delete a leave request (Employee)
const deleteLeaveRequest = async (req, res, next) => {
    try {
        const leaveId = req.params.id;
        const userId = req.user._id;

        const leave = await LeaveRequest.findOneAndDelete({ _id: leaveId, userid: userId });

        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found or not authorized to delete' });
        }

        res.status(200).json({ message: 'Leave request deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get all leave requests (Manager)
const getAllLeaveRequests = async (req, res, next) => {
    try {
        const leaves = await LeaveRequest.find();
        if (leaves.length === 0) {
            return res.status(404).json({ message: 'No leave requests found' });
        }

        res.status(200).json({ leaves });
    } catch (error) {
        next(error);
    }
};

// Accept or reject a leave request (Manager)
const acceptOrRejectLeaveRequest = async (req, res, next) => {
    try {
        const leaveId = req.params.id;
        const { status, remark } = req.body;

        if (status !== 'Accepted' && status !== 'Rejected') {
            return res.status(400).json({ message: 'Invalid status. Status must be either "Accepted" or "Rejected".' });
        }

        const leaveRequest = await LeaveRequest.findByIdAndUpdate(
            leaveId,
            { status, remark, updated_at: Date.now() },
            { new: true }
        );

        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        res.status(200).json({ message: 'Leave request updated successfully', leaveRequest });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createLeaveRequest,
    getEmployeeLeaves,
    getSingleLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest,
    getAllLeaveRequests,
    acceptOrRejectLeaveRequest,
};

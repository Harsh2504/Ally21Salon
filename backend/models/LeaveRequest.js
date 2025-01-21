// {
//     "_id": "uniqueLeaveId",
//     "userid": "uniqueUserId", // Reference to Users _id
//     "startDate": "2025-01-12T00:00:00Z",
//     "endDate": "2025-01-14T23:59:59Z",
//     "reason": "Marriage",
//     "description": "Lorem Ipsum...",
//     "status": "Pending", // Accepted, Rejected, Pending
//     "remark": null, // Optional field
//     "createdAt": "2025-01-19T12:00:00Z",
//     "updatedAt": "2025-01-19T12:00:00Z"
// }

const mongoose = require("mongoose");
const leaveSchema = mongoose.model("LeaveRequest", {
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "Pending",
    },
    remark: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = leaveSchema;
const { z } = require('zod');

// Common ObjectId schema
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

// Date validation
const dateSchema = z.string().refine((date) => {
  return !isNaN(Date.parse(date));
}, 'Invalid date format');

// Create leave request schema
const createLeaveRequestSchema = z.object({
  body: z.object({
    startDate: dateSchema,
    endDate: dateSchema,
    reason: z.string()
      .min(3, 'Reason must be at least 3 characters')
      .max(100, 'Reason cannot exceed 100 characters')
      .trim(),
    description: z.string()
      .max(500, 'Description cannot exceed 500 characters')
      .trim()
      .optional()
  }).refine((data) => {
    // Validate that endDate is after startDate
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  }, {
    message: 'End date must be on or after start date',
    path: ['endDate']
  }).refine((data) => {
    // Validate that startDate is not in the past
    const start = new Date(data.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return start >= today;
  }, {
    message: 'Start date cannot be in the past',
    path: ['startDate']
  })
});

// Update leave request schema (for managers)
const updateLeaveRequestSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    status: z.enum(['Pending', 'Approved', 'Rejected']),
    remark: z.string()
      .max(300, 'Remark cannot exceed 300 characters')
      .trim()
      .optional()
  })
});

// Get leave requests query schema
const getLeaveRequestsSchema = z.object({
  query: z.object({
    status: z.enum(['Pending', 'Approved', 'Rejected']).optional(),
    userid: objectIdSchema.optional(),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    page: z.union([
      z.string().regex(/^\d+$/, 'Page must be a number').transform(Number),
      z.number().int().min(1)
    ]).optional().default(1),
    limit: z.union([
      z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number),
      z.number().int().min(1).max(100)
    ]).optional().default(10)
  })
});

// Leave request ID param schema
const leaveRequestIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

// Employee leave requests query schema
const getMyLeaveRequestsSchema = z.object({
  query: z.object({
    status: z.enum(['Pending', 'Approved', 'Rejected']).optional(),
    page: z.union([
      z.string().regex(/^\d+$/, 'Page must be a number').transform(Number),
      z.number().int().min(1)
    ]).optional().default(1),
    limit: z.union([
      z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number),
      z.number().int().min(1).max(100)
    ]).optional().default(10)
  })
});

module.exports = {
  createLeaveRequestSchema,
  updateLeaveRequestSchema,
  getLeaveRequestsSchema,
  leaveRequestIdSchema,
  getMyLeaveRequestsSchema
};
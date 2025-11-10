const { z } = require('zod');

// Common ObjectId schema
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

// Time validation (HH:mm format)
const timeSchema = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:mm format');

// Date validation
const dateSchema = z.string().refine((date) => {
  return !isNaN(Date.parse(date));
}, 'Invalid date format');

// Shift creation schema
const createShiftSchema = z.object({
  body: z.object({
    employeeId: objectIdSchema,
    date: dateSchema,
    startTime: timeSchema,
    endTime: timeSchema,
    shiftType: z.enum(['Regular', 'Overtime', 'Weekend', 'Holiday']).default('Regular'),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
    services: z.array(z.object({
      serviceId: objectIdSchema,
      serviceName: z.string().optional()
    })).optional().default([]),
    breakTime: z.object({
      duration: z.number().min(0).max(120), // minutes
      startTime: timeSchema.optional(),
      endTime: timeSchema.optional()
    }).optional()
  }).refine((data) => {
    // Validate that endTime is after startTime
    const start = new Date(`2000-01-01T${data.startTime}:00`);
    const end = new Date(`2000-01-01T${data.endTime}:00`);
    return end > start;
  }, {
    message: 'End time must be after start time',
    path: ['endTime']
  })
});

// Shift update schema
const updateShiftSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    employeeId: objectIdSchema.optional(),
    date: dateSchema.optional(),
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
    status: z.enum(['Scheduled', 'Completed', 'Cancelled', 'No-Show']).optional(),
    shiftType: z.enum(['Regular', 'Overtime', 'Weekend', 'Holiday']).optional(),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
    services: z.array(z.object({
      serviceId: objectIdSchema,
      serviceName: z.string().optional()
    })).optional(),
    breakTime: z.object({
      duration: z.number().min(0).max(120),
      startTime: timeSchema.optional(),
      endTime: timeSchema.optional()
    }).optional()
  })
});

// Shift query schema
const getShiftsSchema = z.object({
  query: z.object({
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    employeeId: objectIdSchema.optional(),
    status: z.enum(['Scheduled', 'Completed', 'Cancelled', 'No-Show']).optional(),
    page: z.union([
      z.string().regex(/^\d+$/, 'Page must be a number').transform(Number),
      z.number().int().min(1)
    ]).optional().default(1),
    limit: z.union([
      z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number),
      z.number().int().min(1).max(100)
    ]).optional().default(50)
  })
});

// Shift ID param schema
const shiftIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

// Clock in/out schema
const clockInOutSchema = z.object({
  params: z.object({
    id: objectIdSchema
  }),
  body: z.object({
    action: z.enum(['in', 'out']),
    location: z.string().min(1).max(100).optional().default('Salon')
  })
});

// Shift stats query schema
const shiftStatsSchema = z.object({
  query: z.object({
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    employeeId: objectIdSchema.optional()
  })
});

module.exports = {
  createShiftSchema,
  updateShiftSchema,
  getShiftsSchema,
  shiftIdSchema,
  clockInOutSchema,
  shiftStatsSchema
};
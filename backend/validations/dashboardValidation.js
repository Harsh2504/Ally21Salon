const { z } = require('zod');

// Dashboard stats query schema
const dashboardStatsSchema = z.object({
  query: z.object({
    period: z.enum(['week', 'month', 'quarter']).optional().default('week')
  })
});

// Revenue query schema
const revenueSchema = z.object({
  query: z.object({
    period: z.enum(['week', 'month', 'quarter']).optional().default('week')
  })
});

// Popular services query schema
const popularServicesSchema = z.object({
  query: z.object({
    limit: z.union([
      z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number),
      z.number().int().min(1).max(100)
    ]).optional().default(5)
  })
});

// Recent bookings query schema
const recentBookingsSchema = z.object({
  query: z.object({
    limit: z.union([
      z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number),
      z.number().int().min(1).max(100)
    ]).optional().default(5)
  })
});

module.exports = {
  dashboardStatsSchema,
  revenueSchema,
  popularServicesSchema,
  recentBookingsSchema
};
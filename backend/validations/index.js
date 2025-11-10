const { z } = require('zod');

// Common pagination schema that accepts both strings and numbers
const paginationSchema = {
  page: z.union([
    z.string().regex(/^\d+$/, 'Page must be a number').transform(Number),
    z.number().int().min(1)
  ]).optional().default(1),
  limit: z.union([
    z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number),
    z.number().int().min(1).max(100)
  ]).optional().default(10)
};

// Central export for all validation schemas
const serviceValidation = require('./serviceValidation');
const shiftValidation = require('./shiftValidation');
const settingsValidation = require('./settingsValidation');
const notificationValidation = require('./notificationValidation');
const dashboardValidation = require('./dashboardValidation');
const authValidation = require('./authValidation');
const leaveValidation = require('./leaveValidation');

module.exports = {
  paginationSchema,
  service: serviceValidation,
  shift: shiftValidation,
  settings: settingsValidation,
  notification: notificationValidation,
  dashboard: dashboardValidation,
  auth: authValidation,
  leave: leaveValidation
};
const { z } = require('zod');

// User registration schema
const registerSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .trim(),
    email: z.string()
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    phone: z.string()
      .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
      .trim(),
    password: z.string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    role: z.enum(['employee', 'manager']).optional().default('employee')
  })
});

// User login schema
const loginSchema = z.object({
  body: z.object({
    email: z.string()
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    password: z.string()
      .min(1, 'Password is required')
  })
});

// Update user profile schema
const updateProfileSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .trim()
      .optional(),
    phone: z.string()
      .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
      .trim()
      .optional(),
    email: z.string()
      .email('Invalid email format')
      .toLowerCase()
      .trim()
      .optional()
  })
});

// Change password schema
const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
      .min(6, 'New password must be at least 6 characters')
      .max(100, 'New password cannot exceed 100 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required')
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })
});

// Forgot password schema
const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string()
      .email('Invalid email format')
      .toLowerCase()
      .trim()
  })
});

// Reset password schema
const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required')
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })
});

// Get users query schema
const getUsersSchema = z.object({
  query: z.object({
    role: z.enum(['employee', 'manager']).optional(),
    search: z.string().min(1).optional(),
    page: z.union([
      z.string().regex(/^\d+$/, 'Page must be a number').transform(Number),
      z.number().int().min(1)
    ]).optional().default(1),
    limit: z.union([
      z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number),
      z.number().int().min(1).max(100)
    ]).optional().default(10),
    isActive: z.enum(['true', 'false']).optional()
  })
});

// User ID param schema
const userIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  getUsersSchema,
  userIdSchema
};
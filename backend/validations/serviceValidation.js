const { z } = require('zod');

// Service creation schema
const createServiceSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, 'Service name must be at least 2 characters')
      .max(100, 'Service name cannot exceed 100 characters')
      .trim(),
    description: z.string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description cannot exceed 500 characters')
      .trim(),
    duration: z.number()
      .int('Duration must be an integer')
      .min(15, 'Duration must be at least 15 minutes')
      .max(480, 'Duration cannot exceed 8 hours'),
    price: z.number()
      .min(0, 'Price must be a positive number')
      .max(10000, 'Price cannot exceed 10,000'),
    category: z.enum(['Haircut', 'Coloring', 'Styling', 'Treatment', 'Nails', 'Facial', 'Massage', 'Other'], {
      errorMap: () => ({ message: 'Invalid service category' })
    }),
    image: z.string().url('Invalid image URL').optional().or(z.literal('')),
    requirements: z.array(z.string().trim()).optional().default([])
  })
});

// Service update schema
const updateServiceSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid service ID')
  }),
  body: z.object({
    name: z.string()
      .min(2, 'Service name must be at least 2 characters')
      .max(100, 'Service name cannot exceed 100 characters')
      .trim()
      .optional(),
    description: z.string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description cannot exceed 500 characters')
      .trim()
      .optional(),
    duration: z.number()
      .int('Duration must be an integer')
      .min(15, 'Duration must be at least 15 minutes')
      .max(480, 'Duration cannot exceed 8 hours')
      .optional(),
    price: z.number()
      .min(0, 'Price must be a positive number')
      .max(10000, 'Price cannot exceed 10,000')
      .optional(),
    category: z.enum(['Haircut', 'Coloring', 'Styling', 'Treatment', 'Nails', 'Facial', 'Massage', 'Other'], {
      errorMap: () => ({ message: 'Invalid service category' })
    }).optional(),
    image: z.string().url('Invalid image URL').optional().or(z.literal('')),
    requirements: z.array(z.string().trim()).optional(),
    isActive: z.boolean().optional()
  })
});

// Service query schema
const getServicesSchema = z.object({
  query: z.object({
    category: z.enum(['Haircut', 'Coloring', 'Styling', 'Treatment', 'Nails', 'Facial', 'Massage', 'Other']).optional(),
    isActive: z.enum(['true', 'false']).optional(),
    search: z.string().min(1).optional(),
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

// Service ID param schema
const serviceIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid service ID')
  })
});

module.exports = {
  createServiceSchema,
  updateServiceSchema,
  getServicesSchema,
  serviceIdSchema
};
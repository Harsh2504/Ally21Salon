const { z } = require('zod');

// Settings query schema
const getSettingsSchema = z.object({
  query: z.object({
    category: z.enum([
      'general',
      'notifications',
      'appearance',
      'schedule',
      'billing',
      'security',
      'integration'
    ]).optional()
  })
});

// Settings by category param schema
const settingsCategorySchema = z.object({
  params: z.object({
    category: z.enum([
      'general',
      'notifications',
      'appearance',
      'schedule',
      'billing',
      'security',
      'integration'
    ])
  })
});

// Update setting schema
const updateSettingSchema = z.object({
  body: z.object({
    key: z.string().min(1, 'Setting key is required'),
    value: z.union([
      z.string(),
      z.number(),
      z.boolean(),
      z.array(z.string()),
      z.object({}).passthrough()
    ]),
    category: z.enum([
      'general',
      'notifications',
      'appearance',
      'schedule',
      'billing',
      'security',
      'integration'
    ])
  })
});

// Bulk update settings schema
const bulkUpdateSettingsSchema = z.object({
  body: z.object({
    settings: z.array(z.object({
      key: z.string().min(1, 'Setting key is required'),
      value: z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.string()),
        z.object({}).passthrough()
      ]),
      category: z.enum([
        'general',
        'notifications',
        'appearance',
        'schedule',
        'billing',
        'security',
        'integration'
      ])
    })).min(1, 'At least one setting is required')
  })
});

// Export settings query schema
const exportSettingsSchema = z.object({
  query: z.object({
    category: z.enum([
      'general',
      'notifications',
      'appearance',
      'schedule',
      'billing',
      'security',
      'integration'
    ]).optional()
  })
});

module.exports = {
  getSettingsSchema,
  settingsCategorySchema,
  updateSettingSchema,
  bulkUpdateSettingsSchema,
  exportSettingsSchema
};
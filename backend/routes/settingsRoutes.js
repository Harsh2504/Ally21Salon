const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validateQuery, validateParams, validateBody } = require('../middlewares/zodValidation');
const { settings } = require('../validations');
const {
  getSettings,
  getSettingsByCategory,
  updateSetting,
  bulkUpdateSettings,
  resetSettings,
  initializeSettings,
  exportSettings
} = require('../controllers/settingsController');

// @route   GET /api/settings
// @desc    Get all settings or filter by category
// @access  Private
router.get('/', protect, validateQuery(settings.getSettingsSchema.shape.query), getSettings);

// @route   GET /api/settings/category/:category
// @desc    Get settings by category
// @access  Private
router.get('/category/:category', protect, validateParams(settings.settingsCategorySchema.shape.params), getSettingsByCategory);

// @route   PUT /api/settings
// @desc    Update a single setting
// @access  Private
router.put('/', protect, validateBody(settings.updateSettingSchema.shape.body), updateSetting);

// @route   PUT /api/settings/bulk
// @desc    Bulk update settings
// @access  Private
router.put('/bulk', protect, validateBody(settings.bulkUpdateSettingsSchema.shape.body), bulkUpdateSettings);

// @route   DELETE /api/settings/reset/:category
// @desc    Reset settings to default for a category
// @access  Private (Manager for global, any user for personal)
router.delete('/reset/:category', protect, validateParams(settings.settingsCategorySchema.shape.params), resetSettings);

// @route   POST /api/settings/initialize
// @desc    Initialize default settings (run once)
// @access  Private (Manager only)
router.post('/initialize', protect, authorize('manager'), initializeSettings);

// @route   GET /api/settings/export
// @desc    Export settings as JSON
// @access  Private
router.get('/export', protect, validateQuery(settings.exportSettingsSchema.shape.query), exportSettings);

module.exports = router;
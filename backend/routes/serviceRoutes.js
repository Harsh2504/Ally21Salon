const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceCategories,
} = require('../controllers/serviceController');
const { getPopularServices } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validate, validateQuery, validateParams } = require('../middlewares/zodValidation');
const { service } = require('../validations');

// Public routes
router.get('/categories', getServiceCategories);
router.get('/popular', protect, authorize('manager'), validate(service.getServicesSchema), getPopularServices);
router.get('/', validate(service.getServicesSchema), getServices);
router.get('/:id', validateParams(service.serviceIdSchema.shape.params), getServiceById);

// Protected routes (Manager only)
router.post('/', protect, authorize('manager'), validate(service.createServiceSchema), createService);
router.put('/:id', protect, authorize('manager'), validate(service.updateServiceSchema), updateService);
router.delete('/:id', protect, authorize('manager'), validateParams(service.serviceIdSchema.shape.params), deleteService);

module.exports = router;
# Zod Validation Implementation

This project has been migrated from `express-validator` to `Zod` for input validation. Zod provides better TypeScript support, runtime type safety, and more intuitive schema definitions.

## Structure

### Validation Files

All validation schemas are located in the `/validations` directory:

- `authValidation.js` - User authentication and profile validation
- `serviceValidation.js` - Service management validation  
- `shiftValidation.js` - Employee shift validation
- `leaveValidation.js` - Leave request validation
- `notificationValidation.js` - Notification management validation
- `settingsValidation.js` - Application settings validation
- `dashboardValidation.js` - Dashboard query validation
- `index.js` - Central exports for all validations

### Middleware

- `zodValidation.js` - Zod validation middleware with helper functions

## Usage Examples

### Basic Body Validation

```javascript
const { validateBody } = require('../middlewares/zodValidation');
const { auth } = require('../validations');

router.post('/register', validateBody(auth.registerSchema.shape.body), registerUser);
```

### Full Request Validation (body + params + query)

```javascript
const { validate } = require('../middlewares/zodValidation');
const { service } = require('../validations');

router.put('/:id', validate(service.updateServiceSchema), updateService);
```

### Individual Section Validation

```javascript
const { validateParams, validateQuery } = require('../middlewares/zodValidation');
const { shift } = require('../validations');

// Validate only params
router.get('/:id', validateParams(shift.shiftIdSchema.shape.params), getShiftById);

// Validate only query parameters
router.get('/', validateQuery(shift.getShiftsSchema.shape.query), getShifts);
```

## Validation Features

### Built-in Transformations

Zod automatically transforms data types:
- String numbers to actual numbers
- String booleans to actual booleans
- Date strings to Date objects (with validation)

### Custom Validations

```javascript
.refine((data) => {
  // Custom validation logic
  return data.endTime > data.startTime;
}, {
  message: 'End time must be after start time',
  path: ['endTime']
})
```

### Error Handling

Validation errors are automatically formatted into a consistent structure:

```javascript
{
  "error": "Validation failed",
  "details": [
    {
      "field": "body.email",
      "message": "Invalid email format",
      "code": "invalid_string"
    }
  ]
}
```

## Schema Types

### Common Patterns

#### ObjectId Validation
```javascript
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');
```

#### Date Validation
```javascript
const dateSchema = z.string().refine((date) => {
  return !isNaN(Date.parse(date));
}, 'Invalid date format');
```

#### Time Validation (HH:mm format)
```javascript
const timeSchema = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:mm format');
```

#### Enum Validation
```javascript
z.enum(['Pending', 'Approved', 'Rejected'], {
  errorMap: () => ({ message: 'Invalid status' })
})
```

## Migration Benefits

1. **Type Safety**: Better runtime type checking
2. **Transformations**: Automatic data type conversions
3. **Composability**: Easy to combine and extend schemas
4. **Error Messages**: More descriptive error formatting
5. **Performance**: Better performance than express-validator
6. **Developer Experience**: More intuitive API and better IDE support

## Best Practices

1. **Use specific validation**: Validate exactly what you need (body, params, or query)
2. **Custom error messages**: Provide clear, user-friendly error messages
3. **Use transformations**: Let Zod handle type conversions automatically
4. **Validate early**: Apply validation at the route level before controller logic
5. **Consistent schemas**: Reuse common validation patterns across different endpoints

## Controllers

All controllers have been updated to remove `validationResult` checks since Zod validation happens at the middleware level and prevents invalid data from reaching controllers.

## Routes

All route files have been updated to use the new Zod validation middleware:

- ✅ `authRoutes.js` - Authentication routes
- ✅ `serviceRoutes.js` - Service management routes
- ✅ `shiftRoutes.js` - Shift management routes
- ✅ `leaveRoutes.js` - Leave request routes
- ✅ `notificationRoutes.js` - Notification routes
- ✅ `settingsRoutes.js` - Settings routes
- ✅ `dashboardRoutes.js` - Dashboard routes
- ✅ `userRoutes.js` - User management routes
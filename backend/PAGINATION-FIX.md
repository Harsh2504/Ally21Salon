# Pagination Validation Fix

## Problem
The Zod validation schemas were expecting `page` and `limit` query parameters as strings only, but the frontend was sometimes sending them as numbers, causing validation errors:

```json
{
  "error": "Validation failed",
  "details": [
    {"field": "page", "message": "Expected string, received number", "code": "invalid_type"},
    {"field": "limit", "message": "Expected string, received number", "code": "invalid_type"}
  ]
}
```

## Solution
Updated all validation schemas to accept both string and number inputs for pagination parameters using Zod's `union` type with automatic transformation:

```javascript
page: z.union([
  z.string().regex(/^\d+$/, 'Page must be a number').transform(Number),
  z.number().int().min(1)
]).optional().default(1),
limit: z.union([
  z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number),
  z.number().int().min(1).max(100)
]).optional().default(10)
```

## Files Updated

### 1. validations/index.js
- Added common `paginationSchema` for reuse across all validation files

### 2. validations/serviceValidation.js
- Updated `getServicesSchema` to use flexible pagination

### 3. validations/shiftValidation.js
- Updated shift query schema pagination

### 4. validations/notificationValidation.js
- Updated `getNotificationsSchema` pagination

### 5. validations/authValidation.js
- Updated `getUsersSchema` pagination

### 6. validations/leaveValidation.js
- Updated both `getLeaveRequestsSchema` and `getMyLeaveRequestsSchema` pagination

### 7. validations/dashboardValidation.js
- Updated `popularServicesSchema` and `recentBookingsSchema` limit parameters

## Benefits

1. **Flexible Input**: Accepts both string and number inputs
2. **Type Safety**: Automatically converts strings to numbers
3. **Validation**: Still validates that strings are numeric
4. **Consistent Behavior**: All pagination works the same way across the API
5. **Error Prevention**: No more type mismatch errors for pagination

## Usage Examples

Now these will all work:

```javascript
// String inputs
{ page: '1', limit: '10' }

// Number inputs
{ page: 1, limit: 10 }

// Mixed inputs
{ page: '1', limit: 10 }

// Defaults when omitted
{}  // → { page: 1, limit: 10 }
```

## Testing
Created `test-pagination.js` to verify the validation works correctly with various input types.

## Next Steps
- Test the API endpoints to ensure they work with both string and number pagination parameters
- The validation will now be more robust and handle frontend inputs correctly
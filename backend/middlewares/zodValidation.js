const { z } = require('zod');

/**
 * Middleware to validate request data using Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Parse the request data (body, params, query) against the schema
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });

      // Update req with parsed/transformed data
      req.body = parsed.body || req.body;
      req.params = parsed.params || req.params;
      req.query = parsed.query || req.query;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format Zod errors into a user-friendly format
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          error: 'Validation failed',
          details: formattedErrors
        });
      }

      // Handle unexpected errors
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        error: 'Internal server error during validation'
      });
    }
  };
};

/**
 * Validate only request body using Zod schema
 * @param {z.ZodSchema} schema - Zod schema for body validation
 * @returns {Function} Express middleware function
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          error: 'Validation failed',
          details: formattedErrors
        });
      }

      console.error('Body validation error:', error);
      return res.status(500).json({
        error: 'Internal server error during validation'
      });
    }
  };
};

/**
 * Validate only request params using Zod schema
 * @param {z.ZodSchema} schema - Zod schema for params validation
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          error: 'Validation failed',
          details: formattedErrors
        });
      }

      console.error('Params validation error:', error);
      return res.status(500).json({
        error: 'Internal server error during validation'
      });
    }
  };
};

/**
 * Validate only request query using Zod schema
 * @param {z.ZodSchema} schema - Zod schema for query validation
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.query);
      req.query = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return res.status(400).json({
          error: 'Validation failed',
          details: formattedErrors
        });
      }

      console.error('Query validation error:', error);
      return res.status(500).json({
        error: 'Internal server error during validation'
      });
    }
  };
};

module.exports = {
  validate,
  validateBody,
  validateParams,
  validateQuery
};
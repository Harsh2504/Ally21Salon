const { verifyToken } = require('../utils/jwtHelper');

// Middleware to protect routes (check JWT)
const protect = (req, res, next) => {
    // Get token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // If no token, return 401 Unauthorized error
    if (!token) {
        return res.status(401).json({ error: 'Authorization required' });
    }

    try {
        // Verify the token and attach user info to req.user
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        req.user = decoded;  // Assuming payload contains user info (like _id)
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        // If the token is invalid or expired, return 401 Unauthorized error
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Middleware to authorize specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authorization required' });
        }

        // Case-insensitive role checking
        const userRole = req.user.role.toLowerCase();
        const requiredRoles = roles.map(role => role.toLowerCase());
        const roleMatch = requiredRoles.includes(userRole);

        if (!roleMatch) {
            return res.status(403).json({ 
                error: `Access denied. Required role: ${roles.join(' or ')}. Current role: ${req.user.role}` 
            });
        }

        next();
    };
};

// Legacy function for backward compatibility
const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        // Get token from Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // If no token, return 401 Unauthorized error
        if (!token) {
            return res.status(401).json({ error: 'Authorization required' });
        }

        try {
            // Verify the token and attach user info to req.user
            const decoded = verifyToken(token, process.env.JWT_SECRET);
            req.user = decoded;  // Assuming payload contains user info (like _id)

            // Role-based access control (case-insensitive)
            if (roles.length) {
                const userRole = req.user.role.toLowerCase();
                const requiredRoles = roles.map(role => role.toLowerCase());
                if (!requiredRoles.includes(userRole)) {
                    return res.status(403).json({ error: 'Access denied' });
                }
            }

            next();  // Proceed to the next middleware or route handler
        } catch (error) {
            // If the token is invalid or expired, return 401 Unauthorized error
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    };
};

module.exports = {
    protect,
    authorize,
    authMiddleware
};

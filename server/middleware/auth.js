const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            // For development, allow requests without token
            if (process.env.NODE_ENV === 'development') {
                req.user = { id: 'dev-user', role: 'admin' };
                return next();
            }
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            req.user = { id: 'dev-user', role: 'admin' };
            return next();
        }
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

module.exports = { authMiddleware, adminMiddleware };
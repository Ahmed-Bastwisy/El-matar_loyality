const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    // Exclude routes that contain '/register' or '/login'
    const publicPaths = ['/register', '/login'];
    const isPublicPath = publicPaths.some(path => req.path.includes(path));

    if (isPublicPath) {
        return next(); // Skip authentication for public routes
    }
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Auth failed' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Auth failed' });
    }
};

module.exports = checkAuth;

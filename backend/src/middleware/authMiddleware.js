import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res
                .status(401)
                .json({ message: 'Missing authorization header' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res
                .status(401)
                .json({ message: 'Invalid authorization header' });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: 'Internal server error' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res
            .status(403)
            .json({ message: 'Unauthorized' });
    }
    next();
};

export const isAdminOrOperator = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'operador') {
        return res
            .status(401)
            .json({ message: 'Unauthorized' });
    }
    next();
};
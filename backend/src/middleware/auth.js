import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_traffic_control_system_token_key_12345';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized: Access token is missing' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User context missing' });
    }

    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }
  };
};

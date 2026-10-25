const jwt = require('jsonwebtoken');

// Checks the login token and saves the logged in user on req.user.
// It runs before every route that needs a logged in user.
module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  // The token must come as "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // If the token is real, save the user info on req.user for the next function
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

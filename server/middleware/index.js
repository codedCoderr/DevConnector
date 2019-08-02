const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const jwtsecret = process.env.jwtsecret;
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).json('No token, authorization denied');
    }
    const decoded = jwt.verify(token, jwtsecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json('Token is not valid');
  }
};

const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const jwtsecret = process.env.jwtsecret;
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({msg:'No token, authorization denied'});
  }
  try {
    const decoded = jwt.verify(token, jwtsecret);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({msg:'Token is not valid'});
  }
};

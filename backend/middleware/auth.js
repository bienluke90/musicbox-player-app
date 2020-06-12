require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    return next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid Token' });
  }
};

module.exports = auth;

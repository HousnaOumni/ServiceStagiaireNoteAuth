const jwt = require('jsonwebtoken');

module.exports = async function isAuthenticated(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  jwt.verify(token, "secret", (err, stg) => {
    if (err) {
      return res.status(401).json({ message: err });
    } else {
      req.stg = stg;
      next();
    }
  });
};

const jwt = require("jsonwebtoken");

const generateToken = (user, expiry, secretKey) => {
  return jwt.sign(user, secretKey, {
    expiresIn: expiry,
  });
};

module.exports = {
  generateToken,
};

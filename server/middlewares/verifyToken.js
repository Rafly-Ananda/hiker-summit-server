const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;
const { generateToken } = require("../helpers/generateToken");
const { JWT_ACCESS_EXPIRATION } = require("../configs/config");

const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;

  //TODO : db or cache checking for refresh token

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SEC, (err, user) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(406).json({ message: "Refresh Token Expired" });
      }
      return res.status(403).json({ message: "No Token Presence In Cookie" });
    }

    const accessToken = generateToken(
      {
        id: user._id,
        is_admin: user.is_admin,
      },
      JWT_ACCESS_EXPIRATION,
      process.env.JWT_ACCESS_SEC
    );

    req.accessToken = accessToken;
    next();
  });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "No Token Provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_ACCESS_SEC, (err, user) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(403).json({ message: "Access Token Expired" });
      }
      return res.status(403).json({ message: "Not Authenticated" });
    }
    req.user = user;
    next();
  });
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.is_admin) {
      console.log(req.user.is_admin);
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.is_admin) {
      next();
    } else {
      return res.status(403).json({
        message: "Admin Access",
      });
    }
  });
};

module.exports = {
  verifyToken,
  verifyRefreshToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};

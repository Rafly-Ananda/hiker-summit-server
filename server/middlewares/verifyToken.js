const jwt = require("jsonwebtoken");

// TODO : Implement Refresh Token

// ? Here we just verify the token to acces basic setting like add cart when shopping ( NEED TO LOG IN )
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        res.status(403).json("Token Expires / Not Valid.");
        return;
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("Not Authenticated.");
  }
};

// ? This is used for update or delete account/reviews/destination because system needs to know if the right person logged in actually can mutate the data ( NEED TO LOG IN & Attached User_id in query params )
const verifyTokenAndAuthorization = (req, res, next) => {
  //  ? how we get or set the req.user is in the verifyToken, and in this function the verify token is executed first then the callback comes in, so in the callback we can acces the req.user param
  verifyToken(req, res, () => {
    if (req.user.id === req.params.user_id || req.user.is_admin) {
      next();
    } else {
      res.status(403).json("Not Authorized.");
      return;
    }
  });
};

// ? this will check the token inside header token payload
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.is_admin) {
      next();
    } else {
      res.status(403).json({
        message: "Need Admin Access.",
      });
      return;
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};

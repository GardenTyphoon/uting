const jwt = require("jsonwebtoken");

const adminAuthMiddleware = (req, res, next) => {
  // read the token from header or url
  const token = req.headers["x-access-token"] || req.query.token;
  var isAdmin = false;
  // token does not exist

  jwt.verify(token, req.app.get("jwt-secret"), (err, decoded) => {
    if (decoded.name === "admin") isAdmin = true;
  });
  if (!token || !isAdmin) {
    console.log("token is not existed!@!@");
    return res.status(401).json({
      success: false,
      message: "not logged in",
    });
  }
  // create a promise that decodes the token
  const p = new Promise((resolve, reject) => {
    jwt.verify(token, req.app.get("jwt-secret"), (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });

  // if it has failed to verify, it will return an error message
  const onError = (error) => {
    console.log("token invalid !!");
    res.status(401).json({
      success: false,
      message: error.message,
    });
  };

  // process the promise
  p.then((decoded) => {
    req.decoded = decoded;
    next();
  }).catch(onError);
};

module.exports = adminAuthMiddleware;

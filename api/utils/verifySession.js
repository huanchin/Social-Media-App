import errorHandler from "./error.js";

const verifySession = (req, res, next) => {
  console.log(req.sessionID);
  console.log(req.session);
  if (!req.session.user) {
    return next(errorHandler(401, "you are not logged in"));
  }
  next();
};

export default verifySession;

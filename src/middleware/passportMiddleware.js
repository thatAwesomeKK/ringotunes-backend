import passport from "passport";

export default function (req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      const err = {};
      err.status = 400;
      err.code = "Unauthorized";

      return res.json(err); // send the error response to client
    }
    req.user = user;
    return next(); // continue to next middleware if no error.
  })(req, res, next);
}

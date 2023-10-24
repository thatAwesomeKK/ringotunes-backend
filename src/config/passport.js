import { Strategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js";
const { fromExtractors } = ExtractJwt;

const PUB_KEY = process.env.JWT_AUTH_PUB_KEY;

const cookieExtractor = (req) => {
  let jwt = null;
  if (req && req.cookies) {
    jwt = req.cookies["accessToken"];
    jwt = jwt.split(" ")[1];
  }
  return jwt;
};

const options = {
  jwtFromRequest: fromExtractors([cookieExtractor]),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const strategy = new Strategy(options, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

export function passportConfig(passport) {
  passport.use(strategy);
}

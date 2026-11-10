const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJTW = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const prisma = require('../lib/prisma');

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJTW.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		},
		async (payload, done) => {
			console.log(payload);
			const user = await prisma.user.findUnique({
				where: { id: payload.userId },
			});
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		},
	),
);

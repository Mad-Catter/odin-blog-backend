const express = require('express');
const postRouter = require('./routers/postRouter');
const userRouter = require('./routers/userRouter');
const sessionRouter = require('./routers/sessionRouter');
require('./config/passport');
const passport = require('passport');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// This adds the req.user if the user has a token but simply moves on if the user does not instead of giving them an error.
// This is because I want the non-users to view posts but only be able to comment if they are logged in.  This will need to be decided on a per page basis using req.user.
app.use((req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (err) return next(err);
		if (user) req.user = user;
		next();
	})(req, res, next);
});
app.use('/session', sessionRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);

app.use('/', (req, res) => {
	if (req.user) {
		res.json({ user: req.user });
	} else {
		res.json({ message: 'no user' });
	}
});
app.listen(port, () => {
	console.log(`listening on port:`, port);
});

const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');
const getJWT = (user) => {
	const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	});
	return token;
};

const requireUser = (req, res, next) => {
	if (!req.user) return res.status(401).json({ message: 'You must be logged in to do this action.' });
	next();
};
const requireAuthor = (req, res, next) => {
	if (!req.user.postAuthor)
		return res.status(403).json({ message: 'You must be a verified post author for this function.' });
	next();
};

module.exports = { getJWT, requireUser, requireAuthor };

const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');
const getJWT = (user) => {
	const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	});
	return token;
};

const requireAuth = (req, res, next) => {
	if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
	next();
};

module.exports = { getJWT, requireAuth };

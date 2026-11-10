const prisma = require('../lib/prisma');
const { getJWT } = require('./helpers');
const { body, validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcryptjs');

const login = [
	[
		body('username').isLength({ min: 1 }).withMessage('Invalid username length.'),
		body('password').isLength({ min: 1 }).withMessage('Invalid password length.'),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ message: 'Failed to login', errors });
		}
		const { username, password } = matchedData(req);
		const user = await prisma.user.findUnique({
			where: { username },
		});
		if (!user) {
			return res.status(400).json({ message: 'Invalid username or password' });
		}
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(400).json({ message: 'Invalid username or password' });
		}
		const token = getJWT(user);
		res.status(200).json({ token });
	},
];

// I think this is unrequired and should just be handled client side?
const logout = async (req, res) => {};

module.exports = {
	login,
	logout,
};

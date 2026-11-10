const prisma = require('../lib/prisma');
const { getJWT } = require('./helpers');
const { body, validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcryptjs');

// Currently I do not know if I want users to be able to be retrieved.
const getUser = async (req, res) => {};

const newUserValidation = [
	body('username')
		.trim()
		.custom(async (username) => {
			const match = await prisma.user.findUnique({
				where: {
					username,
				},
			});
			if (match) {
				throw new Error('Username already taken.');
			}
		})
		.withMessage('Username already taken.'),
	body('password').trim().isLength({ min: 1 }).withMessage('Invalid password.'),
	body('confirmPassword')
		.trim()
		.custom((confirmPassword, { req }) => confirmPassword === req.body.password.trim())
		.withMessage('Password and confirm password do not match.'),
];
const createUser = [
	newUserValidation,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ message: 'Failed to create user', errors });
		}
		const { username, password } = matchedData(req);
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				username,
				password: hashedPassword,
			},
		});
		const token = getJWT(user);
		res.status(200).json({ token });
	},
];

module.exports = {
	getUser,
	createUser,
};

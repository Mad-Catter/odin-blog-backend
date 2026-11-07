const { Router } = require('express');
const sessionRouter = Router();
const sessionController = require('../controllers/sessionController');

sessionRouter.post('/session', sessionController.login);
sessionRouter.delete('/session', sessionController.logout);

module.exports = sessionRouter;

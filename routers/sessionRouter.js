const { Router } = require('express');
const sessionRouter = Router();
const sessionController = require('../controllers/sessionController');

sessionRouter.post('/', sessionController.login);
sessionRouter.delete('/', sessionController.logout);

module.exports = sessionRouter;

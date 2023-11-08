const {Router} = require('express');
const router = Router();
const authController = require('../Controllers/authController.js');
// const authMiddleware = require('../Middleware/authMiddleware.js');


router.post('/api/auth/org/login', async(req, res, next) => {
    authController.orgLoginHandler(req, res, next);
})

router.post('/api/auth/org/signup', async(req, res, next) => {
    authController.orgSignupHandler(req, res, next);
})

router.post('/api/auth/dev/login', async(req, res, next) => {
    authController.devLoginHandler(req, res, next);
})

router.post('/api/auth/dev/signup', async(req, res, next) => {
    authController.devSignupHandler(req, res, next);
})

module.exports = router;
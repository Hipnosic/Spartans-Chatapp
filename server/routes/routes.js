const { Router } = require('express');
const controller = require('../controllers/controllers');
const router = Router();
router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.get('/logout', controller.logout)
router.get('/verifyuser', controller.verifyuser)

module.exports = router;
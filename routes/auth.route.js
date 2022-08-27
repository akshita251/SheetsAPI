const router = require('express').Router()
const authController = require('../controllers/auth.controller')

router.get('/login', authController.login)
router.get('/google', authController.google)

module.exports = router
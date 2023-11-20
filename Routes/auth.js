const express = require('express')
const router = express.Router()
const validator  = require('../middleware/validator')
const authRoutes = require('../controllers/auth')

router.get('/login',authRoutes.getLogin)

router.post('/login',
validator.checkEmail(),
validator.checkPassword(),
authRoutes.postlogin)

router.post('/logout',authRoutes.postlogout)

router.get('/signup',authRoutes.getSignup)

router.post('/signup',
validator.checkEmail(),
validator.checkPassword(),
validator.checkConfirmPassword(),
authRoutes.postSignup)

router.get('/reset',authRoutes.getReset)

router.post('/reset',authRoutes.postReset)

router.get('/reset/:resetToken',authRoutes.getUpdatingPassword)

router.post('/new-password',validator.checkPassword(),authRoutes.postUpdatingPassword)

module.exports = router
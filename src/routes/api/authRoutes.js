const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT } = require('../../middlewares');
const { login, loginGoogle, renovateToken } = require('../../controllers/AuthController');

const router = Router();

// POST api/v1/auth/login
router.post('/login', [
  check('email', 'The email is required').isEmail(),
  check('password', 'The password is required').not().isEmpty(),
  validateFields
], login);

// POST api/v1/auth/login-google
router.post('/login-google', [
  check('idToken', 'idToken is required').not().isEmpty(),
  validateFields
], loginGoogle);

// GET api/v1/auth/renovate-token
router.get('/renovate-token', validateJWT, renovateToken);

module.exports = router;

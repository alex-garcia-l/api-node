const { Router } = require('express');
const { check } = require('express-validator');

const {
  validateFields,
  validateJWT,
  isAdminRole,
  hasRole
} = require('../../middlewares');

const { index, store, show, update, destroy } = require('../../controllers/UserController');
const { existEmail, isRoleValid, existUserById } = require('../../helpers/db-validator');

const router = Router();

// GET api/v1/users
router.get('/', index);

// POST api/v1/users
router.post('/', [
  check('name', 'Invalid name.').not().isEmpty(),
  check('email', 'Invalid email.').isEmail(),
  check('password', 'Password must have a minimum of 6 characters.').isLength({ min: 6 }),
  check('email').custom(existEmail),
  check('role').custom(isRoleValid),
  validateFields
], store);

// GET api/v1/users/:id
router.get('/:id', show);

// GET api/v1/users/:id
router.put('/:id', [
  check('id', 'Not is a ID valid').isMongoId().bail(),
  check('id').custom(existUserById),
  check('role').custom(isRoleValid),
  validateFields
], update);

// DELETE api/v1/users/:id
router.delete('/:id', [
  validateJWT,
  // isAdminRole,
  hasRole('USER', 'SALES'),
  check('id', 'Not is a ID valid').isMongoId().bail(),
  check('id').custom(existUserById),
  validateFields
], destroy);

module.exports = router;

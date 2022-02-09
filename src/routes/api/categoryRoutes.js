const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT, isAdminRole } = require('../../middlewares');
const { index, store, show, update, destroy } = require('../../controllers/CategoryController');
const { existCategoryById } = require('../../helpers/db-validator');

const router = Router();

// GET api/v1/categories
router.get('/', index);

// POST api/v1/categories
router.post('/', [
  validateJWT,
  check('name', 'Name is required').not().isEmpty(),
  validateFields
], store);

// GET api/v1/categories/:id
router.get('/:id', [
  check('id', 'Not is a ID valid').isMongoId().bail(),
  check('id').custom(existCategoryById),
  validateFields
], show);

// PUT api/v1/categories/:id
router.put('/:id', [
  validateJWT,
  check('id', 'Not is a ID valid').isMongoId().bail(),
  check('id').custom(existCategoryById),
  check('name', 'Name is required').not().isEmpty(),
  validateFields
], update);

// DELETE api/v1/categories/:id
router.delete('/:id', [
  validateJWT,
  check('id', 'Not is a ID valid').isMongoId().bail(),
  check('id').custom(existCategoryById),
  isAdminRole,
  validateFields
], destroy);

module.exports = router;

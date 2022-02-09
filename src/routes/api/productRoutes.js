const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateJWT, isAdminRole } = require('../../middlewares');
const { index, store, show, update, destroy } = require('../../controllers/ProductController');
const { existCategoryById, existProductById } = require('../../helpers/db-validator');

const router = Router();

// GET api/v1/products
router.get('/', index);

// POST api/v1/products
router.post('/', [
  validateJWT,
  check('name', 'Name is required').not().isEmpty(),
  check('price', 'Price must be numeric').optional({ nullable: true }).isNumeric(),
  check('description', 'Description not is a string').optional({ nullable: true }).isString(),
  check('available', 'Available not is a boolean').optional({ nullable: true }).isBoolean(),
  check('category_id', 'Category_id not is a mongo ID').isMongoId().bail(),
  check('category_id').custom(existCategoryById),
  validateFields,
], store);

// GET api/v1/products/:id
router.get('/:id', [
  check('id', 'Not is a ID valid').isMongoId().bail(),
  check('id').custom(existProductById),
  validateFields,
], show);

// PUT api/v1/products/:id
router.put('/:id', [
  validateJWT,
  check('id', 'Not is a ID valid').isMongoId().bail(),
  check('id').custom(existProductById),
  check('name', 'Name is required').optional({ nullable: true }).isString(),
  check('price', 'Price must be numeric').optional({ nullable: true }).isNumeric(),
  check('description', 'Description not is a string').optional({ nullable: true }).isString(),
  check('available', 'Available not is a boolean').optional({ nullable: true }).isBoolean(),
  check('category_id', 'Category_id not is a mongo ID').optional({ nullable: true }).isMongoId().bail(),
  check('category_id').optional({ nullable: true }).custom(existCategoryById),
  validateFields,
], update);

// DELETE api/v1/products/:id
router.delete('/:id', [
  validateJWT,
  check('id', 'Not is a ID valid').isMongoId().bail(),
  check('id').custom(existProductById),
  isAdminRole,
  validateFields
], destroy);

module.exports = router;

const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../../middlewares');

const { 
  uploadOne,
  uploadFileByCollection,
  getFile,
  uploadFileByCollectionCloudinary
} = require('../../controllers/UploadController');
const { allowedCollections } = require('../../helpers/db-validator');

const router = Router();
const collections = ['users', 'products'];

// POST api/v1/uploads
router.post('/', uploadOne);

// PUT api/v1/uploads/:collection/:id
router.put('/:collection/:id', [
  check('id', ['id no is a mongo ID']).isMongoId(),
  check('collection').custom(collection => allowedCollections(collection, collections)),
  validateFields
], uploadFileByCollectionCloudinary);
// ], uploadFileByCollection);

// GET api/v1/uploads/:collection/:id
router.get('/:collection/:id', [
  check('id', ['id no is a mongo ID']).isMongoId(),
  check('collection').custom(collection => allowedCollections(collection, collections)),
  validateFields
], getFile);

module.exports = router;

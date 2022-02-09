const { Router } = require('express');

const { search } = require('../../controllers/SearchController');

const router = Router();

// GET api/v1/search/:collection/:term
router.get('/:collection/:term', search);

module.exports = router;

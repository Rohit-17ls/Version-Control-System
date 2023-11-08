const {Router} = require('express');
const router = Router();
const searchController = require('../Controllers/searchController.js');

router.get('/api/search/dev', async(req, res, next) => {
    searchController.searchDeveloper(req, res, next);
})


module.exports = router;
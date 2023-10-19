const {Router} = require('express');
const router = Router();

const projectController = require('../Controllers/projectController');


router.get('/api/project/:orgname/:projectName/:path(*)', async(req, res, next) => {
    projectController.resolveResources(req, res, next);
});

module.exports = router;
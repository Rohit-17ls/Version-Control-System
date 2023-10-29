const {Router} = require('express');
const router = Router();

const projectController = require('../Controllers/projectController');
const authMiddleware = require('../Middleware/authMiddleware.js');


router.get('/api/project/:orgname/:projectName/:branch/:path(*)', async(req, res, next) => {
    projectController.resolveResources(req, res, next);
});

router.get('/api/branches/:orgname/:projectName', async(req, res, next) => {
    projectController.getBranches(req, res, next);
})

router.get('/api/projects/:orgname', async(req, res, next) => {
    projectController.getProjects(req, res, next);
})

router.get('/api/developers/:projectName', async(req, res, next) => {
    projectController.getProjectDevelopers(req, res, next);
})

router.post('/api/new/project', authMiddleware.authMiddlewareForOrganization, async(req, res, next) => {
    projectController.createProject(req, res, next);
})


router.post('/api/addFiles', authMiddleware.authMiddleware, async(req, res, next) => {
    projectController.addFiles(req, res, next);
});

router.get('/api/:orgname/:projectName.git', async(req, res, next) => {
    projectController.sendZippedProject(req, res, next);
})

router.get('/api/search/project', async(req, res, next) => {
    projectController.searchProjects(req, res, next);
})

module.exports = router;
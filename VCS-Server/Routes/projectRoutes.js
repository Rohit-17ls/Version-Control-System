const {Router} = require('express');
const router = Router();

const ProjectController = require('../Controllers/projectController');
const authMiddleware = require('../Middleware/authMiddleware.js');



router.get('/api/project/:orgname/:projectName/:branch/:path(*)', async(req, res, next) => {
    ProjectController.resolveResources(req, res, next);
});


router.get('/api/commits/:orgname/:projectName/:skip/:count', async(req, res, next) => {
    ProjectController.getCommitInsights(req, res, next);
})

router.get('/api/branches/:orgname/:projectName', async(req, res, next) => {
    ProjectController.getBranches(req, res, next);
})

router.get('/api/projects/:orgname', async(req, res, next) => {
    ProjectController.getProjects(req, res, next);
})

router.get('/api/developers/:projectName', async(req, res, next) => {
    ProjectController.getProjectDevelopers(req, res, next);
})

router.post('/api/new/project', authMiddleware.authMiddlewareForOrganization, async(req, res, next) => {
    ProjectController.createProject(req, res, next);
})


router.post('/api/addFiles', authMiddleware.authMiddleware, async(req, res, next) => {
    ProjectController.addFiles(req, res, next);
});

router.get('/api/:orgname/:projectName.git', async(req, res, next) => {
    ProjectController.sendZippedProject(req, res, next);
})

router.get('/api/search/project', async(req, res, next) => {
    ProjectController.searchProjects(req, res, next);
})

module.exports = router;
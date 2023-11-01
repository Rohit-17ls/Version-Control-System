const {Router} = require('express');
const router = Router();
const authMiddleware = require('../Middleware/authMiddleware.js');
const commandController = require('../Controllers/commandController.js');

                                                                                                        
router.post('/api/command', authMiddleware.authMiddleware,  async(req, res, next) => {                                              
        commandController.runCommand(req, res, next);                                                   
                                                                                                        
});                                                                                                     
                                                                                                        
                                                                                                        
                                                                                                        
module.exports = router; 
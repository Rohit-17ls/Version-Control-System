const {Router} = require('express');
const router = Router();
const commandController = require('../Controllers/commandController.js');

                                                                                                        
router.post('/api/run/:command', async(req, res next) => {                                              
        commandController.runCommand(req, res, next);                                                   
                                                                                                        
});                                                                                                     
                                                                                                        
                                                                                                        
                                                                                                        
module.exports = router; 

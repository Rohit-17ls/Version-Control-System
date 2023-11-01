const {exec} = require('child_process');
const {pool} = require('../DB/connection.js')
require('dotenv').config();


class CommandController{

    static async runCommand(req, res, next){

        // Ensure commands run inside of ../../Test-Projects/{path}
        try {
    
            // Check if command runner is a developer who is associated with this project
            const connection = await pool.getConnection();
            const devName = req.cookies.devname;
    
            if(!devName){
                res.json({status : false, message : 'Only authorized developers can run commands !! Login to continue'});
                return;
            }
    
            const query = `SELECT 1 FROM developers INNER JOIN projects INNER JOIN project_developers ON\ 
     projects.project_id = project_developers.project_id AND developers.dev_id = project_developers.dev_id AND\
     developers.dev_name = '${devName}' AND projects.project_name = '${req.body.projectName}';`;
    
    
            const [result, fields] = await connection.execute(query);
            connection.release();
    
            console.log(result);
            if(!result.length){
                res.json({status : false, message : 'Only developers associated with this project can run commands'});
                return;
            }
    
    
            let command = req.body.command;
            const cwd = `${process.env.PROJECTS_DIRECTORY}/${req.body.orgname}/${req.body.projectName}/${req.body.projectPath}`;
            
            // Disallow non-git commands (making exception for mkdir)
            // const commandRegex = /^git[^("&&"|"|")]*$/;
            const commandRegex =/(^git[^(&&||)]*$|mkdir[ ]+([^\n\t ]+[ ]*)+)/;
            const match = command.match(commandRegex);
            console.log(`Running command : ${command} from ${cwd}`);
    
            if(!match){
                res.json({
                    status: false,
                    message: "Not authorized to run this command, non-git commands are disallowed for all users\n"
                });
                return;
            }
    
            command = match[0].trim();
            command = `git checkout ${req.body.branch} && ${command}`;
    
    
            
            let {stdout, error} = await exec(command, {cwd}, (error, stdout, stderr) => {
    
                console.log('Result : ', stdout);
    
                if(error){
                    // error = error.toString();
                    console.log('--> Error --- ',  error.toString(), ' <--');
                    res.json({status: false, message : error.toString(), result : stdout});
                    return;
                }
    
                const commandResult = {status: true, message : error, result : stdout};
            
                console.log(commandResult);
                res.json(commandResult);
            });
    
            stdout = (await new Response(stdout).text()).toString();
            console.log(stdout);
    
    
            
    
    
    
        } catch (err) {
    
            console.log('--Error : ', err, '--------------\n');
            res.json({
                status: false,
                message: "Not authorized to run this command, non-git commands are disallowed for all users\n"
            });
        }
    
    
    }

}

module.exports = CommandController;

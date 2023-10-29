const {exec} = require('child_process');
require('dotenv').config();


module.exports.runCommand = async (req, res, next) => {

    // Ensure commands run inside of ../../Test-Projects/{path}
    try {

        let command = req.body.command;
        const cwd = `${process.env.PROJECTS_DIRECTORY}/${req.body.orgname}/${req.body.projectName}/${req.body.projectPath}`;
        
        // Disallow non-git commands
        // const commandRegex = /^git[^("&&"|"|")]*$/;
        const commandRegex = /^git[^(&&||)]*$/;
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
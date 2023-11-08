const fs = require('fs');
const archiver = require('archiver');
const {exec} = require('child_process');
const AnsiToHtml = require('ansi-to-html');
require('dotenv').config();
const {pool} = require('../DB/connection.js');
const { runInNewContext } = require('vm');

/************************************************************************************************************************************************* */

const autoCommitAfterUpdate = async(devName, cwd, branch, addFiles, commitMessage, res, response) => {
    try{
        console.log(addFiles.join(' '), commitMessage);
        
        exec(`git checkout ${branch} && git add ${addFiles.join(' ')} && git commit -m "${devName} - ${commitMessage}"`, {cwd}, async(error, stdout, stderr) => {
            if(error){
                console.log(error);
            }
            res.json(response);
        });
        
    }catch(err){
        console.log(err);
        res.json({status : false, message : "Couldn't add files"})
    }
}

const visitProjectFiles = (path) => {

    const fileList = fs.readdirSync(path);
    let files = [];

    for(const entity of fileList){
        const entityPath = `${path}/${entity}`;
        if(fs.statSync(entityPath).isDirectory()){
            const childFiles = visitProjectFiles(entityPath);
            if(childFiles.length){
                files = [...files, ...childFiles];
            }
        }else{
            files.push(entityPath);
        }
    }


    return files;

}



/************************************************************************************************************************************************* */


class ProjectController{

    static async resolveResources(req, res, next) {
        try{
            console.log(req.params);
            const files = [];
            const folders = [];
            const cwd = `${process.env.PROJECTS_DIRECTORY}/${req.params.orgname}/${req.params.projectName}`;

            await exec(`git checkout ${req.params.branch}`, {cwd}, (error, stdout, stderr) => {
                console.log('Inside exec')
                if(error){
                    console.log('Error -> ', error , ' <-');
                    res.json({files : [], folders : [], status : false});
                    return;
                }

                try{
                    const path = `${process.env.PROJECTS_DIRECTORY.toString()}/${req.params.orgname}/${req.params.projectName}/${req.params.path}`;
                    console.log(path, fs.statSync(path).isFile());


                    // If path points to a file
                    if(fs.statSync(path).isFile()){
                        fs.readFile(path, 'utf8', (err, data) => {
                            if (err) {
                                res.json({files : [], folders : [], status : false, isFile : false});
                                return;
                            }
                        
                            res.json({data, status : true, isFile : true});
                        });

                        return;
                    }

                    const fileList = fs.readdirSync(path);

                    for(const entity of fileList){
                        const entityPath = `${path}/${entity}`;
                        if(fs.statSync(entityPath).isDirectory()) folders.push({name : entity, lastUpdated : fs.statSync(entityPath).mtime});
                        else files.push({name : entity, lastUpdated : fs.statSync(entityPath).mtime});
                        // console.log(entity);
                    }

                    res.json({files : files, folders : folders, status : true, isFile : false});

                    }catch(err){
                        res.json({files : [], folders : [], status : false});
                    }
            });


            
        }catch(err){
            console.log(err);
            res.json({files : [], folders : [], status : false});
        }
    }


    static async getBranches(req, res, next) {
        try{
            const path = `${process.env.PROJECTS_DIRECTORY.toString()}/${req.params.orgname}/${req.params.projectName}`;
            const command = 'git branch -a'

            await exec(command, {cwd : path}, (error, stdout, stderr) => {
                if(error){
                    console.log('---> Error : ', error, ' <---');
                    res.json({status : false, message : error.toString()});
                    return;
                }

                const branches = stdout.split('\n');
                res.json({status: true, result : branches});

            });

        }catch{
            console.log(err);
            res.json({status : false, message : 'Something went wrong'})
        }
    }


    static async getProjects(req, res, next) {
        try{
            if(!/^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/.test(req.params.orgname)) throw Error('Invalid Organization Name');

            const connection = await pool.getConnection();

            const query = `SELECT project_id, project_name, techlead_name FROM projects INNER JOIN organizations ON\
    projects.org_id = organizations.org_id AND organizations.org_name = '${req.params.orgname}';`;
            const [projectData, projectFields] = await connection.execute(query);
            
            connection.release();

            res.json({status : true, result : projectData});



        }catch(err){
            console.log(err);
            res.json({status : false, message : `Couldn't find any organization going by '${req.params.orgname}'`})
        }
    }

    static async getProjectDevelopers(req, res, next) {
        try{
            if(!/^[a-zA-Z]+(-[a-zA-Z0-9]+)*$/.test(req.params.projectName)) throw Error('Invalid projectName Name');

            const connection = await pool.getConnection();
            const query = `SELECT dev_name FROM developers INNER JOIN project_developers ON developers.dev_id = project_developers.dev_id\
    AND project_developers.project_id = (SELECT project_id FROM projects WHERE project_name = '${req.params.projectName}');`;

            const [developers, fields] = await connection.execute(query);
            connection.release();
            res.json({status : true, result : developers.map((dev) => dev.dev_name)});


        }catch(err){
            console.log(err);
            res.json({status : false, message : `Failed to fetch developers of project '${req.params.orgname}'`})
        }
    }



    static async createProject(req, res, next) {
        try{
            const path = `${process.env.PROJECTS_DIRECTORY}/${req.body.orgname}/${req.body.projectName}`;
        
            if(fs.existsSync(path)){
                res.json({status : false, message : "You have a pre-existing project with this name"});
                return;
            }

            fs.mkdirSync(path);

            // Modify if in case projects with folders are also supported
            for(let file of req.body.content){
                fs.writeFile(`${path}/${file.name}`, file.content, (err) => {
                    if(err){
                        console.log('Write Error ', err);
                    }
                })
            };

            const command = `git init && git branch -m master main && git add . && git commit -m "Initial Commit"`;

            await exec(command, {cwd : path}, async(error, stdout, stderr) => {
                try{

                    const connection = await pool.getConnection();
                    const query1 = `INSERT INTO projects (project_name, org_id, techlead_name, developers) SELECT\
    '${req.body.projectName}', org_id, '${req.body.techLeadName}', ${req.body.developers.length} FROM organizations WHERE org_name = '${req.body.orgname}';`;

                    const [result, fields] = await connection.execute(query1);

                    const query2 = `SELECT project_id FROM projects WHERE project_name = '${req.body.projectName}';`;
                    const [projectRow, projectFields] = await connection.execute(query2);
                    const projectId = projectRow[0].project_id;

                    const query3 = `INSERT INTO project_developers SELECT ${projectId}, dev_id FROM developers WHERE dev_name IN\
    (${req.body.developers.map(name => `'${name}'`).join(', ')});`;

                    await connection.execute(query3);

                    connection.release();

                    res.json({status : true, message : 'Created Project Successfully'});

                }catch(err){
                    console.log(err);
                    res.json({status : false, message : error.toString()});

                }

            });
            

        }catch(err){
            console.log(err);
            res.json({status : false, message : "Couldn't create project"});
        }
    }



    static async addFiles(req, res, next) {
        try{

            // Check if command runner is a developer who is associated with this project
            const connection = await pool.getConnection();
            const devName = req.cookies.devname;
            const projectName = req.body.path.split('/')[0];


            if(!devName){
                res.json({status : false, message : 'Only authorized developers can add files !! Login to continue'});
                return;
            }

            const query = `SELECT 1 FROM developers INNER JOIN projects INNER JOIN project_developers ON\ 
    projects.project_id = project_developers.project_id AND developers.dev_id = project_developers.dev_id AND\
    developers.dev_name = '${devName}' AND projects.project_name = '${projectName}';`;


            const [result, fields] = await connection.execute(query);
            connection.release();

            console.log(result);
            if(!result.length){
                res.json({status : false, message : 'Only developers associated with this project can add files'});
                return;
            }


            const branch = req.body.branch; 
            const orgname = req.body.orgname;
            const path  = req.body.path;
            const command = `git checkout ${branch}`;
            const cwd = `${process.env.PROJECTS_DIRECTORY}/${orgname}/${path}`

            exec(command, {cwd}, async(error, stdout, stderr) => {
                try{
                    let commitMessage = 'Added files - ';
                    const addedFiles = [];
                    for(let entity of req.body.data){
                        fs.writeFile(`${cwd}/${entity.name}`, entity.content, async(err) => {
                            if(err){
                                console.log("Error creating/writing to file");
                            }
                        });
                        commitMessage = `${commitMessage} ${entity.name},`;
                        addedFiles.push(entity.name);

                    }
                    commitMessage = commitMessage.slice(0,-1);

                    autoCommitAfterUpdate(devName, cwd, branch, addedFiles, commitMessage, res, {status : true, message : 'Added files succesfully'});

                }catch(err){
                    if(err){
                        res.json({status : false, message : 'Failed to add files'})
                    }

                }
            })
        
            
        }catch(err){
            console.log(err);
            res.json({status : false, message : 'Failed to add files'});
        }
    }


    static async sendZippedProject(req, res, next) {
        try{
            const orgname = req.params.orgname;
            const projectName = req.params.projectName;

            console.log(orgname, projectName);

            const path = `${process.env.PROJECTS_DIRECTORY}/${orgname}/${projectName}`;
            const files = visitProjectFiles(path);

            
            const archive = archiver('zip', {zlib : {level : 9}}); // Creating a zip archive with a compression level of 9
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename=${projectName}.zip`);
            
            // Piping the zip archive to the response
            archive.pipe(res);
            
            // Adding files to the zip archive
            for(let file of files){
                archive.file(file);
            }

            archive.finalize(); // Sends the response to the client

        }catch(err){
            console.log(err);
            res.json({status : false, message : "Couldn't find such a project"});
        }
    }

    static async searchProjects(req, res, next) {
        try{
            console.log(req.query.name);
            if(!req.query.name.length){
                res.json({status : true, result : []});
                return;
            }
            const connection = await pool.getConnection();
            const SELECTION_LIMIT = 10;
            const query = `SELECT projects.project_name, projects.techlead_name, organizations.org_name FROM projects INNER JOIN organizations\ 
    ON projects.org_id = organizations.org_id AND  projects.project_name LIKE '%${req.query.name}%' LIMIT ${SELECTION_LIMIT};`;

            const [projects, fields] = await connection.execute(query);

            console.log(projects);

            connection.release();

            res.json({status : true, result : projects});


        }catch(err){
            console.log(err);
            res.json({status : false, message : "Something went wrong !! Couldn't fetch projects"});
        }
    } 


    static async getCommitInsights(req, res, next) {
        try{

            const orgname = req.params.orgname;
            const projectName = req.params.projectName;
            let skip = req.params.skip.match(/(0|[1-9][0-9]{0,8})/);
            let count = req.params.count.match(/([1-9][0-9]{0,8})/);
            
            console.log(req.params);
            
            if(!skip || !count){
                res.json({status : false, message : "Invalid commit range"});
                return;
            }
            
            skip = skip[0];
            count = count[0];

            const cwd = `${process.env.PROJECTS_DIRECTORY}/${orgname}/${projectName}`
            

            const ansiToHtml = new AnsiToHtml();
            const formatString = `</pre></details><div class='text-3xl my-8 semibold'>Commit Hash : %H</div><strong style='color:#cfcf00; margin-top: -1vh'>\
%nDate : %ad%nCommit : %s%n</strong><details class='p-2 card-bg rounded-lg min-w-[400px] max-w-[600px]'><summary><strong class='my-3'>\
View Diff</strong><button class='p-1 button rounded-lg' style='background : #918f8bd9; margin-left : 20px' type='button'>\
<a href="/${orgname}/${projectName}/commit/%H">Analyze with AI</a></button></summary><pre style='white-space : pre-wrap'>`;
            const command = `git show --format="${formatString}" --color="always" --skip=${skip} -${count}`;
            console.log(command);

            exec(command, {cwd}, async(error, stdout, stderr) => {
                if (error){
                    console.error(`---> Error: ${error.message} <---`);
                    res.json({status : false, message : "Couldn't fetch commit insights"});
                    return;
                }
            
                // Convert ANSI escape codes to HTML
                const htmlOutput = `${ansiToHtml.toHtml(stdout)}</pre></details>`.slice(16, );
            
                // Display the HTML with preserved colors
                res.json({status : true, result : htmlOutput});

            });
            
            
        }catch(err){
            console.log(err);
            res.json({status : false, message : "Couldn't fetch commit insights"});
        }
    }

    static async getCommitDiffByCommitHash(req, res, next){
        try{
            const orgname = req.params.orgname;
            const projectName = req.params.projectName;
            const commitHash = req.params.commitHash;

            const cwd = `${process.env.PROJECTS_DIRECTORY}/${orgname}/${projectName}`;
            const ansiToHtml = new AnsiToHtml();

            const formatString = `<div class='p-2 card-bg rounded-lg min-w-[400px] max-w-[600px]'><div><strong class='my-3'>\
Diff for <span style='color : #cfcf00'>%H</span></strong></div><pre style='white-space : pre-wrap'>`;
            const command = `git show --format="${formatString}" --color="always"`;

            exec(command, {cwd}, async(error, stdout, stderr) => {
                if (error){
                    console.error(`---> Error: ${error.message} <---`);
                    res.json({status : false, message : "Couldn't fetch commit insights"});
                    return;
                }
            
                // Convert ANSI escape codes to HTML
                const htmlOutput = `${ansiToHtml.toHtml(stdout)}</pre></div>`;
            
                // Display the HTML with preserved colors
                res.json({status : true, result : htmlOutput});

            });
            

        }catch(err){
            console.log(err);
            res.json({status : false, message : "Couldn't fetch commit diff"});
        }
    }


    static async analyzeCommitDiffUsingLlama(req, res, next){
        try{
            const diff = req.body.diff;
            const cwd = '.';
            const command = `sh prompt.sh "${diff.replaceAll('\n', ' ')}"`;

            exec(command, {cwd}, async(error, stdout, stderr) => {
                if(error){
                    console.log(error);
                    res.json({status : false, message : 'AI is unavailable, possibly due to high demand. Try again later...'});
                    return;                   
                }

                res.json({status : true, result : stdout});
            })

            // console.log(command);
            // res.json({status : true, result : 'AI is analyzing, please wait'});


        }catch(err){
            console.log(err);
            res.json({status : false, message : 'AI is unavailable, possibly due to high demand. Try again later...'})
        }
    }


}

module.exports = ProjectController;


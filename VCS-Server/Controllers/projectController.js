const fs = require('fs');
const archiver = require('archiver');
const {exec} = require('child_process');
require('dotenv').config();
const {pool} = require('../DB/connection.js');

/************************************************************************************************************************************************* */

const autoCommitAfterUpdate = async(cwd, branch, addFiles, commitMessage, res, response) => {
    try{
        console.log(addFiles.join(' '), commitMessage);
        
        exec(`git checkout ${branch} && git add ${addFiles.join(' ')} && git commit -m "${commitMessage}"`, {cwd}, async(error, stdout, stderr) => {
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


module.exports.resolveResources = async(req, res, next) => {
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


module.exports.getBranches = async(req, res, next) => {
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


module.exports.getProjects = async(req, res, next) => {
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

module.exports.getProjectDevelopers = async(req, res, next) => {
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



module.exports.createProject = async(req, res, next) => {
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



module.exports.addFiles = async(req, res, next) => {
    try{
        console.log(req.body);

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

                autoCommitAfterUpdate(cwd, branch, addedFiles, commitMessage, res, {status : true, message : 'Added files succesfully'});

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


module.exports.sendZippedProject = async(req, res, next) => {
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

module.exports.searchProjects = async(req, res, next) => {
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
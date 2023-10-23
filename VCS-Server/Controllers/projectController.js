const fs = require('fs');
const {exec} = require('child_process');
require('dotenv').config();
const {pool} = require('../DB/connection.js');

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
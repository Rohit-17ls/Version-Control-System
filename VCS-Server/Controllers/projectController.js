const fs = require('fs');
require('dotenv').config();

module.exports.resolveResources = async(req, res, next) => {
    try{
        console.log(req.params);
        const files = [];
        const folders = [];

        const path = `${process.env.PROJECTS_DIRECTORY.toString()}${req.params.orgname}/${req.params.projectName}/${req.params.path}`;
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
            if(fs.statSync(entityPath).isDirectory()) folders.push(entity);
            else files.push(entity);
            // console.log(entity);
        }

        res.json({files : files, folders : folders, status : true, isFile : false});
    }catch(err){
        res.json({files : [], folders : [], status : false, isFile : false});
    }
}
const jwt = require('jsonwebtoken');
const {pool} = require('../DB/connection.js');
const crypto = require('crypto');
require('dotenv').config();

const {exec} = require('child_process');

const createToken = (data) => {
    return jwt.sign({data}, process.env.JWT_SECRET_KEY.toString(), {expiresIn : 24 * 3600 * 5});
}

const getHash = (secretValue, hashSource, algorithm = 'sha256') => {
    const hmac = crypto.createHmac(algorithm, secretValue);
    hmac.update(hashSource);
    return hmac.digest('hex');
}

module.exports.devSignupHandler = async(req, res, next) => {
    try{
        const {devname, password} = req.body;
        const hashedPassword = getHash(process.env.HASH_SECRET_VALUE.toString(), password);
        
        const query = `INSERT INTO developers (dev_name, dev_password) VALUES ('${devname}', '${hashedPassword}');`;
        
        const connection = await pool.getConnection();
        const [result] = await connection.execute(query);
        connection.release();
        
        return res.json({authStatus : true, message : 'Signup Successful'})
        
        
    }catch(err){
        console.log(err);
        if(err.code === 'ER_DUP_ENTRY'){
            res.json({authStatus : false, message : "Username already taken"});
            return;
        }
        res.json({authStatus : false, message : "Couldn't Signup"});
    }
}



module.exports.devLoginHandler = async(req, res, next) => {
    try{
        const {devname, password} = req.body;
        const hashedPassword = getHash(process.env.HASH_SECRET_VALUE.toString(), password);
        
        const queryDeveloper = `SELECT dev_password FROM developers WHERE dev_name = '${devname}' LIMIT 1`;
        
        const connection = await pool.getConnection();
        const [devRow, fields] = await connection.execute(queryDeveloper);
        connection.release();

        console.log(devRow[0]);
        
        if(devRow[0].dev_password !== hashedPassword){
            res.json({authStatus : false, message : 'Invalid username/password'});
            return
        }
        
        const token = createToken(devname);
        res.status(200).cookie('jwt', token, {httpOnly:true, maxAge:24*3600*1000*5, secure: true});
        res.status(200).cookie('devname', devname,  {httpOnly:false, maxAge:24*3600*1000*5, secure: false});
        res.json({authStatus : true, message : "Login Successful"});
        
        
    }catch(err){
        console.log(err);
        res.json({authStatus : false, message : "Something went wrong"});
    }
    
}

module.exports.orgSignupHandler = async(req, res, next) => {
    try{
        const {orgname, password} = req.body;
        const hashedPassword = getHash(process.env.HASH_SECRET_VALUE.toString(), password);

        const query = `INSERT INTO organizations (org_name, org_password) VALUES ('${orgname}', '${hashedPassword}');`;

        const connection = await pool.getConnection();
        const [result] = await connection.execute(query);
        connection.release();

        const cwd = `${process.env.PROJECTS_DIRECTORY}`
        await exec(`mkdir ${orgname}`, {cwd}, (error, stdout, stderr) => {
            if(error){
                console.log('--> Error : ', error , ' <--');
                res.json({status : false, message : "Couldn't Signup"});
                return;
            }

            res.json({authStatus : true, message : 'Signup Successful'})
        });




    }catch(err){
        console.log(err);
        if(err.code === 'ER_DUP_ENTRY'){
            res.json({authStatus : false, message : "Organization name already taken"});
            return;
        }
        res.json({authStatus : false, message : "Couldn't Signup"});
    }

}


module.exports.orgLoginHandler = async(req, res, next) => {
    try{
        const {orgname, password} = req.body;
        const hashedPassword = getHash(process.env.HASH_SECRET_VALUE.toString(), password);

        const queryDeveloper = `SELECT org_password FROM organizations WHERE org_name = '${orgname}' LIMIT 1`;

        const connection = await pool.getConnection();
        const [orgRow, fields] = await connection.execute(queryDeveloper);
        connection.release();

        // console.log(orgRow[0], hashedPassword);

        if(orgRow[0].org_password !== hashedPassword){
            res.json({authStatus : false, message : 'Invalid username/password'});
            return
        }


        const token = createToken(orgname);
        res.status(200).cookie('jwt', token, {httpOnly:true, maxAge:24*3600*1000*5, secure: true});
        res.status(200).cookie('orgname', orgname,  {httpOnly:false, maxAge:24*3600*1000*5, secure: false});
        res.json({authStatus : true, message : "Login Successful"});
        
        
    }catch(err){
        console.log(err);
        res.json({authStatus : false, message : "Something went wrong"});
    }
}


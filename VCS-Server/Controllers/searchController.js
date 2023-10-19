const {pool} = require('../DB/connection.js');

module.exports.searchDeveloper = async(req, res, next) => {
    try{
        if(req.query.devname === undefined){
            res.json({result : [], isSuccess : false});
            return;
        }

        const query = `SELECT dev_name FROM developers WHERE dev_name like '%${req.query.devname}%' LIMIT 5;`;

        const connection = await pool.getConnection();
        const [devRows, fields] = await connection.execute(query);
        connection.release();

        res.json({result : devRows.map(x => x.dev_name), isSuccess : true});

    }catch(err){
        console.log(err);
        res.json({result : [], isSuccess : false});
    }
}

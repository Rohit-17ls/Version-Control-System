const {exec} = require('child_process');



module.exports.runCommand = async (req, res, next) => {

    try {

        const command = req.body.command;
        let result;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                result = {status : false, message : 'Something went wrong'};
                console.log(error);
                return;
            }

            if (stderr) {
                 result = {status : false, message : 'Something went wrong'};
                console.log(`stderr : ${stderr}`);
            }else{
              result = {status: true, message : 'Success', result : stdout};
            }
        });

        res.json(result);



    } catch (err) {

        console.log(err);
        res.json({
            status: false,
            message: "Not authorized to run this command\n"
        });
    }


}

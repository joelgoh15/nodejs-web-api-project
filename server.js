// db and sql configs
var  config = require('./dbconfig');
const  sql = require('mssql/msnodesqlv8');

//nodejs server configs
var  express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');
var  app = express();
var  router = express.Router();
app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router); 

app.listen(3000, ()=>{
    console.log('server is running on port 3000')
})



// http://localhost:3000/api/RouteFnGetUsersDetails
router.route('/RouteFnGetUsersDetails').get(async (request, response) => {
    try {
        let sqlConn = await  sql.connect(config);
        let sqlConnGetUsersDetails = await sqlConn.request().query("select * from dbo.UserDetailsTable");
        //return status 200 OK
        return response.json(sqlConnGetUsersDetails.recordsets[0]);
    } catch (error) {
        console.log(error);
        //return status 404 not found (no data)
        return response.sendStatus(404);
    }
})

//e.g: http://localhost:3000/api/RouteFnGetUserDetailByContactNumber/aa
router.route('/RouteFnGetUserDetailByContactNumber/:id').get(async (request, response) => {
    
    try {
        let sqlConn = await  sql.connect(config);
        let sqlConnGetUserDetailByContactNumber = await sqlConn.request()
        .input('input_param_userContactNo', sql.VarChar, request.params.id)
        .query("select * from dbo.UserDetailsTable where ContactNumber = @input_param_userContactNo");

        if (sqlConnGetUserDetailByContactNumber.recordsets[0].length == 0) {
            //return status 404 not found (no data)
            return response.sendStatus(404);
        } else{
            //return status 200 OK
            return response.json(sqlConnGetUserDetailByContactNumber.recordsets[0]);
        }


    } catch (error) {
        //console log error
        console.log(error);
        //return status code 400 bad request
        return response.sendStatus(400);

    }
})


// http://localhost:3000/api/RouteFnPostUserDetails
router.route('/RouteFnPostUserDetails').post(async (request, response) => {
    
    if(request.body.constructor === Object && Object.keys(request.body).length === 0) {
        //return status 404 not found
        return response.sendStatus(404);
    }

    try {
        const  varUserDetailsTableModel = request.body;
        let  sqlConn = await  sql.connect(config);
        let sqlConnPostUserDetails = await sqlConn.request()
        .input('input_param_userContactNo', sql.VarChar, varUserDetailsTableModel.ContactNumber)
        .input('input_param_name', sql.VarChar,varUserDetailsTableModel.Name)
        .query('insert into [dbo].[UserDetailsTable](ContactNumber,Name) values (@input_param_userContactNo, @input_param_name)');
        //return status 200 OK
        return response.sendStatus(200);

    } catch (error) {
        //log error to console
        console.log(error);
        //return status code 400 bad request
        return response.sendStatus(400);
    }
})

// http://localhost:3000/api/RouteFnPutUserDetails
router.route('/RouteFnPutUserDetails').put(async (request, response) => {
    
    if(request.body.constructor === Object && Object.keys(request.body).length === 0) {
        //return status 404 not found
        return response.sendStatus(404);
    }

    try {
        const  varUserDetailsTableModel = request.body;
        let  sqlConn = await  sql.connect(config);
        let sqlConnPutUserDetails = await sqlConn.request()
        .input('input_param_userContactNo', sql.VarChar, varUserDetailsTableModel.ContactNumber)
        .input('input_param_name', sql.VarChar,varUserDetailsTableModel.Name)
        .query('update [dbo].[UserDetailsTable] set Name = @input_param_name where ContactNumber  = @input_param_userContactNo');
        //return status 200 OK
        return response.sendStatus(200);
    } catch (error) {
        //log error to console
        console.log(error);
        //return status code 400 bad request
        return response.sendStatus(400);
    }
})

//e.g: http://localhost:3000/api/RouteFnDeleteUserDetails
router.route('/RouteFnDeleteUserDetails').delete(async (request, response) => {
    
    if(request.body.constructor === Object && Object.keys(request.body).length === 0) {
        //return status 404 not found
        return response.sendStatus(404);
    }

    var userContactNumber;
    userContactNumber = request.body.ContactNumber;

    try {
        //do a check first if id exists
        let sqlConn = await  sql.connect(config);
        let sqlConnGetUserDetailByContactNumber = await sqlConn.request()
        .input('input_param_userContactNo', sql.VarChar, userContactNumber)
        .query("select * from dbo.UserDetailsTable where ContactNumber = @input_param_userContactNo");
        if (sqlConnGetUserDetailByContactNumber.recordsets[0].length == 0) {
            //return status 404 not found (no data). user does not exist for delete.
            return response.sendStatus(404);
        }
    } catch (error) {
        console.log(error);
        //return status code 400 bad request
        return response.sendStatus(400);
    }

    try {
        let  sqlConn = await  sql.connect(config);
        let sqlConnDeleteUserDetails = await sqlConn.request()
        .input('input_param_userContactNo', sql.VarChar, userContactNumber)
        .query("delete from [dbo].[UserDetailsTable] where ContactNumber = @input_param_userContactNo");
        //return status 200 OK
        return response.sendStatus(200);
    } catch (error) {
        //log error to console
        console.log(error);
        //return status code 400 bad request
        return response.sendStatus(400);
    }
})





















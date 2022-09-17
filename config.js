//Database connection 
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password :'',
    database : 'webapplication'
});

connection.connect((error) => {
    if(error){
        console.log('MySql Error!');
    } else{
        console.log(`Connected successfuly to MySql`);
    }

});
//End 

//Export this function
module.exports = connection; 
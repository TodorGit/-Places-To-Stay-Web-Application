const con = require('../config');//import database connection


//Rest API 
exports.searchById = (req,res) => {

    con.query('select * from accommodation where location=?', [req.params.location], (error, results) =>{

        if(error){
            console.log('Failed to retreeve the data');
            res.status(400).json({error : 'Failed to retreve'})
        } else{
            console.log(`Data retrieved`);
            res.status(200).json(results)
        }

    });
};

exports.searchByTypedAndLocation = (req, res) =>{

    con.query("select * from accommodation where location=? and type=?", [req.params.location, req.params.type], (error, result)=>{
        if (error){
            console.log("Failed to grab the data");
            res.status(400).json({error: "Failed to retrieve"})
        } else {
            console.log("Got the data..");
            res.status(202).json(result);
        }
    });
};


exports.booking = (req, res)=>{
    console.log("this is the id " + req.params.id);
    
    // if(req.body,accID === null || req.body.thedate === null || req.body.username===nul || req.body.npeople===null)
    // res.status(204).send({"Infor":"One or more empty parameters"});
    // else {
    
    con.query('insert into acc_bookings (accID, thedate, username, npeople) values (?, ?, ?, ?)', 
    [req.body.accID, req.body.thedate, req.body.username, req.body.npeople], (error, results)=>{
        if (error)
          {console.log("error while inserting the data");
           res.status(450).json({error: "Error while inserting into acc_booking"});
          } 
          else
          {
            console.log("Successfull in adding the data");
            res.status(200).json({info: results.affectedRows});
            // console.log("row affected", results.affectedRows);
            // console.log("Number of people: ", req.body.npeople);
            // console.log("accID: ", req.body.accID);
            // console.log("DAte: ", req.body.thedate);
            con.query('update acc_dates set availability=availability-? where thedate=? and accID=?', 
                 [req.body.npeople, req.body.thedate, req.body.accID], (error, result)=>{
                    if (error)
                      {console.log("error while updating acc_dates table");
                      res.status(450).json({error: "Error while updating into acc_dates"});}
                      else
                      {console.log("Sucess in updating acc_dates");
                      //res.status(450).json({error: "Success on updating into acc_dates"});
                      console.log("row affected in acc_dates", result.affectedRows);}
                 });
          }
    });
    }
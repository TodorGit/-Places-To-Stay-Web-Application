const express = require('express');//express import
// const { connect } = require('./config');
const app = express();//express import
const port = 5000; // port declaration 
const path = require('path');
const ejs = require('ejs');

//Login session management
const passport = require('passport');
//const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const sqlsession = require('express-mysql-session')(session);
const con = require('./config')
//Session parameters
app.use(session({
    key: 'admin',
    secret: 'password',
    store: new sqlsession({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'webapplication'
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge:60*60*60}
}));



app.use(passport.initialize());
app.use(passport.session());


//Middleware-------------------------------------------------

app.use(express.urlencoded({ extended: false })); //middleware
app.use(express.json());



app.use(express.static(path.join(__dirname, 'public')));// this is to declare the static files -- CSS, JS HTML files
app.set('views',path.join(__dirname, 'views'));// path to the views file
app.set('view engine', 'ejs');// setting the engine 
require('./routes/routes.js')(app);


//Model of the userID and Password to be sent to the local strategy of passport
const user_object = {
    usernameField:'uname',
    passwordField: 'pw', 
};

//auth function
const chekAuthentication = (username, password, done) =>{

    con.query('select * from acc_users where username=? and password=?', [username, password], (error, results) =>{

        if(error){
            return done(error);
        } 
        if(results.length === 0 ){
            return done(null, false)
        }
    });
}


const strategy = new LocalStrategy(user_object, chekAuthentication);
passport.use(strategy)


//used to add the user details to create a session with encryption
passport.serializeUser((user, done) => {

    done(null, user.id);

});

//how to check the user id for previous sessions - deserialiser
passport.deserializeUser((id, done) => {
    console.log('deserialization Success' + id);
    con.query('select * from acc_users where ID=?', [id], (error, results) =>{
        done(null, results[0])
    });

});

function isLoggedIn(req, res, next){

  if(req.isAuthenticated()) 
  return next();
  else{
    res.redirect('/login');
  }
      
};

app.get('/login', (req, res, next) =>{
    res.render('login.ejs')
});

app.get('/logout', (req, res, next) =>{
    req.logout();
    res.render('login.ejs')
});

app.get('/login_success', (req, res, next) =>{
    res.render('main.ejs');

});

app.get('/login_failure', (req, res, next) =>{
    res.render('login.ejs');

});

app.post('/login', passport.authenticate('local', {failureRedirect:'/login_failure', successRedirect:'/login_success'}));



//Code to start the server 
app.listen(process.env.port || port, (error) => {

    if(error){
        console.log('Server Error!');
    } else{
        console.log(`Server Started at Port ${port}`);
    }
});
//End





//Passport Initializing middleware
// app.use(passport.initialize());
// app.use(passport.session());

//used to add the user details to create a session with encryption
// passport.serializeUser((user, done) => {

//     done(null, user.id);

// });

//how to check the user id for previous sessions - deserialiser
// passport.deserializeUser((id, done) => {

//     User.findById(id, (error, user) => {
//         done(error, user)
//     });

// });

//defining local strategy for authentication
// passport.use(new LocalStrategy(
//     function(username, password, done) {
//       User.findOne({ username: username }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         if (!user.verifyPassword(password)) { return done(null, false); }
//         return done(null, user);
//       });
//     }
//   ));

  // function isLoggedIn(req, res, next){

  //   if(req.isAuthenticated()) return next();
  //       res.redirect('/login');
    
  // }

  // function isLoggedOut(req, res, next){

  //   if(!req.isAuthenticated()) return next();
  //   res.redirect('/login');
  // }
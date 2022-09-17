module.exports = (app) => {

const { searchById, searchByTypedAndLocation, booking } = require("../controllers/controllers");

app.get('/search/:location', searchById);
app.get('/search/:location/:type', searchByTypedAndLocation);
app.post('/booking', booking)


app.get('/', (req, res) =>{

    res.render('main.ejs')

});

app.get('/booking', (req, res) =>{

    res.render('booking.ejs')

});


app.get('/booking/:id', (req, res) =>{
    
    res.render('booking.ejs')

});


app.get('/login', (req, res) =>{
    
    res.render('login.ejs')

});

};
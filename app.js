var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const Users = require('./models/users');
const alert = require('./models/alerts');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
mongoose.connect('mongodb+srv://arvind2588:12345@cluster0.maocg.mongodb.net/api?retryWrites=true&w=majority',

  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('db connected');
  })

// Users.find({},function(err,users){
//   if(err)console.warn(err);
//   console.warn(users);
// })
// const data = new Users({
//   name:"Shrikant",
//   email:"shri@gmail.com",
//   address:"Varanasi"
// });

// data.save().then((result)=>{
// console.log(result);
// }).catch(err=>console.warn(err))




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//get api route
app.get('/users', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  Users.find().then((data) => {
    res.json(data)
  })
})

//post api route
app.post('/users', jsonParser, function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const data = new Users({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address
  })
  data.save().then((result) => {
    res.status(201).json(result)
  }).catch((error) => console.warn(error))
})


//delete api route
app.delete('/users/:id', function (req, res) {
  Users.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json(result)
  }).catch((error) => console.warn(error))
})

//alert api route
app.get('/alert', jsonParser,function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
    let OwnerName  = req.param('OwnerName');
    let Vno = req.param('Vno');
    let lng = req.param('lng');
    let lat = req.param('lat');

    res.send(OwnerName + ' ' + Vno + ' ' + lng+ ' ' + lat)

    const Alert = new alert({
      OwnerName: OwnerName,
      Vno: Vno,
      lng: lng,
      lat: lat
    })
    status.Alert().then((data) => {
      res.json(data)
    })

    
})

//put/update api route
app.put('/users/:id', jsonParser, function (req, res) {
  Users.updateOne(
    { _id: req.params.id },
    { $set: { 
      name: req.body.name, 
      email: req.body.email,
      address: req.body.address
    } }
  ).then((result) => {
    res.status(201).json(result)
  }).catch((error) => console.warn(error))
})


//search api route
app.get('/search/:name',function(req,res){
  var regex = new RegExp(req.params.name,'i');
  Users.find({name:regex}).then((result)=>{
    res.status(200).json(result)
  }).catch((error) => console.warn(error))
})
app.listen(4000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;

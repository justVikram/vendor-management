require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mysql = require('mysql2')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const {request, response} = require("express");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('port', 4200)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
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

// Specifying database credentials
const con = mysql.createConnection({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
})

con.connect(function (err) {
  if (err)
    throw err
  console.log('Connected to MySQL server!')
  const use_db = 'USE VENDOR_MANAGEMENT'
  con.query(use_db, function (err) {
    if (err)
      throw err
    console.log('Using database: VENDOR_MANAGEMENT')
  })
})

const router = require('./routes/index')

router.post('/search-results', (request, response) => {
  let order_id = parseInt(request.body.sid)
  console.log(order_id)
  let retrieve_query = mysql.format("SELECT * FROM transactions WHERE order_id = ?;", order_id)
  con.query(retrieve_query, (err, result) => {
    if (err) {
      response.send('Invalid')
    } else
      response.render('search-results', {result: result})
  })
})

router.get('/dashboard', (request, response) => {
  response.render('dashboard')
})

router.get('/', (request, response) => {
  response.render('index')
})

router.get('/place-order', (request, response) => {
  response.render('place-order')
})

router.post('/gen-order-id', (request, response) => {

  let retrieve_query = "SELECT * FROM transactions;"
  let order_id = 0
  con.query(retrieve_query, (err, rows) => {
    if (err)
      throw err
    else {
      order_id = rows.length + 1

      let vendor_select = request.body.vendor_select
      let item_select = request.body.item_select
      let quantity = request.body.quantity

      let insert_query = mysql.format("INSERT INTO transactions VALUES (?, ?, ?, ?)",
        [order_id, vendor_select, item_select, quantity])
      con.query(insert_query, (err, result) => {
        if (err) {
          response.send('Invalid')
        } else
          response.render('assigned-order-id', {result: order_id})
      })
    }
  })
})

module.exports = app;


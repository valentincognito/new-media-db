require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

var indexRouter = require('./routes/index')
var mgmtRouter = require('./routes/mgmt')
var usersRouter = require('./routes/users')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/mgmt', mgmtRouter)
app.use('/users', usersRouter)

//connect to MongoDB
mongoose.connect('mongodb://'+process.env.DB_USER+':'+process.env.DB_PWD+'@'+process.env.DB_HOST+'/hibou', {
  useNewUrlParser: true
})
const db = mongoose.connection

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('db connection successful')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app

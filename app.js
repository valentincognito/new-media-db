require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const sm = require('sitemap')
const helmet = require('helmet')

var indexRouter = require('./routes/index')
var blogRouter = require('./routes/blog')
var mgmtRouter = require('./routes/mgmt')

var app = express()

//sitemap generation
var sitemap = sm.createSitemap ({
  hostname: 'https://archive-media.com',
  cacheTime: 600000,
  urls: [
    { url: '/',  changefreq: 'monthly', priority: 0.3 },
    { url: '/blog/how-to-become-a-creative-interactive-developer',  changefreq: 'monthly', priority: 0.3 },
    { url: '/blog/best-interactive-installations-2018',  changefreq: 'monthly', priority: 0.3 },
  ]
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(helmet())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/blog', blogRouter)

//sitemap route
app.get('/sitemap.xml', function(req, res) {
  sitemap.toXML( function (err, xml) {
    if (err) {
      return res.status(500).end()
    }
    res.header('Content-Type', 'application/xml')
    res.send( xml )
  })
})

if ((process.env.ENV) === 'dev') app.use('/mgmt', mgmtRouter)

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
  res.locals.error = (process.env.ENV) === 'dev' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app

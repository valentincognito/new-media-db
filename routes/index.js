const express = require('express')
const router = express.Router()
const Reference = require('../models/reference')

router.get('/', function(req, res, next) {
  Reference.
    find().
    sort('-date').
    populate([
      {path: 'tags.category'},
      {path: 'tags.field'},
      {path: 'tags.techno'},
      {path: 'tags.visual'}
    ]).
    exec(function (error, references) {
      if (error) {
        return next(error)
      } else {
        return res.render('index', {
          title: 'Home',
          references: references
        })
      }
    })
})

module.exports = router

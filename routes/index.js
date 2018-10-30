const express = require('express')
const router = express.Router()
const Reference = require('../models/reference')
const Company = require('../models/company')
const Category = require('../models/category')
const Field = require('../models/field')
const Techno = require('../models/techno')
const Visual = require('../models/visual')

router.get('/', function(req, res, next) {
  let page = Number(req.query.page) - 1
  if (page == undefined) page = 0

  let categories = req.query.categories
  let fields = req.query.fields
  let technos = req.query.technos
  let visuals = req.query.visuals
  let title = req.query.title

  let categoryList = []
  let fieldList = []
  let technoList = []
  let visualList = []

  if (categories)
    categoryList = categories.split("+")
  if (fields)
    fieldList = fields.split("+")
  if (technos)
    technoList = technos.split("+")
  if (visuals)
    visualList = visuals.split("+")

  getHomeData(page, title, categoryList, fieldList, technoList, visualList)
    .then(data => {
      return res.render('index', {
        title: 'Home',
        refCount: data.refCount,
        refPerPage: data.refPerPage,
        references: data.references,
        companies: data.companies,
        categories: data.categories,
        fields: data.fields,
        technos: data.technos,
        visuals: data.visuals
      })
    }).catch(error => console.error(error.stack))
})

router.put('/update_view_count', function(req, res, next) {
    let reference = Reference.findById(req.body.referenceId)

    let ip = req.connection.remoteAddress

    return res.send(ip)
})

//get all the data needed home page
async function getHomeData(page, title, categoryList, fieldList, technoList, visualList) {
  //globals
  let perPage = 9

  //get data to populate the filter menu
  let companies = await Company.find()
  let categories = await Category.find()
  let fields = await Field.find()
  let technos = await Techno.find()
  let visuals = await Visual.find()

  let categoryFilter, fieldFilter, technoFilter, visualFilter

  (categoryList.length != 0) ? categoryFilter = await Category.find({ 'name' : {$in: categoryList} }).select('_id') : categoryFilter = categories;
  (fieldList.length != 0) ? fieldFilter = await Field.find({ 'name' : {$in: fieldList} }).select('_id') : fieldFilter = fields;
  (technoList.length != 0) ? technoFilter = await Techno.find({ 'name' : {$in: technoList} }).select('_id') : technoFilter = technos;
  (visualList.length != 0) ? visualFilter = await Visual.find({ 'name' : {$in: visualList} }).select('_id') : visualFilter = visuals;

  let references = await Reference.
    find({
      title:{ $regex: new RegExp(title), $options: 'i' },
      'tags.category': {$in: categoryFilter},
      'tags.field': {$in: fieldFilter},
      'tags.techno': {$in: technoFilter},
      'tags.visual': {$in: visualFilter}
    }).
    limit(perPage).
    skip(perPage * page).
    sort('-date').
    populate([
      {path: 'tags.category'},
      {path: 'tags.field'},
      {path: 'tags.techno'},
      {path: 'tags.visual'}
    ])

  let refCount = await Reference.
    find({
      title:{ $regex: new RegExp(title), $options: 'i' },
      'tags.category': {$in: categoryFilter},
      'tags.field': {$in: fieldFilter},
      'tags.techno': {$in: technoFilter},
      'tags.visual': {$in: visualFilter}
    }).countDocuments().exec()

  return{
    refCount: refCount,
    refPerPage: perPage,
    references: references,
    companies: companies,
    categories: categories,
    fields: fields,
    technos: technos,
    visuals: visuals
  }
}

module.exports = router

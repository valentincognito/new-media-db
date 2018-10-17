const express = require('express')
const router = express.Router()
const Reference = require('../models/reference')
const Company = require('../models/company')
const Category = require('../models/category')
const Field = require('../models/field')
const Techno = require('../models/techno')
const Visual = require('../models/visual')

router.get('/', function(req, res, next) {
  Reference.find(function (error, references) {
    if (error) {
      return next(error)
    } else {
      return res.render('mgmt/index', {
        title: 'References',
        references: references
      })
    }
  })
})

router.get('/update/:referenceId', function(req, res, next) {
  getReferenceData(req.params.referenceId)
    .then(data => {
      return res.render('mgmt/update_reference', {
        title: data.reference.title,
        reference: data.reference,
        companies: data.companies,
        categories: data.categories,
        fields: data.fields,
        technos: data.technos,
        visuals: data.visuals
      })
    }).catch(error => console.error(error.stack))
})

router.put('/update_reference', function(req, res, next) {
  Reference.findById(req.body.referenceId, function (err, reference) {
    reference.company = req.body.company
    reference.title = req.body.title
    reference.date = req.body.date
    reference.tags.category = req.body.categories
    reference.tags.field = req.body.fields
    reference.tags.techno = req.body.technos
    reference.tags.visual = req.body.visuals
    reference.save()
    return res.send(reference)
  })
})

//get all the references data needed for updating
async function getReferenceData(id) {
  let reference = await Reference.findById(id)
  let companies = await Company.find()
  let categories = await Category.find()
  let fields = await Field.find()
  let technos = await Techno.find()
  let visuals = await Visual.find()

  return{
    reference: reference,
    companies: companies,
    categories: categories,
    fields: fields,
    technos: technos,
    visuals: visuals
  }
}

module.exports = router
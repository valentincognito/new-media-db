const mongoose = require('mongoose')

const ReferenceSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  thumbnails: [String],
  views: Number,
  company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
  tags: {
    category: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    field: [{type: mongoose.Schema.Types.ObjectId, ref: 'Field'}],
    techno: [{type: mongoose.Schema.Types.ObjectId, ref: 'Techno'}],
    visual: [{type: mongoose.Schema.Types.ObjectId, ref: 'Visual'}]
  },
  isVisible: Boolean
})

const Reference = mongoose.model('Reference', ReferenceSchema)
module.exports = Reference

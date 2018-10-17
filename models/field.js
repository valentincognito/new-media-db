const mongoose = require('mongoose')

const FieldSchema = new mongoose.Schema({
  name: {type: String, required: true}
})

const Field = mongoose.model('Field', FieldSchema)
module.exports = Field

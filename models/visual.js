const mongoose = require('mongoose')

const VisualSchema = new mongoose.Schema({
  name: {type: String, required: true}
})

const Visual = mongoose.model('Visual', VisualSchema)
module.exports = Visual

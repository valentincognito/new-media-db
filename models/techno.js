const mongoose = require('mongoose')

const TechnoSchema = new mongoose.Schema({
  name: {type: String, required: true}
})

const Techno = mongoose.model('Techno', TechnoSchema)
module.exports = Techno

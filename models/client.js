const mongoose = require('mongoose')

const ClientSchema = new mongoose.Schema({
  ip: String,
  references: [{type: ObjectId, ref: 'Reference'}]
})

const Client = mongoose.model('Client', ClientSchema)
module.exports = Client

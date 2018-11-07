const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
  title: String,
  url: String,
  body: String,
  date: Date,
  isVisible: Boolean
})

const Article = mongoose.model('Article', ArticleSchema)
module.exports = Article

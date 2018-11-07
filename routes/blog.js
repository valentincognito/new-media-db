const express = require('express')
const router = express.Router()
const Article = require('../models/article')

router.get('/:articleShortUrl', function(req, res, next) {
  getArticleData(req.params.articleShortUrl)
    .then(data => {
      return res.render('blog', {
        title: data.article.title,
        article: data.article,
        articles: data.articlesList
      })
    }).catch(error => console.error(error.stack))
})

//get the article data
async function getArticleData(url) {
  let articlesList = await Article.find()

  let article = await Article.findOne({
    url: url
  })

  return{
    articlesList: articlesList,
    article: article
  }
}

module.exports = router

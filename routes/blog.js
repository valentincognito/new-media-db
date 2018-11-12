const express = require('express')
const router = express.Router()
const Article = require('../models/article')

router.get('/', function(req, res, next) {
  //tmp redirect to lat aritcle
  res.redirect('blog/how-to-become-a-creative-interactive-developer')
})

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

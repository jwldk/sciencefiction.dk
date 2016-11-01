import keystone from 'keystone';
const Article = keystone.list('Article');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;
  
  view.on('init', (next) => {
    locals.articletype = req.params.articletype;
    Article.model.find()
      .where('articletype', locals.articletype)
      .sort('-createdAt')
      .exec((err, articles) => {
        locals.articles = articles;
        next();
      });
  });

  view.render('articlesarchive');
};

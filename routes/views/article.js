import keystone from 'keystone';
const Article = keystone.list('Article');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'articles';

  view.on('init', (next) => {
    Article.model.findOne()
      .where('articletype', req.params.articletype)
      .where('key', req.params.key)
      .exec((err, article) => {
        if(!article) {
          return res.status(404).render('errors/404');
        }
        locals.article = article;
        locals.title = article.title;
        next();
      });
  });

  view.render('article');
};

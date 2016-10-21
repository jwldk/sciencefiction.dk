import keystone from 'keystone';
const Publication = keystone.list('Publication');
const Article = keystone.list('Article');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;
  
  locals.section = req.params.pubtype;

  view.on('init', (next) => {
    Publication.paginate({
      page: req.query.page || 1,
      perPage: 10
    })
    .where('pubtype', req.params.pubtype)
    .sort('-pubdate')
    .exec((err, publications) => {
      locals.publications = publications;
      next();
    });
  });

  view.render('publications');
};

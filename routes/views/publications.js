import keystone from 'keystone';
const Publication = keystone.list('Publication');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;
  
  locals.section = req.params.pubtype;

  view.on('init', (next) => {
    let q = Publication.paginate({
      page: req.query.page || 1,
      perPage: 10
    });
    if(req.query.series) {
      q.where('series', req.query.series);
      locals.series = Publication.fields.series.labels[req.query.series];
    }
    q.where('pubtype', req.params.pubtype);
    q.sort('-pubdate');
    q.exec((err, publications) => {
      locals.publications = publications;
      next();
    });
  });

  view.render('publications');
};

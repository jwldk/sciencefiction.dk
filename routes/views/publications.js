import keystone from 'keystone';
const Publication = keystone.list('Publication');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;
  
  locals.section = req.params.pubtype;

  view.on('init', (next) => {
    let filter = { $and: [{pubtype: req.params.pubtype}] };
    if(req.query.series) {
      filter.$and.push({series: req.query.series});
      locals.series = Publication.fields.series.labels[req.query.series];
    }
    let q = Publication.paginate({
      page: req.query.page || 1,
      perPage: req.query.series ? 1000 : 10, // Avoid pagination on series
      filters: filter
    });
    q.sort('-pubdate');
    q.exec((err, publications) => {
      locals.publications = publications;
      next();
    });
  });

  view.render('publications');
};

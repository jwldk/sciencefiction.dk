import keystone from 'keystone';
const Publication = keystone.list('Publication');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'udgivelser';

  view.on('init', (next) => {
    Publication.model.findOne()
      .where('pubtype', req.params.pubtype)
      .where('key', req.params.key)
      .exec((err, publication) => {
        locals.publication = publication;
        next();
      });
  });

  view.on('init', (next) => {
    Publication.model.find()
      .where('series', locals.publication.series)
      .exec((err, pubs) => {
        locals.similar = pubs;
        next(); 
      });
  });
  // Render the view
  view.render('publication');
};


import keystone from 'keystone';
const Publication = keystone.list('Publication');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home';

  view.on('init', (next) => {
    Publication.model.find().exec((err, pubs) => {
      locals.pubs = pubs; 
      next();
    }); 
  });

  // Render the view
  view.render('index');
};


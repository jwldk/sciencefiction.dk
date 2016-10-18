import keystone from 'keystone';
const Publication = keystone.list('Publication');
const Article = keystone.list('Article');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home';

  view.on('init', (next) => {
    Publication.model.find({'pubtype': 'BOG'}).exec((err, pubs) => {
      locals.pubs = pubs; 
      next();
    }); 
  });

  view.on('init', (next) => {
    Publication.model.findOne({'pubtype': 'PROXIMA'}).exec((err, proxima) => {
      locals.proxima = proxima;
      next();
    }); 
  });

  view.on('init', (next) => {
    Publication.model.findOne({'pubtype': 'NOVUM'}).exec((err, novum) => {
      locals.novum = novum;
      next();
    }); 
  });

  view.on('init', (next) => {
    Article.model.find({'articletype': 'NYHED', 'frontpage': true }).exec((err, news) => {
      locals.news = news;
      next();
    });  
  });

  // Render the view
  view.render('index');
};


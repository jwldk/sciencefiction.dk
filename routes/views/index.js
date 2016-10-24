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
    Article.model.find({'articletype': 'nyhed', 'frontpage': true })
      .sort('-createdAt')
      .exec((err, news) => {
        locals.news = news;
        next();
      });  
  });

  view.on('init', (next) => {
    Publication.model
      .find({'pubtype': 'bog'})
      .sort('-pubdate')
      .limit(6)
      .exec((err, pubs) => {
        locals.pubs = pubs; 
        next();
      }); 
  });

  // Render the view
  view.render('index');
};


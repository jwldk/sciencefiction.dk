import keystone from 'keystone';
import {initLocals, commonElements} from './middleware';
const importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', initLocals);

// Import Route Controllers
const routes = {
  views: importRoutes('./views')
};

keystone.set('404', function(req, res, next) {
  res.status(404).render('errors/404');
  next();
});

// Setup Route Bindings
exports = module.exports = app => {
  // Views
  app.get('*', commonElements);
  app.get('/', routes.views.index);
  app.get('/udgivelser/:pubtype', routes.views.publications);
  app.get('/udgivelser/:pubtype/:key', routes.views.publication);
  app.get('/dancon', routes.views.dancon);
  app.get('/events/', routes.views.events);
  app.get('/events/:eventtype', routes.views.allevents);
  app.get('/events/:eventtype/:key', routes.views.event);
  app.get('/articles/:articletype', routes.views.articlesarchive);
  app.get('/articles/:articletype/:key', routes.views.article);
};


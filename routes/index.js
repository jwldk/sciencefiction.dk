import keystone from 'keystone';
import {initLocals} from './middleware';
const importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', initLocals);

// Import Route Controllers
const routes = {
  views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = app => {
  // Views
  app.get('/', routes.views.index);
};


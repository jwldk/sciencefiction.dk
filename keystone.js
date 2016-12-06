// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('babel-register');
require('dotenv').config();
var moment = require('moment');
moment.locale('da');

// Require keystone
const keystone = require('keystone');

keystone.init({
  'name': 'Science Fiction Cirklen',
  'brand': 'Science Fiction Cirklen',

  'sass': 'public',
  'static': 'public',
  'favicon': 'public/favicon.ico',
  'views': 'templates/views',
  'view engine': 'pug',

  'wysiwyg menubar': true,
  'wysiwyg additional options': { convert_urls: false },

  'auto update': true,
  'session': true,
  'session store': 'mongo',
  'auth': true,
  'user model': 'User'
});
keystone.import('models');
keystone.set('locals', {
  _: require('lodash'),
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable
});

keystone.set('mailgun api', process.env.MAILGUN_API);
keystone.set('mailgun domain', process.env.MAILGUN_DOMAIN);
keystone.set('routes', require('./routes'));
keystone.set('nav', {
  users: 'users'
});

keystone.start();

import _ from 'lodash';

export function initLocals(req, res, next) {
  res.locals.navLinks = [
    { label: 'Home', key: 'home', href: '/' },
    { label: 'Contact', key: 'contact', href: '/contact' }
  ];
  res.locals.user = req.user;
  next();
}

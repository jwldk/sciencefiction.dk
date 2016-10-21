import _ from 'lodash';
import async from 'async';
import keystone from 'keystone';
const EventEntry = keystone.list('Evententry');
const Publication = keystone.list('Publication');

export function initLocals(req, res, next) {
  res.locals.navLinks = [
    { label: 'Home', key: 'home', href: '/' },
    { label: 'Contact', key: 'contact', href: '/contact' }
  ];
  res.locals.user = req.user;
  res.locals.uri = req.path;
  next();
}

export function commonElements(req, res, next) {
  const locals = res.locals;

  async.parallel([
    (cb) => {
      EventEntry.model
        .findOne({'eventtype': 'medlem'})
        .exec((err, event) => {
          locals.nextevent = event;
          cb();
        });
    },
    (cb) => {
      Publication.model
        .find({'pubtype': 'bog'})
        .sort('-pubdate')
        .limit(6)
        .exec((err, pubs) => {
          locals.pubs = pubs; 
          cb();
        }); 
    },
    (cb) => {
      Publication.model
        .findOne({'pubtype': 'proxima'})
        .sort('-pubdate')
        .exec((err, proxima) => {
          locals.proxima = proxima;
          cb();
        }); 
    },
    (cb) => {
      Publication.model
        .findOne({'pubtype': 'novum'})
        .sort('-pubdate')
        .exec((err, novum) => {
          locals.novum = novum;
          cb();
        }); 
    }
  
  ], next);
}

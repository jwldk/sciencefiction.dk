import async from 'async';
import keystone from 'keystone';
const EventEntry = keystone.list('Evententry');
const Publication = keystone.list('Publication');

export function initLocals(req, res, next) {
  res.locals.user = req.user;
  res.locals.uri = req.path;
  next();
}

export function redirects(req, res, next) {
  console.log(req.path);
  if(req.path.includes('.html')) {
    var path = req.path.replace('.html', '');
    if(path === '/faq') return res.redirect('/artikler/static/faq');
    if(path.includes('/udgivelser/boger/')) return res.redirect(path.replace('boger', 'bog'));
    return res.redirect(path);
  }
  next();
}

export function commonElements(req, res, next) {
  const locals = res.locals;

  async.parallel([
    (cb) => {
      EventEntry.model
        .findOne({'eventtype': 'medlem', 'endAt': {'$gte': new Date()}})
        .sort('startAt')
        .exec((err, event) => {
          locals.nextevent = event;
          cb();
        });
    },
    (cb) => {
      Publication.model
        .findOneRandom({'pubtype': 'bog'}, {}, {}, (err, random) => {
          locals.random = random;
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

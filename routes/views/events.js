import keystone from 'keystone';
const EventEntry = keystone.list('Evententry');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;

  view.on('init', (next) => {
    EventEntry.model
      .find({'eventtype': {$in: ['medlem', 'dancon']}, 'endAt': {'$gte': new Date()}})
      .sort('startAt')
      .exec((err, events) => {
        locals.medlemsevents = events;
        next();
      });
  });

  view.on('init', (next) => {
    EventEntry.model
      .find({'eventtype': 'bestyrelse', 'endAt': {'$gte': new Date()}})
      .sort('startAt')
      .exec((err, events) => {
        locals.bestyrelsesevents = events;
        next();
      });
  });

  locals.title = 'Medlemsmøder';

  view.render('events');
};

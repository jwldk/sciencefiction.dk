import keystone from 'keystone';
const EventEntry = keystone.list('Evententry');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;

  view.on('init', (next) => {
    EventEntry.model
      .where('eventtype', req.params.eventtype)
      .sort('-startAt')
      .exec((err, events) => {
        locals.events = events;
        next();
      });
  });

  view.render('allevents');
};


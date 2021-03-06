import keystone from 'keystone';
const EventEntry = keystone.list('Evententry');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'events';

  view.on('init', (next) => {
    EventEntry.model.findOne()
      .where('eventtype', req.params.eventtype)
      .where('key', req.params.key)
      .exec((err, event) => {
        locals.event = event;
        locals.title = event.title;
        next();
      });
  });

  view.render('event');
};

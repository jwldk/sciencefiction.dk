import keystone from 'keystone';
const Types = keystone.Field.Types;

const EventEntry = new keystone.List('Evententry', {
  autokey: { from: 'title', path: 'key', unique: true },
  map: { name: 'title'}
});

EventEntry.add({
  startAt: { type: Types.Datetime },
  endAt: { type: Types.Datetime },
  title: { type:  Types.Text, required: true, initial: true, index: true, unique: true},
  description: { type: Types.Html, wysiwyg: true },
  venue: { type: Types.Text, default: 'Valby Kulturhus' },
  room: { type: Types.Text, default: '3 sal, lokale 1' },
  eventtype: { type: Types.Select, options: 'MEDLEM, BESTYRELSE, DANCON' }
});

EventEntry.defaultColumns = 'title, startAt, eventtype';
EventEntry.register();

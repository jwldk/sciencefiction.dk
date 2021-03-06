import keystone from 'keystone';
import striptags from 'striptags';

const Types = keystone.Field.Types;

const EventEntry = new keystone.List('Evententry', {
  autokey: { from: 'title', path: 'key', unique: true },
  map: { name: 'title'}
});

EventEntry.add({
  createdAt: { type: Types.Date, default: Date.now },
  startAt: { type: Types.Datetime },
  endAt: { type: Types.Datetime },
  title: { type:  Types.Text, required: true, initial: true, index: true },
  description: { type: Types.Html, wysiwyg: true },
  venue: { type: Types.Text, default: 'Valby Kulturhus' },
  room: { type: Types.Text, default: '3 sal, lokale 1' },
  facebookEvent: { type: Types.Url },
  eventtype: { type: Types.Select, options: [
    {value: 'medlem', label: 'Medlemsmøder'},
    {value: 'dancon', label: 'Dancons'},
    {value: 'bestyrelse', label: 'Bestyrelsesmøder'} ]}
});

EventEntry.schema.virtual('intro').get(function() {
  return striptags(this.description.substr(0, 200)) + '...';
});

EventEntry.schema.virtual('articleUrl').get(function() {
  return '/events/'+this.eventtype+'/'+this.key;
});

EventEntry.defaultColumns = 'title, startAt, eventtype';
EventEntry.register();

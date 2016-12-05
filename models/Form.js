import keystone from 'keystone';
import striptags from 'striptags';

const Types = keystone.Field.Types;

const Form = new keystone.List('Form', {
  autokey: { from: 'title', path: 'key', unique: true },
  map: { name: 'title'}
});

Form.add({
  createdAt: { type: Types.Date, default: Date.now },
  title: { type: Types.Text, required: true, initial: true, index: true },
  content: {
    beforeForm: { type: Types.Html, wysiwyg: true, height: 150 },
    afterForm: { type: Types.Html, wysiwyg: true, height: 400 }
  },
  successMessage: { type: Types.Html, wysiwyg: true, height: 150 }
});

Form.schema.virtual('intro').get(function() {
  let content = this.content.beforeForm + ' ' + this.content.afterForm;
  return striptags(content.substr(0, 200)) + '...';
});

Form.schema.virtual('articleUrl').get(function() {
  return '/form/'+this.key;
});

Form.defaultColumns = 'title';
Form.register();


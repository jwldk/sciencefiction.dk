import keystone from 'keystone';
const Types = keystone.Field.Types;

const Article = new keystone.List('Article', {
  autokey: { from: 'title', path: 'key', unique: true },
  map: { name: 'title'}
});

Article.add({
  createdAt: { type: Types.Date, default: Date.now },
  title: { type: Types.Text, required: true, initial: true, index: true },
  content: {
    brief: { type: Types.Html, wysiwyg: true, height: 150 },
    extended: { type: Types.Html, wysiwyg: true, height: 400 }
  },
  frontpage: { type: Types.Boolean, default: false },
  articletype: { type: Types.Select, options: 'STATIC, NYHED, GENERALFORSAMLING' }
});

Article.schema.virtual('articleUrl').get(function() {
  return this.articletype.toLowerCase()+'/'+this.key;
});

Article.defaultColumns = 'title';
Article.register();

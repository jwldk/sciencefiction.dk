import keystone from 'keystone';
import striptags from 'striptags';

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
  articletype: { type: Types.Select, options: 'static, nyhed, generalforsamling' }
});

Article.schema.virtual('intro').get(function() {
  let content = this.content.brief ? this.content.brief : '' + ' ' + this.content.extended;
  return striptags(content.substr(0, 200)) + '...';
});

Article.schema.virtual('articleUrl').get(function() {
  return '/articles/'+this.articletype+'/'+this.key;
});

Article.defaultColumns = 'title, articletype';
Article.register();

import keystone from 'keystone';
import striptags from 'striptags';

const Types = keystone.Field.Types;

const Article = new keystone.List('Article', {
  autokey: { from: 'title', path: 'key', unique: true },
  map: { name: 'title'}
});
const articleStorage = new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: keystone.expandPath('./public/files/articles'),
    publicPath: '/files/articles/',
    generateFilename: function(file) { return file.originalname },
    whenExists: 'overwrite'
  },
  schema: {
    url: true,
    originalname: true
  }
});

Article.add({
  createdAt: { type: Types.Date, default: Date.now },
  title: { type: Types.Text, required: true, initial: true, index: true },
  content: {
    brief: { type: Types.Html, wysiwyg: true, height: 150 },
    extended: { type: Types.Html, wysiwyg: true, height: 400 }
  },
  frontpage: { type: Types.Boolean, default: false },
  file: { type: Types.File, storage: articleStorage },
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

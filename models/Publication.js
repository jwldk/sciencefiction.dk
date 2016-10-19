import keystone from 'keystone';
const Types = keystone.Field.Types;

const Publication = new keystone.List('Publication', {
  autokey: { from: 'title', path: 'key', unique: true },
  map: { name: 'title'}
});

var pubStorage = new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: keystone.expandPath('./public/files/publications'),
    publicPath: '/files/publications/',
    generateFilename: function(file) { return file.originalname },
    whenExists: 'overwrite'
  },
  schema: {
    url: true,
    originalname: true
  }
});

Publication.add({
  title: { type: Types.Text, required: true, initial: true, index: true },
  content: { type: Types.Html, wysiwyg: true },
  pubtype: { type: Types.Select, options: 'bog, proxima, novum' },
  pubdate: { type: Types.Date },
  image: { type: Types.File, storage: pubStorage },
  isbn: { type: Types.Text, dependsOn: { pubtype: 'bog'} },
  price: { type: Types.Number, dependsOn: { pubtype: 'bog'} },
  author: { type: Types.Text, dependsOn: { pubtype: 'bog'} },
  pages: { type: Types.Number, dependsOn: { pubtype: 'bog'} }

});

Publication.schema.virtual('memberPrice').get(function() {
  return (this.price*0.80).toFixed(2).replace('.', ',')
});

Publication.schema.virtual('articleUrl').get(function() {
  return '/udgivelser/'+this.pubtype+'/'+this.key;
});

Publication.defaultColumns = 'title';
Publication.register();


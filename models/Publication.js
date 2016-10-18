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
  pubtype: { type: Types.Select, options: 'BOG, PROXIMA, NOVUM' },
  pubdate: { type: Types.Date },
  image: { type: Types.File, storage: pubStorage },
  isbn: { type: Types.Text, dependsOn: { pubtype: 'BOG'} },
  price: { type: Types.Number, dependsOn: { pubtype: 'BOG'} },
  author: { type: Types.Text, dependsOn: { pubtype: 'BOG'} },
  pages: { type: Types.Number, dependsOn: { pubtype: 'BOG'} }

});

Publication.schema.virtual('memberPrice').get(function() {
  return (this.price*0.80).toFixed(2).replace('.', ',')
});

Publication.schema.virtual('articleUrl').get(function() {
  return '/udgivelser/'+this.pubtype.toLowerCase()+'/'+this.key;
});

Publication.defaultColumns = 'title';
Publication.register();


import keystone from 'keystone';
import mongooseRandom from 'mongoose-simple-random';

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
  subtitle: { type: Types.Text, dependsOn: { pubtype: 'bog'} },
  content: { type: Types.Html, wysiwyg: true },
  pubtype: { type: Types.Select, options: [
    { value: 'novum', label: 'Novum' },
    { value: 'proxima', label: 'Proxima' },
    { value: 'bog', label: 'Bøger' }
  ]},
  pubdate: { type: Types.Date },
  image: { type: Types.File, storage: pubStorage },
  isbn: { type: Types.Text, dependsOn: { pubtype: 'bog'} },
  price: { type: Types.Number, dependsOn: { pubtype: 'bog'} },
  author: { type: Types.Text, dependsOn: { pubtype: 'bog'} },
  pages: { type: Types.Number, dependsOn: { pubtype: 'bog'} },
  series: { type: Types.Select, dependsOn: { pubtype: 'bog'}, options: [
    { value: 'luo', label: 'Lige under overfladen' },
    { value: 'nydansk', label: 'Ny dansk sf' },
    { value: 'gammeldansk', label: 'Gammel dansk sf' },
    { value: 'klassik', label: 'Klassikere og kuriositeter' },
    { value: 'international', label: 'Internationale topnavne' },
    { value: 'faglitteratur', label: 'Faglitteratur' },
    { value: 'nen', label: 'Niels E. Nielsen'},
    { value: 'zap', label: 'Zap!'},
    { value: 'roman', label: 'Romaner' },
    { value: 'engelsk', label: 'Engelsk' }
  ]}
});

Publication.schema.virtual('memberPrice').get(function() {
  return (this.price*0.80).toFixed(2).replace('.', ',')
});

Publication.schema.virtual('articleUrl').get(function() {
  return '/udgivelser/'+this.pubtype+'/'+this.key;
});

Publication.schema.plugin(mongooseRandom);

Publication.defaultColumns = 'title';
Publication.register();


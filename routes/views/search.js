import keystone from 'keystone';
const Publication = keystone.list('Publication');
const Article = keystone.list('Article');
const EventEntry = keystone.list('Evententry');
const Form = keystone.list('Form');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'udgivelser';
  locals.search = req.query.search;
  locals.results = [];
  let query = { $or: [] };
  query.$or.push({ title: { $regex: locals.search, $options: 'i' } });
  query.$or.push({ subtitle: { $regex: locals.search, $options: 'i' } });
  query.$or.push({ content: { $regex: locals.search, $options: 'i' } });
  query.$or.push({ 'content.brief': { $regex: locals.search, $options: 'i' } });
  query.$or.push({ 'content.extended': { $regex: locals.search, $options: 'i' } });
  query.$or.push({ 'content.beforeForm': { $regex: locals.search, $options: 'i' } });
  query.$or.push({ 'content.afterForm': { $regex: locals.search, $options: 'i' } });
  query.$or.push({ author: { $regex: locals.search, $options: 'i' } });
  query.$or.push({ description: { $regex: locals.search, $options: 'i' } });

  view.on('init', (next) => {
    if(!locals.search) {
      return res.render('search');
    } else { 
      next();
    }
  });

  view.on('init', (next) => {
    Publication.model.find(query).exec((err, results) => {
      locals.results = locals.results.concat(results);
      next();
    });
  });

  view.on('init', (next) => {
    Article.model.find(query).exec((err, results) => {
      locals.results = locals.results.concat(results);
      next();
    });
  });

  view.on('init', (next) => {
    EventEntry.model.find(query).exec((err, results) => {
      locals.results = locals.results.concat(results);
      next();
    });
  });

  view.on('init', (next) => {
    Form.model.find(query).exec((err, results) => {
      locals.results = locals.results.concat(results);
      next();
    });
  });

  view.render('search');
};


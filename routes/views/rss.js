import async from 'async';
import RSS from 'rss';
import keystone from 'keystone';

const Publication = keystone.list('Publication');
const Article = keystone.list('Article');
const EventEntry = keystone.list('Evententry');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home';

  let elements = [];
  async.series([
    (cb) => {
      Article.model.find({'frontpage': true})
        .sort('-createdAt')
        .limit(5)
        .exec((err, news) => {
          elements = elements.concat(news);
          cb();
        });  
    },
    (cb) => {
      Publication.model.find()
        .sort('-createdAt')
        .limit(5)
        .exec((err, pubs) => {
          elements = elements.concat(pubs)
          cb();
        }); 
    },
    (cb) => {
      EventEntry.model
        .find({'eventtype': {$in: ['medlem', 'dancon']}})
        .sort('-createdAt')
        .limit(5)
        .exec((err, events) => {
          elements = elements.concat(events)
          cb();
        }); 
    }
  ], () => {
    let feed = new RSS({
      title: 'Science Fiction Cirklen',
      description: 'Seneste nyt fra www.sciencefiction.dk',
      feed_url: 'http://www.sciencefiction.dk/feed/rss',
      site_url: 'http://www.sciencefiction.dk',
      language: 'da',
      ttl: 60*12
    });
    elements = elements.sort((a, b) => {
      // let adate = a.createdAt || a.pubdate || a.startAt;
      // let bdate = b.createdAt || b.pubdate || b.startAt;
      // return adate > bdate ? 1 : -1;
      return a.createdAt < b.createdAt ? 1 : -1;
    });
      
    elements.forEach((e) => {
      feed.item({
        title: e.title,
        url: 'http://www.sciencefiction.dk' + e.articleUrl,
        description: e.intro,
        date: e.createdAt
      });
    });

    res.set('Content-Type', 'application/rss+xml');
    return res.send(feed.xml()); 
  });
};



import keystone from 'keystone';
const Publication = keystone.list('Publication');

exports = module.exports = function(done) {
  Publication.model.find().exec((err, pubs) => {
    pubs.forEach((pub) => {
      pub.createdAt = pub.pubdate;
      pub.save();
    });
    done();
  });
};

import keystone from 'keystone';
const Form = keystone.list('Form');
const FormSubmit = keystone.list('Formsubmit');

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res);
  const locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'articles';

  view.on('init', (next) => {
    Form.model.findOne()
      .where('key', req.params.key)
      .exec((err, form) => {
        if(!form) {
          return res.status(404).render('errors/404');
        }
        locals.form = form;
        next();
      });
  });

  view.on('post', (next) => {
    var submit = new FormSubmit.model();
    var updater = submit.getUpdateHandler(req);

    updater.process(req.body, {}, (err) => {
      submit.sendEmails(locals.form);
      locals.message = locals.form.successMessage;
      next();
    });
  });
  view.render('form');
};


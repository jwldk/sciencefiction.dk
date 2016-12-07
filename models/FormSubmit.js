import keystone from 'keystone';
import Email from 'keystone-email';
const Types = keystone.Field.Types;

const FormSubmit = new keystone.List('Formsubmit', {
  nocreate: true
});

const SUBJECTS = {
  bestilling: { receipt: 'Din bestilling hos SFC', kasserer: 'Ny bestilling' },
  medlemskab: { receipt: 'Tak for din indmeldelse', kasserer: 'Nyt medlem' },
  'proxima-abonnement': { receipt: 'Dit abonnement på Proxima', kasserer: 'Ny Proxima abonnement' }
};

FormSubmit.add({
  createdAt: { type: Types.Date, default: Date.now },
  name: { type: Types.Text },
  email: { type: Types.Email },
  address: { type: Types.Textarea },
  order: { type: Types.Textarea },
  member: { type: Types.Boolean },
  prepaid: { type: Types.Boolean },
  formtype: { type: Types.Select, options: 'bestilling, proxima-abonnement, medlemskab' }
});

FormSubmit.schema.methods.sendEmails = function(form) {
  let formsubmit = this;
  new Email('templates/emails/receipt.pug', { 
    transport: 'mailgun'
  }).send({formsubmit: formsubmit, form: form}, {
    apiKey: keystone.get('mailgun api'),
    domain: keystone.get('mailgun domain'),
    to: formsubmit.email,
    from: {
      name: 'Science Fiction Cirklen',
      email: 'kasserer@sciencefiction.dk'
    },
    subject: SUBJECTS[formsubmit.formtype].receipt,
    'o:tracking': false
  }, (err, res) => {
    console.log(err);
    console.log(res);
  });

  new Email('templates/emails/inbox.pug', { 
    transport: 'mailgun'
  }).send({formsubmit: formsubmit, form: form}, {
    apiKey: keystone.get('mailgun api'),
    domain: keystone.get('mailgun domain'),
    to: 'kasserer@sciencefiction.dk',
    from: {
      name: 'Science Fiction Cirklen',
      email: 'kasserer@sciencefiction.dk'
    },
    subject: SUBJECTS[formsubmit.formtype].kasserer,
    'o:tracking': false
  }, (err, res) => {
    console.log(err);
    console.log(res);
  });
};

FormSubmit.defaultSort = '-createdAt';
FormSubmit.defaultColumns = 'name, formtype, createdAt';
FormSubmit.register();



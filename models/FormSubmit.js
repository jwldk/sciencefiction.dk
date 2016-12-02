import keystone from 'keystone';
const Types = keystone.Field.Types;

const FormSubmit = new keystone.List('Formsubmit', {
  nocreate: true
});

FormSubmit.add({
  createdAt: { type: Types.Date, default: Date.now },
  name: { type: Types.Text },
  email: { type: Types.Email },
  address: { type: Types.Textarea },
  order: { type: Types.Textarea },
  member: { type: Types.Boolean },
  prepaid: { type: Types.Boolean },
  formtype: { type: Types.Select, options: 'bestilling, proxima, medlem' }
});

FormSubmit.defaultSort = '-createdAt';
FormSubmit.defaultColumns = 'name, formtype, createdAt';
FormSubmit.register();



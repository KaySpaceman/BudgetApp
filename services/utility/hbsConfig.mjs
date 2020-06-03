import hbs from 'hbs';

export default function configure(__dirname) {
  hbs.registerPartials(`${__dirname}/views/partials`);
  hbs.registerHelper(
    'isEqual',
    (arg1, arg2, options) => ((arg1 === arg2) ? options.fn(this) : options.inverse(this)),
  );
  hbs.registerHelper('inc', (value) => parseInt(value, 10) + 1);
  hbs.registerHelper('json', (context) => JSON.stringify(context));
}

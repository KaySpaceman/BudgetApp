import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import nodeSassMiddleware from 'node-sass-middleware';
import expressFileupload from 'express-fileupload';
import indexRouter from './routes/index.mjs';
import transactionRouter from './routes/transactions.mjs';
import chartRouter from './routes/charts.mjs';
import categoryRouter from './routes/categories.mjs';
import accountRouter from './routes/account.mjs';
import expressVue from 'express-vue';
import connectDb from './services/database/connector.mjs';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

connectDb();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(nodeSassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true,
}));
app.use(expressFileupload({}));
app.use(express.static(path.join(__dirname, 'public')));
app.listen(process.env.PORT);

const vueOptions = {
  rootPath: path.join(__dirname, 'vue-routes'),
  head: {
    styles: [{ style: '/stylesheets/style.css' }],
    scripts: [
      { src: 'https://code.jquery.com/jquery-3.5.0.min.js' },
      { src: 'https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js' },
    ],
  },
};

const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);

// Routers
app.use('/', indexRouter);
app.use('/transactions', transactionRouter);
app.use('/charts', chartRouter);
app.use('/categories', categoryRouter);
app.use('/account', accountRouter);

export default app;

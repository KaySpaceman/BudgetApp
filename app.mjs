import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import nodeSassMiddleware from 'node-sass-middleware';
import expressFileupload from 'express-fileupload';
import indexRouter from './routes/index.mjs';
import usersRouter from './routes/transactions.mjs';
import hbs from 'hbs';
import { fileURLToPath } from 'url';
import hbsConfig from './services/utility/hbsConfig.mjs';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

hbsConfig(__dirname);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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

// Routers
app.use('/', indexRouter);
app.use('/transactions', usersRouter);

export default app;

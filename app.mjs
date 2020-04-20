import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import nodeSassMiddleware from 'node-sass-middleware';
import expressFileupload from 'express-fileupload';
import indexRouter from './routes/index.mjs';
import usersRouter from './routes/users.mjs';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(nodeSassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true,
}));
app.use(expressFileupload({}));
app.use(express.static(path.join(__dirname, 'public')));
app.listen(process.env.PORT);

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
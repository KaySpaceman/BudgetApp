import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index.mjs';
import transactionRouter from './routes/transactions.mjs';
import chartRouter from './routes/charts.mjs';
import categoryRouter from './routes/categories.mjs';
import accountRouter from './routes/account.mjs';
import connectDb from './services/database/connector.mjs';

const app = express();

connectDb();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.listen(process.env.PORT);

// Routers
app.use('/', indexRouter);
app.use('/transactions', transactionRouter);
app.use('/charts', chartRouter);
app.use('/categories', categoryRouter);
app.use('/account', accountRouter);

export default app;

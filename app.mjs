import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import homeRouter from './routes/home.mjs';
import accountRouter from './routes/account.mjs';
import bankRouter from './routes/bank.mjs';
import transactionRouter from './routes/transactions.mjs';
import chartRouter from './routes/charts.mjs';
import categoryRouter from './routes/categories.mjs';
import connectDb from './services/database/connector.mjs';

const app = express();

connectDb();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.listen(process.env.PORT);

// Routers
app.use('/', homeRouter);
app.use('/account', accountRouter);
app.use('/bank', bankRouter);
app.use('/transactions', transactionRouter);
app.use('/charts', chartRouter);
app.use('/categories', categoryRouter);

export default app;

const express = require('express');
const app = express();
const { apiRouter } = require('./routers/apiRouter');
const {
  customExpressErrors,
  psqlErrors,
  send500Error
} = require('./errorHandling');
app.use(express.json());

app.use('/api', apiRouter);

app.get('/', function(req, res) {
  res.send('root');
});

app.all('/*', (req, res, next) =>
  next({ status: 404, message: '404: File Not Found' })
);

app.use(customExpressErrors);

app.use(psqlErrors);

app.use(send500Error);

module.exports = app;

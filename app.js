const express = require('express');
const app = express();
const { apiRouter } = require('./routers/apiRouter');
const { customExpressErrors, psqlErrors } = require('./errorHandling');
app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res, next) =>
  next({ status: 404, message: '404: File Not Found' })
);

app.use(customExpressErrors);

app.use(psqlErrors);

app.use((err, req, res, next) => {
  console.log(err);
});

module.exports = app;
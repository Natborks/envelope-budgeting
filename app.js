var express = require('express');
var requestInfologger = require('morgan');
var logger = require('./util/logger')
var middlerware = require('./util/middleware')
var mongoose = require('mongoose')
var config = require('./util/config')

var envelopeRouter = require('./controllers/envelope')

var app = express();

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to db @:', config.MONGODB_URI);
  })
  .catch(error => {
    logger.error(error.message)
  })

app.use(requestInfologger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/api/envelopes', envelopeRouter)

// catch 404 and forward to error handler
app.use(middlerware.unknownRoute);

// error handler
app.use(middlerware.errorHandler);

app.listen(config.PORT, () => {
    logger.info(`listening on port ${config.PORT}`)
})
module.exports = app;

var createError = require('http-errors');
var express = require('express');
var requestInfologger = require('morgan');
var logger = require('./util/logger')
var middlerware = require('./util/middleware')
var PORT = 3001;

var envelopeRouter = require('./controllers/envelope')

var app = express();

app.use(requestInfologger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/envelopes', envelopeRouter)

// catch 404 and forward to error handler
app.use(middlerware.unknownRoute);

// error handler
app.use(middlerware.error);

app.listen(PORT, () => {
    logger.info(`listening on port ${PORT}`)
})
module.exports = app;

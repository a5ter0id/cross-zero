let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', require('./routes/index'));
app.use('/index', require('./routes/index'));
app.use('/index.html', require('./routes/index'));

app.use('/history', require('./routes/history'));
app.use('/history.html', require('./routes/history'));

app.use('/about', require('./routes/about'));
app.use('/about.html', require('./routes/about'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

let server = require('http').createServer(app);
let engine = require('./game')(server);

//to preserve some items in the config file is a good idea
//in the future it needs to refactor
let port = 80;
server.listen(port, function () {
    console.log('Game server waite income connections on port:' + port);
});

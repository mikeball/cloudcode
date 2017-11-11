const app = require('express')();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const morgan = require('morgan');
const serveStatic = require('serve-static');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const mongoose = require('mongoose');
const passport = require('passport');

const dbConfig = require('./config/db');
const passportConfig = require('./config/passport');
const sessionConfig = require('./config/session');

const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000;

const server = app.listen(port);
const io = require('socket.io').listen(server);

mongoose.connect(dbConfig.url); // connect to the db

// setup express
app.use(morgan(':date[clf] :method :url :status :response-time ms - :res[content-length]'));
app.use(cookieParser()); // read cookies
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'pug');
app.set('views', './views');

// for passport
const store = new MongoStore({ mongooseConnection: mongoose.connection });
app.use(session(sessionConfig(app, store)));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
passportConfig(passport); // pass passport for configuration
app.use(flash()); // use connect-flash for flash messages stored in session

// routing
app.use(serveStatic('./'));
require('./routes/api')(app, passport);
require('./routes/pages')(app);

// socket,io
require('./sockets')(io);

/* eslint-disable no-console */
console.log(app.get('env'));
console.log('✔ Express server listening on port', port);

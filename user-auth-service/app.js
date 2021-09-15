var createError = require('http-errors');
var express = require('express');
const bodyParser = require("body-parser");
var logger = require('morgan');
var bcrypt = require('bcrypt');

if (process.env.NODE_ENV !== 'production') {
  // load environment variable from .env; needed for ./utils/database
  require('dotenv').config()
}

var database = require('./utils/database')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var authRouter = require('./routes/auth');
var jwtRouter = require('./routes/jwt');



const tracer = initTracer(process.env.JAEGER_SERVICE_NAME);
const opentracing = require('opentracing')
opentracing.initGlobalTracer(tracer);

var app = express();

app.use(tracingMiddleWare);
initDb();

app.use(logger('dev'));

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/auth', authRouter);
app.use('/.well-known', jwtRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;

/**
 * Initialize Jaeger Tracing.
 * @param serviceName
 * @returns {*}
 */
function initTracer(serviceName) {
  const initJaegerTracer = require('jaeger-client').initTracerFromEnv

  // Sampler set to const 1 to capture every request, do not do this for production
  const config = {
    serviceName: serviceName
  }
  // Only for DEV the sampler will report every span
  // Other sampler types are described here: https://www.jaegertracing.io/docs/1.7/sampling/
  config.sampler = { type: 'const', param: 1 }

  return initJaegerTracer(config)
}

/**
 * Initializes database.
 * @param param
 */
async function initDb() {
  console.log("Start initializing database.")
  await database.dbConnection.query(database.createUserTableQuery);
  await database.dbConnection.query(database.createTokenTableQuery);
  await database.dbConnection.query(database.createRoleTableQuery);
  await database.dbConnection.query(database.createRoleUserTableQuery);

  const adManagerRole = "AD_MANAGER";

  const adManagerAlreadyExists = await database.dbConnection.query(database.selectUserForRole, [adManagerRole])
    .then((response) => {
      return response.length !== undefined && response.length > 0 && response[0].length > 0;
    });

  if (!adManagerAlreadyExists) {
    const userName = "admanager";
    const userPw = "admanager";
    const pwHash = await bcrypt.hash(userPw, 10);
    const adManagerUserId = await database.dbConnection.query(database.insertUserQuery, [userName, pwHash])
      .then((response) => { return response[0].insertId });

    const adManagerRoleId = await database.dbConnection.query(database.insertRoleQuery, [adManagerRole])
      .then((response) => { return response[0].insertId });

    if (adManagerRoleId == null || adManagerUserId == null) {
      console.error("The 'admanager' user could not be inserted.");
      return;
    } else {
      await database.dbConnection.query(database.insertUserToRoleQuery, [adManagerUserId, adManagerRoleId]);
    }
  }

  console.log("Finished initializing database.")
}

function tracingMiddleWare(req, res, next) {
  const tracer = opentracing.globalTracer();
  // Extracting the tracing headers from the incoming http request
  const wireCtx = tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.headers)
  // Creating our span with context from incoming request
  const span = tracer.startSpan(req.path, { childOf: wireCtx })
  // Use the log api to capture a log
  span.log({ event: 'request_received' })

  // Use the setTag api to capture standard span tags for http traces
  span.setTag(opentracing.Tags.HTTP_METHOD, req.method)
  span.setTag(opentracing.Tags.SPAN_KIND, opentracing.Tags.SPAN_KIND_RPC_SERVER)
  const baseUrl = req.protocol + "://" + req.headers["host"] + req.path
  span.setTag(opentracing.Tags.HTTP_URL, baseUrl)

  // include trace ID in headers so that we can debug slow requests we see in
  // the browser by looking up the trace ID found in response headers
  const responseHeaders = {}
  tracer.inject(span, opentracing.FORMAT_HTTP_HEADERS, responseHeaders)
  res.set(responseHeaders)

  // add the span to the request object for any other handler to use the span
  Object.assign(req, { span })

  // finalize the span when the response is completed
  const finishSpan = () => {
    if (res.statusCode >= 500) {
      // Force the span to be collected for http errors
      span.setTag(opentracing.Tags.SAMPLING_PRIORITY, 1)
      // If error then set the span to error
      span.setTag(opentracing.Tags.ERROR, true)

      // Response should have meaning info to futher troubleshooting
      span.log({ event: 'error', message: res.statusMessage })
    }
    // Capture the status code
    span.setTag(opentracing.Tags.HTTP_STATUS_CODE, res.statusCode)
    span.log({ event: 'request_end' })
    span.finish()
  }
  res.on('finish', finishSpan)
  next()
}
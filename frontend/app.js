const express = require('express');

const axios = require('axios');
const expressOpentracing = require('express-opentracing').default;
const {initTracerFromEnv} = require('jaeger-client');
const createAxiosTracing = require('axios-opentracing').default;

const http = require('http')
const nunjucks = require('nunjucks')
const path = require('path')
const sassMiddleware = require('node-sass-middleware')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const winston = require('winston');

const site = require("./site");

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'frontend' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

// Override the base console log with winston

console.error = function () {
    return logger.error.apply(logger, arguments)
}
console.info = function () {
    return logger.warn.apply(logger, arguments)
}

// set default environment variables if not set

if (!process.env.JAEGER_SERVICE_NAME) {
    process.env.JAEGER_SERVICE_NAME = "frontend";
}

if (!process.env.JAEGER_SAMPLER_TYPE) {
    process.env.JAEGER_SAMPLER_TYPE = "const";
}

if (!process.env.JAEGER_SAMPLER_PARAM) {
  process.env.JAEGER_SAMPLER_PARAM = "1";
}

if (!process.env.MICROBLOG_SERVICE_ADDRESS) {
  process.env.MICROBLOG_SERVICE_ADDRESS = "localhost:8080";
}

if (!process.env.PROXY_SERVICE_ADDRESS) {
  process.env.PROXY_SERVICE_ADDRESS = "localhost:8081";
}

logger.info("MICROBLOG_SERVICE_ADDRESS is set to " + process.env.MICROBLOG_SERVICE_ADDRESS)
logger.info("PROXY_SERVICE_ADDRESS is set to " + process.env.PROXY_SERVICE_ADDRESS)

let app = express()

nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.use(sassMiddleware({
  src: path.join(__dirname, 'styles'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}))

app.use(express.static(path.join(__dirname, 'public')))

// Setup tracer
const tracer = initTracerFromEnv({
  serviceName: process.env.JAEGER_SERVICE_NAME,
}, {
  logger: logger,
});
// using global tracer
const applyTracingInterceptors = createAxiosTracing(tracer);

app.use(expressOpentracing({tracer}));

// enable cookie parsing
app.use(cookieParser())
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// setup 2 custom axios instance that are configured to talk to our
// two other microservices (MICROBLOG and PROXY) and have Jaeger tracing enabled
app.use((req, res, next) => {
  const API = axios.create({
    baseURL: "http://" + process.env.MICROBLOG_SERVICE_ADDRESS,
    // forward username cookie
    headers: req.cookies.username ? { "Cookie": "username=" + req.cookies.username } : {}
  });

  const PROXY = axios.create({
    baseURL: "http://" + process.env.PROXY_SERVICE_ADDRESS
  });

  applyTracingInterceptors(API, {span: req.span});
  applyTracingInterceptors(PROXY, {span: req.span});

  req.API = API;
  req.PROXY = PROXY;
  req.LOGGER = logger;

  next();
});

// register all the routes
app.use('/', site);

const server = http.createServer(app)
server.listen('3000', () => {
  logger.info('Listening on port 3000')
})

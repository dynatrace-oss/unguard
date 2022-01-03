const express = require('express');

const axios = require('axios');
const expressOpentracing = require('@w3d3/express-opentracing').default;
const { initTracerFromEnv } = require('jaeger-client');
const createAxiosTracing = require('@w3d3/axios-opentracing').default;

const http = require('http');
const nunjucks = require('nunjucks');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const winston = require('winston');
const { extendURL } = require("./controller/utilities.js");

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

    // load environment variable from .env
    require('dotenv').config()
}

// Override the base console log with winston

console.error = function () {
    return logger.error.apply(logger, arguments)
};
console.info = function () {
    return logger.warn.apply(logger, arguments)
};

// log all environment variables
logger.info("JAEGER_SERVICE_NAME is set to " + process.env.JAEGER_SERVICE_NAME);
logger.info("JAEGER_AGENT_HOST is set to " + process.env.JAEGER_AGENT_HOST);
logger.info("JAEGER_SAMPLER_TYPE is set to " + process.env.JAEGER_SAMPLER_TYPE);
logger.info("JAEGER_SAMPLER_PARAM is set to " + process.env.JAEGER_SAMPLER_PARAM);
logger.info("MICROBLOG_SERVICE_ADDRESS is set to " + process.env.MICROBLOG_SERVICE_ADDRESS);
logger.info("PROXY_SERVICE_ADDRESS is set to " + process.env.PROXY_SERVICE_ADDRESS);
logger.info("AD_SERVICE_ADDRESS is set to " + process.env.AD_SERVICE_ADDRESS);
logger.info("USER_AUTH_SERVICE_ADDRESS is set to "+ process.env.USER_AUTH_SERVICE_ADDRESS);
logger.info("FRONTEND_BASE_PATH is set to "+ process.env.FRONTEND_BASE_PATH);
logger.info("AD_SERVICE_BASE_PATH is set to "+ process.env.AD_SERVICE_BASE_PATH);

let app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app
}).addGlobal('extendURL', extendURL)

app.use(sassMiddleware({
  src: path.join(__dirname, 'styles'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true,
  prefix: process.env.FRONTEND_BASE_PATH
}));

// serve frontend JS at /js
app.use(process.env.FRONTEND_BASE_PATH + "/js/jquery", express.static(path.join(__dirname, "node_modules/jquery/dist")));
app.use(process.env.FRONTEND_BASE_PATH + "/js/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

app.use(process.env.FRONTEND_BASE_PATH, express.static(path.join(__dirname, 'public')));
// for non generated content, serve the static folder
app.use(process.env.FRONTEND_BASE_PATH, express.static(path.join(__dirname, 'static')));

// Setup tracer
const tracer = initTracerFromEnv({
  serviceName: process.env.JAEGER_SERVICE_NAME,
}, {
  logger: logger,
});
// using global tracer
const applyTracingInterceptors = createAxiosTracing(tracer);

// enable express server side tracing
app.use(expressOpentracing({tracer}));

// enable cookie parsing
app.use(cookieParser());
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// setup 2 custom axios instance that are configured to talk to our
// two other microservices (MICROBLOG and PROXY) and have Jaeger tracing enabled
app.use((req, res, next) => {
  const API = axios.create({
    baseURL: "http://" + process.env.MICROBLOG_SERVICE_ADDRESS,
    // forward username cookie
    headers: req.cookies.jwt ? { "Cookie": "jwt=" + req.cookies.jwt } : {}
  });

  const PROXY = axios.create({
    baseURL: "http://" + process.env.PROXY_SERVICE_ADDRESS
  });

  const USER_AUTH_API = axios.create({
    baseURL: "http://" + process.env.USER_AUTH_SERVICE_ADDRESS,
    // forward username cookie
    headers: req.cookies.jwt ? { "Cookie": "jwt=" + req.cookies.jwt } : {}
  });

  const AD_SERVICE_API = axios.create({
    baseURL: "http://" + process.env.AD_SERVICE_ADDRESS + process.env.AD_SERVICE_BASE_PATH,
    // forward cookie
    headers: req.cookies.jwt ? { "Cookie": "jwt=" + req.cookies.jwt} : {},
  });

  applyTracingInterceptors(API, {span: req.span});
  applyTracingInterceptors(PROXY, {span: req.span});
  applyTracingInterceptors(USER_AUTH_API, {span: req.span});
  applyTracingInterceptors(AD_SERVICE_API, {span: req.span});

  req.API = API;
  req.PROXY = PROXY;
  req.LOGGER = logger;
  req.USER_AUTH_API = USER_AUTH_API;
  req.AD_SERVICE_API = AD_SERVICE_API;

  next();
});

// register all the routes
app.use(process.env.FRONTEND_BASE_PATH, site);

const server = http.createServer(app)
server.listen('3000', () => {
  logger.info('Listening on port 3000');
});

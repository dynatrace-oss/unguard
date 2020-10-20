const express = require('express');

const axios = require('axios');
const expressOpentracing = require('express-opentracing').default;
const {initTracerFromEnv} = require('jaeger-client');
const createAxiosTracing = require('axios-opentracing').default;

const http = require('http')
const nunjucks = require('nunjucks')
const path = require('path')
const sassMiddleware = require('node-sass-middleware')
const site = require("./site");

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'frontend' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
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
  serviceName: 'frontend',
}, {
  tags: {
    'frontend.version': '0.0.1',
  },
  logger: logger,
});
// using global tracer
const applyTracingInterceptors = createAxiosTracing(tracer);

app.use(expressOpentracing({tracer}));

app.use((req, res, next) => {
  const API = axios.create({
    baseURL: 'https://example.com'
  });

  applyTracingInterceptors(API, {span: req.span});

  req.API = API;

  next();
});

app.get('/', site.index);

// TODO replace with real paths
app.get('/some/path', (req, res) => {
  req.API.get('http://example.com').then((response) => res.end(response.data));
});

let server = http.createServer(app)
server.listen('3000', () => {
  logger.info('Listening on port 3000')
})

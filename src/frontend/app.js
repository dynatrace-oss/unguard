/*
Copyright 2023 Dynatrace LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const express = require('express');

const axios = require('axios');
const expressOpentracing = require('@w3d3/express-opentracing').default;
const {initTracerFromEnv} = require('jaeger-client');
const createAxiosTracing = require('@w3d3/axios-opentracing').default;

const http = require('http');
const nunjucks = require('nunjucks');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const winston = require('winston');
const {extendURL} = require("./controller/utilities.js");
const {loggerFactory} = require('./controller/loggerFactory');

const site = require("./site");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const microserviceLoggerFactory = new loggerFactory(winston);

const frontendLogger = microserviceLoggerFactory.create('FRONTEND');
const microblogLogger = microserviceLoggerFactory.create('MICROBLOG_API');
const proxyLogger = microserviceLoggerFactory.create('PROXY');
const userAuthApiLogger = microserviceLoggerFactory.create('USER_AUTH_API');
const adServiceApiLogger = microserviceLoggerFactory.create('AD_SERVICE_API');
const membershipServiceApiLogger = microserviceLoggerFactory.create('MEMBERSHIP_SERVICE_API');
const statusServiceApiLogger = microserviceLoggerFactory.create('STATUS_SERVICE_API');
const profileServiceLogger = microserviceLoggerFactory.create('PROFILE_SERVICE_API');

// log all environment variables
frontendLogger.info("JAEGER_SERVICE_NAME is set to " + process.env.JAEGER_SERVICE_NAME);
frontendLogger.info("JAEGER_AGENT_HOST is set to " + process.env.JAEGER_AGENT_HOST);
frontendLogger.info("JAEGER_SAMPLER_TYPE is set to " + process.env.JAEGER_SAMPLER_TYPE);
frontendLogger.info("JAEGER_SAMPLER_PARAM is set to " + process.env.JAEGER_SAMPLER_PARAM);
frontendLogger.info("MICROBLOG_SERVICE_ADDRESS is set to " + process.env.MICROBLOG_SERVICE_ADDRESS);
frontendLogger.info("PROXY_SERVICE_ADDRESS is set to " + process.env.PROXY_SERVICE_ADDRESS);
frontendLogger.info("AD_SERVICE_ADDRESS is set to " + process.env.AD_SERVICE_ADDRESS);
frontendLogger.info("STATUS_SERVICE_ADDRESS is set to " + process.env.STATUS_SERVICE_ADDRESS);
frontendLogger.info("USER_AUTH_SERVICE_ADDRESS is set to " + process.env.USER_AUTH_SERVICE_ADDRESS);
frontendLogger.info("FRONTEND_BASE_PATH is set to " + process.env.FRONTEND_BASE_PATH);
frontendLogger.info("AD_SERVICE_BASE_PATH is set to " + process.env.AD_SERVICE_BASE_PATH);
frontendLogger.info("STATUS_SERVICE_BASE_PATH is set to " + process.env.STATUS_SERVICE_BASE_PATH);
frontendLogger.info("PROFILE_SERVICE_ADDRESS is set to " + process.env.PROFILE_SERVICE_ADDRESS);

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
    logger: frontendLogger,
});
// using global tracer
const applyTracingInterceptors = createAxiosTracing(tracer);

// enable express server side tracing
app.use(expressOpentracing({ tracer }));

// enable cookie parsing
app.use(cookieParser());
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// setup 6 custom axios instances configured to talk to each microservice respectively
// (MICROBLOG_API, PROXY, USER_AUTH_API, AD_SERVICE_API, PROFILE_SERVICE_API and STATUS_SERVICE_API). All with Jaeger tracing enabled
app.use((req, res, next) => {
    const MICROBLOG_API = axios.create({
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
        headers: req.cookies.jwt ? {"Cookie": "jwt=" + req.cookies.jwt} : {}
    });

    const AD_SERVICE_API = axios.create({
        baseURL: "http://" + process.env.AD_SERVICE_ADDRESS + process.env.AD_SERVICE_BASE_PATH,
        // forward cookie
        headers: req.cookies.jwt ? {"Cookie": "jwt=" + req.cookies.jwt} : {},
    });

    const MEMBERSHIP_SERVICE_API = axios.create({
        baseURL: "http://" + process.env.MEMBERSHIP_SERVICE_ADDRESS + process.env.MEMBERSHIP_SERVICE_BASE_PATH,
    });

    const PROFILE_SERVICE_API = axios.create({
        baseURL: "http://" + process.env.PROFILE_SERVICE_ADDRESS,
        // forward cookie
        headers: req.cookies.jwt ? {"Cookie": "jwt=" + req.cookies.jwt} : {}
    });

	const STATUS_SERVICE_API = axios.create({
		baseURL: "http://" + process.env.STATUS_SERVICE_ADDRESS + process.env.STATUS_SERVICE_BASE_PATH,
	});

	applyTracingInterceptors(MICROBLOG_API, {span: req.span});
	applyTracingInterceptors(PROXY, {span: req.span});
	applyTracingInterceptors(USER_AUTH_API, {span: req.span});
	applyTracingInterceptors(AD_SERVICE_API, {span: req.span});
	applyTracingInterceptors(STATUS_SERVICE_API, {span: req.span});
    applyTracingInterceptors(PROFILE_SERVICE_API, {span: req.span});

    MICROBLOG_API.interceptors.response.use(undefined, function (error) {
        microblogLogger.log({level: 'error', message: error, errorType: 'http'});
        return Promise.reject(error)
    });

    PROXY.interceptors.response.use(undefined, function (error) {
        proxyLogger.log({level: 'error', message: error, errorType: 'http'});
        return Promise.reject(error)
    });

    USER_AUTH_API.interceptors.response.use(undefined, function (error) {
        userAuthApiLogger.log({level: 'error', message: error, errorType: 'http'});
        return Promise.reject(error)
    });

    AD_SERVICE_API.interceptors.response.use(undefined, function (error) {
        adServiceApiLogger.log({level: 'error', message: error, errorType: 'http'});
        return Promise.reject(error)
    });

    MEMBERSHIP_SERVICE_API.interceptors.response.use(undefined, function (error) {
        membershipServiceApiLogger.log({level: 'error', message: error, errorType: 'http'});
        return Promise.reject(error)
    });

    PROFILE_SERVICE_API.interceptors.response.use(undefined, function (error) {
        profileServiceLogger.log({level: 'error', message: error, errorType: 'http'});
        return Promise.reject(error)
    });

    STATUS_SERVICE_API.interceptors.response.use(undefined, function (error) {
        statusServiceApiLogger.log({ level: 'error', message: error, errorType: 'http' });
        return Promise.reject(error)
    });

    req.MICROBLOG_API = MICROBLOG_API;
    req.PROXY = PROXY;
    req.USER_AUTH_API = USER_AUTH_API;
    req.AD_SERVICE_API = AD_SERVICE_API;
    req.MEMBERSHIP_SERVICE_API = MEMBERSHIP_SERVICE_API;
    req.STATUS_SERVICE_API = STATUS_SERVICE_API;
    req.PROFILE_SERVICE_API = PROFILE_SERVICE_API;

    next();
});

// register all the routes
app.use(process.env.FRONTEND_BASE_PATH, site);

const server = http.createServer(app)
server.listen('3000', () => {
    frontendLogger.info('Listening on port 3000');
});

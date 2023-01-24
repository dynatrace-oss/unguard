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

const {handleError, statusCodeForError} = require("./controller/errorHandler");
const {getJwtUser, hasJwtRole, getJwtUserId} = require('./controller/cookie');
const {roles} = require('./model/role');
const {extendURL, extendRenderData} = require("./controller/utilities.js");

const adManagerRouter = require('./controller/adManager');

const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();

// Global Timeline route
router.get('/', showGlobalTimeline);
// Personalized Timeline (only works when logged in)
router.get('/my-timeline', showPersonalTimeline);
// User Profile route
router.get('/user/:username', showUserProfile);
// Follow a user
router.post('/user/:username/follow', followUser);
// Create post
router.post('/post', createPost);
// get single post
router.get('/post/:postid', getPost);
// Logout
router.post('/logout', doLogout);
// Login
router.get('/login', showLogin);
router.post('/login', doLogin);
// Register
router.post('/register', registerUser);
router.post('/bio/:username', postBio);
//Membership
router.get('/membership', showMembership);
router.post('/membership/:username', postMembership);

router.use('/ad-manager', adManagerRouter);

function showGlobalTimeline(req, res) {
    fetchUsingDeploymentBase(req, () =>
        Promise.all([
            req.MICROBLOG_API.get('/timeline'),
            getMembership(req)
        ]))
        .then(([timeline, membership]) => {
            let data = extendRenderData({
                data: timeline.data,
                title: 'Timeline',
                username: getJwtUser(req.cookies),
                isAdManager: hasJwtRole(req.cookies, roles.AD_MANAGER),
                baseData: baseRequestFactory.baseData,
                membership: membership.data.membership

            }, req);

            res.render('index.njk', data)
        }, (err) => displayError(err, res));
}

function showPersonalTimeline(req, res) {
    fetchUsingDeploymentBase(req, () =>
        Promise.all([
            req.MICROBLOG_API.get('/mytimeline'),
            getMembership(req)
        ]))
        .then(([myTimeline, membership]) => {
            let data = extendRenderData({
                data: myTimeline.data,
                title: 'My Timeline',
                username: getJwtUser(req.cookies),
                isAdManager: hasJwtRole(req.cookies, roles.AD_MANAGER),
                baseData: baseRequestFactory.baseData,
                membership: membership.data.membership
            }, req);

            res.render('index.njk', data);
        }, (err) => displayError(err, res));
}

function showUserProfile(req, res) {
    const usernameProfile = req.params.username;

    fetchUsingDeploymentBase(req, () =>
        Promise.all([
            getBioText(req),
            req.MICROBLOG_API.get(`/users/${usernameProfile}/posts`),
            getMembership(req)
        ])
    ).then(([bioText, microblogServiceResponse, membership]) => {
        let data = extendRenderData({
            data: microblogServiceResponse.data,
            profileName: usernameProfile,
            username: getJwtUser(req.cookies),
            isAdManager: hasJwtRole(req.cookies, roles.AD_MANAGER),
            bio: bioText,
            baseData: baseRequestFactory.baseData,
            membership: membership.data.membership
        }, req);

        res.render('profile.njk', data);
    }, (err) => displayError(err, res));
}

function getBioText(req) {
    return new Promise((resolve, reject) => {
        req.PROFILE_SERVICE_API.get(`/user/${getJwtUserId(req.cookies)}/bio`)
            .then((response) => {
                resolve(response.data.bioText);
            }).catch(reason => {
            // If a bio for the userId doesn't exist yet and a status code 404 is returned, this catch block will set
            // the bioText to an empty string which allows for the profile page to be displayed rather than the error page
            if (statusCodeForError(reason) === 404) {
                resolve("");
            } else {
                reject(reason)
            }
        })
    });
}

function showMembership(req, res) {
    fetchUsingDeploymentBase(req, () => getMembership(req))
        .then((membership) => {
            let data = extendRenderData({
                title: 'Membership',
                username: getJwtUser(req.cookies),
                isAdManager: hasJwtRole(req.cookies, roles.AD_MANAGER),
                baseData: baseRequestFactory.baseData,
                membership: membership.data.membership
            }, req);

            res.render('membership.njk', data);
        }, (err) => displayError(err, res));
}

function getMembership(req) {
    let jwtUserId = getJwtUserId(req.cookies);
    if (!jwtUserId) {
        return Promise.resolve();
    }

    return req.MEMBERSHIP_SERVICE_API.get(`/${jwtUserId}`);
}

function doLogout(req, res) {
    res.clearCookie('jwt');
    res.redirect(extendURL('/'));
}

function showLogin(req, res) {
    const data = {
        reg_success: req.query.reg_success,
        login_fail: req.query.login_fail
    }
    res.render('login.njk', data);
}

function doLogin(req, res) {
    const usernameToLogin = req.body.username;
    const passwordToLogin = req.body.password;
    if (!usernameToLogin || !passwordToLogin) {
        res.render('error.njk', {error: "Username and password must be supplied to login"});
        return;
    }

    fetchUsingDeploymentBase(req, () => req.USER_AUTH_API
        .post("/user/login", {
            "username": usernameToLogin,
            "password": passwordToLogin
        }))
        .then(response => {
            if (response.data.jwt) {
                res.cookie("jwt", response.data.jwt);
                res.redirect(extendURL('/'));
            } else {
                res.redirect(extendURL('/login'));
            }
        }, (err) => displayError(err, res));
}

function registerUser(req, res) {
    const usernameToLogin = req.body.username;
    const passwordToLogin = req.body.password;
    if (!usernameToLogin || !passwordToLogin) {
        res.render('error.njk', {error: "Username and password must be supplied to register"});
        return;
    }

    fetchUsingDeploymentBase(req, () => req.USER_AUTH_API
        .post("/user/register", {
            "username": usernameToLogin,
            "password": passwordToLogin
        }))
        .then(_ => res.redirect(extendURL('/login')), (err) => displayError(err, res));
}

function followUser(req, res) {
    const usernameProfile = req.params.username;
    fetchUsingDeploymentBase(req, () => req.MICROBLOG_API.post(`/users/${usernameProfile}/follow`))
        .then(_ => {
            res.redirect(extendURL(`/user/${usernameProfile}`));
        }, (err) => displayError(err, res));
}

function createPost(req, res) {
    if (req.body.urlmessage) {
        // if this is set, we call our proxy-service to see what the URL holds
        // the service contains a SSRF vulnerability (or more like all SSRF vulnerabilities)

        fetchUsingDeploymentBase(req, () => req.PROXY.get("/", {
            params: {
                header: req.body.header,
                url: req.body.urlmessage
            }
        }))
            .then((response) => {
                // fetch some metadata out of the proxy response so it was not for nothing
                const $ = cheerio.load(response.data)

                let metaImgSrc = $('meta[property="og:image"]').attr('content')
                if (!metaImgSrc) {
                    // fall back to twitter meta image if no opengraph image is set
                    metaImgSrc = $('meta[property="twitter:image"]').attr('content')
                }

                let metaTitle = $('meta[property="og:title"]').attr('content')
                if (!metaTitle) {
                    // fall back to twitter meta image if no opengraph image is set
                    metaTitle = $('meta[property="twitter:title"]').attr('content')
                }
                if (!metaTitle) {
                    metaTitle = $('title').text()
                }

                return fetchUsingDeploymentBase(req, () => req.MICROBLOG_API.post('/post', {
                    content: `${metaTitle} ${req.body.urlmessage}`,
                    imageUrl: metaImgSrc
                }))
            }, (err) => displayError(err, res))
            .then((postResponse) => res.redirect(extendURL(`/post/${postResponse.data.postId}`)), (err) => displayError(err, res));
    } else if (req.body.imgurl) {
        // the image post calls a different endpoint that has a different ssrf vulnerability
        fetchUsingDeploymentBase(req, () => req.PROXY.get("/image", {
            params: {
                url: req.body.imgurl
            }
        })).then((response) => {
            return fetchUsingDeploymentBase(req, () => req.MICROBLOG_API.post('/post', {
                content: req.body.description,
                imageUrl: response.data
            }));
        }, (err) => displayError(err, res))
            .then((postResponse) => res.redirect(extendURL(`/post/${postResponse.data.postId}`)), (err) => displayError(err, res));
    } else if (req.body.message) {
        // this is a normal message
        fetchUsingDeploymentBase(req, () => req.MICROBLOG_API.post('/post', {
            content: req.body.message
        })).then((postResponse) => {
            res.redirect(extendURL(`/post/${postResponse.data.postId}`));
        }, (err) => displayError(err, res));
    } else {
        // when nothing is set, just redirect back
        res.redirect(extendURL('/'));
    }
}

function getPost(req, res) {
    const postId = req.params.postid;
    fetchUsingDeploymentBase(req, () => req.MICROBLOG_API.get(`/post/${postId}`)).then((response) => {

        let data = extendRenderData({
            post: response.data,
            username: getJwtUser(req.cookies),
            isAdManager: hasJwtRole(req.cookies, roles.AD_MANAGER),
            baseData: baseRequestFactory.baseData
        }, req);

        res.render('singlepost.njk', data);
    }, (err) => displayError(err, res));
}

function postMembership(req, res) {
    const membership = {userid: getJwtUserId(req.cookies), membership: req.body.membershipText};
    fetchUsingDeploymentBase(req, () => req.MEMBERSHIP_SERVICE_API.post('/', membership)).then((response) => {
        res.redirect(extendURL(`/user/${getJwtUser(req.cookies)}`));
    }, (error) => res.status(statusCodeForError(error)).render('error.njk', handleError(error)));

}

function postBio(req, res) {
    req.PROFILE_SERVICE_API.post(`/user/${getJwtUserId(req.cookies)}/bio`, {},
        {
            params: {
                bioText: req.body.bioText,
                enableMarkdown: Boolean(req.body.enableMarkdown)
            }
        })
        .then((_) => {
            res.redirect(extendURL(`/user/${getJwtUser(req.cookies)}`));
        }).catch(error => {
        res.status(statusCodeForError(error)).render('error.njk', handleError(error));
    });
}

/**
 * Creates a new Promise and performs base request before the one specified, this is useful to match the synchronous nature of
 * nunjucks, allowing microservice failures to not affect base requests. e.g deployment service requests will always succeed
 * regardless if login fails.
 *
 * @param req express req context
 * @param requestToAttach function that returns an Axios request to be made after base requests finishes e.g () => Axios.get(url)
 */
function baseRequestFactory(req, requestToAttach) {
    let baseRequests = []

    // static baseData used in base template
    if (typeof baseRequestFactory.baseData == 'undefined') {
        baseRequestFactory.baseData = {};
    }

    return {
        fetchDeploymentDetails: function () {
            baseRequests.push(req.STATUS_SERVICE_API.get('deployments'))
            return this;
        },

        fetchDeploymentHealth: function () {
            baseRequests.push(req.STATUS_SERVICE_API.get('deployments/health'))
            return this;
        },

        fetch: () => {
            return Promise.resolve()
                .then(function () {
                    return Promise.all(baseRequests)
                })
                .then(function (requests) {

                    // populate baseData with base request response
                    requests.forEach((response) => {
                        baseRequestFactory.baseData = {
                            ...baseRequestFactory.baseData,
                            ...response.data,
                        }
                    })

                    return requestToAttach()
                })
        }
    }
}

/**
 *
 * @param req express req context
 * @param endpoint endpoint to consume
 * @returns {Promise<Awaited<unknown>[]>} Promise fetching base requests first and the provided endpoint subsequently
 */
function fetchUsingDeploymentBase(req, endpoint) {
    return baseRequestFactory(req, endpoint)
        .fetchDeploymentHealth()
        .fetchDeploymentDetails()
        .fetch()
}

function displayError(err, res) {
    res.status(statusCodeForError(err)).render('error.njk', {
        ...handleError(err),
        baseData: baseRequestFactory.baseData
    })
}

module.exports = router;

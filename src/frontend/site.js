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

const { handleError, statusCodeForError } = require("./controller/errorHandler");
const { getJwtUser, hasJwtRole, getJwtUserId } = require('./controller/cookie');
const { roles } = require('./model/role');
const { extendURL, extendRenderData } = require("./controller/utilities.js");

const adManagerRouter = require('./controller/adManager');

const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();
const querystring = require('querystring');

// Global Timeline route
router.get('/', showGlobalTimeline);
// Show users
router.get('/users', showUsers);
// Personalized Timeline (only works when logged in)
router.get('/my-timeline', showPersonalTimeline);
// User Profile route
router.get('/user/:username', showUserProfile);
// Follow a user
router.post('/user/:username/follow', followUser);
// Payment method
router.get('/user/:username/payment', showPaymentMethod);
router.post('/user/:username/payment', postPaymentMethod);
// Create post
router.post('/post', createPost);
// get single post
router.get('/post/:postId', getPost);
// Like post
router.get('/like', likePost);
// Unlike post
router.get('/unlike', unlikePost);
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
            getMembershipOfLoggedInUser(req)
        ])).
        then(([timeline, membership]) => {
            insertLikeCountIntoPostArray(req, timeline.data).then(postArray => {
                let data = extendRenderData({
                    data: postArray,
                    title: 'Timeline',
                    username: getJwtUser(req.cookies),
                    isAdManager: hasJwtRole(req.cookies, roles.AD_MANAGER),
                    baseData: baseRequestFactory.baseData,
                    membership: membership.data

                }, req);
                res.render('index.njk', data)
            }, (err) => displayError(err, res))
        }, (err) => displayError(err, res))
}

function showUsers(req, res) {
    let params = {}
    if (req.query.name) {
        params.name = req.query.name
    }
    if(req.query.roles) {
        params.roles = req.query.roles
    }
    fetchUsingDeploymentBase(req, () =>
        Promise.all([
            req.STATUS_SERVICE_API.get('/roles'),
            req.STATUS_SERVICE_API.get('/users', {
                params: params
            }),
            getMembershipOfLoggedInUser(req)
        ]))
        .then(([allRoles, users, membership]) => {
            let data = extendRenderData({
                data: users.data,
                roles: allRoles.data,
                title: 'Users',
                searchTerm: req.query.name,
                searchRoles: req.query.roles,
                shouldRoleBeChecked: (role) => {
                    return (typeof req.query.roles == "string" && req.query.roles == role.name) // only one checkbox checked
                    || (typeof req.query.roles == "object" && req.query.roles.includes(role.name)) // multiple checkboxes checked
                },
                username: getJwtUser(req.cookies),
                isAdManager: hasJwtRole(req.cookies, roles.AD_MANAGER),
                baseData: baseRequestFactory.baseData,
                membership: membership.data

            }, req);
            res.render('users.njk', data);
        }, (err) => displayError(err, res));
}

function showPersonalTimeline(req, res) {
    fetchUsingDeploymentBase(req, () =>
        Promise.all([
            req.MICROBLOG_API.get('/mytimeline'),
            getMembershipOfLoggedInUser(req)
        ]))
        .then(([myTimeline, membership]) => {
            insertLikeCountIntoPostArray(req, myTimeline.data).then(postArray => {
                let data = extendRenderData({
                    data: postArray,
                    title: 'My Timeline',
                    username: getJwtUser(req.cookies),
                    isAdManager: hasJwtRole(req.cookies, roles.AD_MANAGER),
                    baseData: baseRequestFactory.baseData,
                    membership: membership.data
                }, req);
                res.render('index.njk', data);
            }, (err) => displayError(err, res))
        }, (err) => displayError(err, res))
}

function showUserProfile(req, res) {
    const username = req.params.username;
    fetchUsingDeploymentBase(req, () =>
        Promise.all([
            getBioText(req, username),
            req.MICROBLOG_API.get(`/users/${username}/posts`),
            getMembership(req, username)
        ])
    ).then(([bioText, microblogServiceResponse, membership]) => {
        insertLikeCountIntoPostArray(req, microblogServiceResponse.data).then(postArray => {
            let data = extendRenderData({
                data: postArray,
                profileName: username,
                username: getJwtUser(req.cookies),
                isAdManager: hasJwtRole(req.cookies, roles.AD_MANAGER),
                bio: bioText,
                baseData: baseRequestFactory.baseData,
                membership: membership.data
            }, req);

            res.render('profile.njk', data);
        }, (err) => displayError(err, res))
    }, (err) => displayError(err, res));
}

function showPaymentMethod(req, res) {
    const username = req.params.username;
    fetchUsingDeploymentBase(req, () =>
        Promise.all([
            getCreditCardInfo(req),
            getMembership(req, username)
        ])
    ).then(([paymentInformation, membership]) => {
        let data = extendRenderData({
            paymentInformation: paymentInformation,
            profileName: username,
            username: getJwtUser(req.cookies),
            // isAdManager: hasJwtRole(req.cookies, roles.AD_MANAGER),
            baseData: baseRequestFactory.baseData,
            membership: membership.data
        }, req);

        res.render('payment.njk', data);
    }, (err) => displayError(err, res));
}

function postPaymentMethod(req, res) {
    req.PAYMENT_SERVICE_API.post(`/payment-info/${getJwtUserId(req.cookies)}`, {
            cardHolderName: req.body.cardHolderName,
            cardNumber: req.body.cardNumber,
            expiryDate: req.body.expiryDate,
            cvv: req.body.cvv
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((_) => {
            // redirect where the user came from
            res.redirect('back');
        }).catch(error => {
        res.status(statusCodeForError(error)).render('error.njk', handleError(error));
    });
}

function getCreditCardInfo(req) {
    return new Promise((resolve, reject) => {
        req.PAYMENT_SERVICE_API.get(`/payment-info/${getJwtUserId(req.cookies)}`)
            .then((response) => {
                resolve(response.data);
            }).catch(reason => {

            if (statusCodeForError(reason) === 404) {
                resolve({});
            } else {
                reject(reason)
            }
        })
    });
}

function getBioText(req, username) {
    return getUserIdForName(req, username).then((userId) => {
        return new Promise((resolve, reject) => {
            req.PROFILE_SERVICE_API.get(`/user/${userId}/bio`)
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
    });
}

function showMembership(req, res) {
    fetchUsingDeploymentBase(req, () => getMembershipOfLoggedInUser(req))
        .then((membership) => {
            let data = extendRenderData({
                title: 'Membership',
                username: getJwtUser(req.cookies),
                isAdManager: hasJwtRole(req.cookies, roles.AD_MANAGER),
                baseData: baseRequestFactory.baseData,
                membership: membership.data
            }, req);

            res.render('membership.njk', data);
        }, (err) => displayError(err, res));
}

function getMembershipOfLoggedInUser(req) {
    let jwtUserId = getJwtUserId(req.cookies);
    if (!jwtUserId) {
        return Promise.resolve();
    }

    return req.MEMBERSHIP_SERVICE_API.get(`/${jwtUserId}`);
}

function getMembership(req, username) {
    return getUserIdForName(req, username).then((userId) => {
        return req.MEMBERSHIP_SERVICE_API.get(`/${userId}`)
    });
}

function getUserIdForName(req, username) {
    return req.USER_AUTH_API.post('/user/useridForName', {
        "jwt": req.cookies.jwt, "username": username
    }).then((response) => {
        return response.data.userId;
    });
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
    const username = req.params.username;
    fetchUsingDeploymentBase(req, () => req.MICROBLOG_API.post(`/users/${username}/follow`))
        .then(_ => {
            res.redirect(extendURL(`/user/${username}`));
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
    const postId = req.params.postId;
    fetchUsingDeploymentBase(req, () => req.MICROBLOG_API.get(`/post/${postId}`)).then((response) => {
        insertLikeCountIntoPostArray(req, [response.data]).then(postArray => {
            let postData = postArray[0];
            let data = extendRenderData({
                post: postData,
                username: getJwtUser(req.cookies),
                isAdManager: hasJwtRole(req.cookies, roles.AD_MANAGER),
                baseData: baseRequestFactory.baseData
            }, req);

            res.render('singlepost.njk', data);
        }, (err) => displayError(err, res))
    }, (err) => displayError(err, res))
}

function likePost(req, res) {
    const postId = req.query.postId;
    fetchUsingDeploymentBase(req, () => req.LIKE_SERVICE_API.post(`/like/` + postId)).then((response) => {
        res.redirect(extendURL(`/post/${postId}`));
    }, (error) => res.status(statusCodeForError(error)).render('error.njk', handleError(error)));
}

function unlikePost(req, res) {
    const postId = req.query.postId;
    fetchUsingDeploymentBase(req, () => req.LIKE_SERVICE_API.delete(`/like`, {params: {postId: postId}})).then((response) => {
        res.redirect(extendURL(`/post/${postId}`));
    }, (error) => res.status(statusCodeForError(error)).render('error.njk', handleError(error)));
}

function postMembership(req, res) {
    const formData = {
        membership: req.body.membershipText,
    };
    fetchUsingDeploymentBase(req, () =>
        req.MEMBERSHIP_SERVICE_API.post(
            `/add/${getJwtUserId(req.cookies)}`,
            querystring.stringify(formData),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        )
    ).then(
        (response) => {
            res.redirect(extendURL(`/user/${getJwtUser(req.cookies)}`));
        },
        (error) =>
            res
                .status(statusCodeForError(error))
                .render("error.njk", handleError(error))
    );
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

function insertLikeCountIntoPostArray(req, posts) {
    return fetchUsingDeploymentBase(req, () => req.LIKE_SERVICE_API.get(`/like`, { params: { postId: posts.map(post => post.postId) } }))
        .then(likeResponse => likeResponse.data)
        .then(likeData => posts.map(post => {
            let likeCount = likeData.likeCounts.find(likeCount => likeCount.postId == post.postId)?.likeCount ?? 0;
            let userLiked = likeData.likedPosts.some(like => like.postId == post.postId);
            return {...post, likeCount: likeCount, userLiked: userLiked};
    }));
}


/**-
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

const { handleError, statusCodeForError } = require("./errorhandler");
const cheerio = require('cheerio')
const express = require('express');
const router = express.Router();
const jwt_decode = require("jwt-decode");
const utilities = require("./utilities.js");

// Global Timeline route
router.get('/', showGlobalTimeline)
// Personalized Timeline (only works when logged in)
router.get('/mytimeline', showPersonalTimeline)
// User Profile route
router.get('/user/:username', showUserProfile)
// Follow a user
router.post('/user/:username/follow', followUser)
// Create post
router.post('/post', createPost)
// get single post
router.get('/post/:postid', getPost)
// Logout
router.post('/logout', doLogout)
// Login
router.get('/login', showLogin)
router.post('/login', doLogin)
// Register
router.post('/register', registerUser)

function getLoggedInUser(req) {
    if (req.cookies.jwt) {
        return jwt_decode(req.cookies.jwt)["username"];
    }

    return null;
}

function extendRenderData(data, req) {
    return {
        ...data,
        AD_SERVICE_ADDRESS: req.protocol + '://' + req.get('host') + process.env.AD_PATH,
        BASE_URL: req.protocol + '://' + req.get('host') + process.env.BASE_URL
    }
}


function showGlobalTimeline(req, res) {
    req.API.get('/timeline').then((response) => {
        let data = extendRenderData({
            data: response.data,
            title: 'Timeline',
            username: getLoggedInUser(req),
        }, req);

        res.render('index.njk', data)
    }).catch(reason => {
        console.log(reason);
        res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
    });

}

function showPersonalTimeline(req, res) {
    req.API.get('/mytimeline').then((response) => {

        let data = extendRenderData({
            data: response.data,
            title: 'My Timeline',
            username: getLoggedInUser(req)
        }, req);

        res.render('index.njk', data)
    }).catch(reason => {
        res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
    });
}

function showUserProfile(req, res) {
    const usernameProfile = req.params.username;
    req.API.get(`/users/${usernameProfile}/posts`).then((response) => {
        let data = extendRenderData({
            data: response.data,
            profileName: usernameProfile,
            username: getLoggedInUser(req)
        }, req);

        res.render('profile.njk', data)
    }).catch(reason => {
        res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
    });
}

function doLogout(req, res) {
    res.clearCookie('jwt')
    res.redirect(utilities.extendURL(`/`))
}

function showLogin(req, res) {
    const data = {
        reg_success: req.query.reg_success,
        login_fail: req.query.login_fail
    }
    res.render('login.njk', data)
}

function doLogin(req, res) {
    const usernameToLogin = req.body.username;
    const passwordToLogin = req.body.password;
    if (!usernameToLogin || !passwordToLogin) {
        res.render('error.njk', { error: "Username and password must be supplied to login" });
        return;
    }

    req.USER_AUTH_API
        .post("/user/login", {
            "username": usernameToLogin,
            "password": passwordToLogin
        })
        .then(response => {
            if (response.data.jwt) {
                res.cookie("jwt", response.data.jwt)
                res.redirect(utilities.extendURL('/'))
            } else {
                res.redirect(utilities.extendURL('/login'))
            }
        })
        .catch(error => {
            console.log(error)
            res.status(statusCodeForError(error)).render('error.njk', handleError(error));
        })
}

function registerUser(req, res) {
    const usernameToLogin = req.body.username;
    const passwordToLogin = req.body.password;
    if (!usernameToLogin || !passwordToLogin) {
        res.render('error.njk', { error: "Username and password must be supplied to register" });
        return;
    }
    req.USER_AUTH_API
        .post("/user/register", {
            "username": usernameToLogin,
            "password": passwordToLogin
        })
        .then(response => {
            res.redirect(utilities.extendURL('/login'))
        })
        .catch(error => {
            res.status(statusCodeForError(error)).render('error.njk', handleError(error));
        })
}

function followUser(req, res) {
    const usernameProfile = req.params.username;
    req.API.post(`/users/${usernameProfile}/follow`).then((response) => {
        res.redirect(utilities.extendURL(`/user/${usernameProfile}`));
    }).catch(reason => {
        res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
    });
}

function createPost(req, res) {
    if (req.body.urlmessage) {
        // if this is set, we call our proxy-service to see what the URL holds
        // the service contains a SSRF vulnerability (or more like all SSRF vulnerabilities)
        req.PROXY.get("/", {
            params: {
                header: req.body.header,
                url: req.body.urlmessage
            }
        }).then((response) => {
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

            req.API.post('/post', {
                jwt: req.cookies.jwt,
                content: `${metaTitle} ${req.body.urlmessage}`,
                imageUrl: metaImgSrc
            }).then((post_response) => {
                res.redirect(utilities.extendURL(`/post/${post_response.data.postId}`))
            }).catch(reason => {
                res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
            });
        }).catch(reason => {
            res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
        });
    } else if (req.body.imgurl) {
        // the image post calls a different endpoint that has a different ssrf vulnerability
        req.PROXY.get("/image", {
            params: {
                url: req.body.imgurl
            }
        }).then((response) => {
            req.API.post('/post', {
                jwt: req.cookies.jwt,
                content: req.body.description,
                imageUrl: response.data
            }).then((post_response) => {
                res.redirect(utilities.extendURL(`/post/${post_response.data.postId}`))
            }).catch(reason => {
                res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
            });
        }).catch(reason => {
            res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
        });
    } else if (req.body.message) {
        // this is a normal message
        req.API.post('/post', {
            content: req.body.message
        }).then((post_response) => {
            res.redirect(utilities.extendURL(`/post/${post_response.data.postId}`))
        }).catch(reason => {
            res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
        });
    } else {
        // when nothing is set, just redirect back
        res.redirect(utilities.extendURL('/'))
    }
}

function getPost(req, res) {
    const postId = req.params.postid;
    req.API.get(`/post/${postId}`).then((response) => {
        let data = extendRenderData({
            post: response.data,
            username: getLoggedInUser(req)
        }, req);

        res.render('singlepost.njk', data)
    }).catch(reason => {
        res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
    });
}


module.exports = router;

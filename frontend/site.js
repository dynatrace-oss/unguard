const {handleError} = require("./errorhandler");
const cheerio = require('cheerio')
const express = require('express');
const router = express.Router();

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
// Logout
router.post('/logout', doLogout)
// Login
router.post('/login', doLogin)
// Register
router.post('/register', registerUser)

function showGlobalTimeline(req, res) {
    req.API.get('/timeline').then((response) => {
        let data = {
            data: response.data,
            title: 'Timeline',
            username: req.cookies.username
        }

        res.render('index.njk', data)
    }).catch(reason => {
        res.render('error.njk', handleError(reason));
    });
}

function showPersonalTimeline(req, res) {
    req.API.get('/mytimeline').then((response) => {
        let data = {
            data: response.data,
            title: 'My Timeline',
            username: req.cookies.username
        }

        res.render('index.njk', data)
    }).catch(reason => {
        res.render('error.njk', handleError(reason));
    });
}

function showUserProfile(req, res) {
    const usernameProfile = req.params.username;
    req.API.get(`/users/${usernameProfile}/posts`).then((response) => {
        let data = {
            data: response.data,
            profileName: usernameProfile,
            username: req.cookies.username
        }

        res.render('profile.njk', data)
    }).catch(reason => {
        res.render('error.njk', handleError(reason));
    });
}

function doLogout(req, res) {
    res.clearCookie('username');
    res.redirect('/')
}

function doLogin(req, res) {
    const usernameToLogin = req.body.username;
    if (!usernameToLogin) {
        res.render('error.njk', {error: "Username must be supplied to login"});
        return;
    }
    req.API.post('/login', null, {
        params: {
            username: usernameToLogin
        }
    }).then((response) => {
        // in a real application we would probably use the response here to
        // set a real cookie, but the username will do here as the backend expects just that
        res.cookie("username", usernameToLogin)
        res.redirect('/')
    }).catch(reason => {
        res.render('error.njk', handleError(reason));
    });
}

function registerUser(req, res) {
    const usernameToLogin = req.body.username;
    if (!usernameToLogin) {
        res.render('error.njk', {error: "Username must be supplied to register"});
        return;
    }
    req.API.post('/register', null, {
        params: {
            username: usernameToLogin
        }
    }).then((response) => {
        // in a real application we would probably use the response here to
        // set a real cookie, but the username will do here as the backend expects just that
        res.redirect('/')
    }).catch(reason => {
        res.render('error.njk', handleError(reason));
    });
}

function followUser(req, res) {
    const usernameProfile = req.params.username;
    req.API.post(`/users/${usernameProfile}/follow`).then((response) => {
        console.log(usernameProfile)
        res.redirect(`/user/${usernameProfile}`);
    }).catch(reason => {
        res.render('error.njk', handleError(reason));
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
                content: `${metaTitle} ${req.body.urlmessage}`,
                imageUrl: metaImgSrc
            }).then((response) => {
                res.redirect('/')
            }).catch(reason => {
                res.render('error.njk', handleError(reason));
            });
        }).catch(reason => {
            res.render('error.njk', handleError(reason));
        });
    } else if (req.body.message) {
        // this is a normal message
        req.API.post('/post', {
            content: req.body.message
        }).then((response) => {
            res.redirect('/')
        }).catch(reason => {
            res.render('error.njk', handleError(reason));
        });
    } else {
        // when nothing is set, just redirect back
        res.redirect('/')
    }
}

module.exports = router;

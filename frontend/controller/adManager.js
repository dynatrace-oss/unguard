const { createError, handleError, statusCodeForError } = require("./errorHandler");
const { roles, containsRole } = require('../model/role');
const { getLoggedInUser } = require('./user');

const express = require('express');
const router = express.Router();
const FormData = require('form-data');
const multer = require('multer');
const upload = multer(); // default multer uses web storage (access with file.buffer)

const adManagerRouter = express.Router({ mergeParams: true });

// Ad Manager (only works when logged in and user have AD_MANAGER role)
adManagerRouter.get('/', adManagerPage);
// upload zip with images and extract it there (overwrites images if already existing)
adManagerRouter.post('/upload', upload.single("uploadZip"), adManagerUpload);
// deletes a image from the server
adManagerRouter.post('/delete', adManagerDelete);


function adManagerPage(req, res) {
    if (containsRole(req, roles.AD_MANAGER) == false) {
        return res
            .render('error.njk', createError("", { status: 403 }));
    }

    req.AD_SERVICE_API.get('/ads').then((response) => {

        response.data.forEach(ad => {
            ad.creationTime = getFormatDateAsString(new Date(ad.creationTime));
        })

        let adManagerViewModel = {
            data: response.data,
            username: getLoggedInUser(req),
            isAdManager: containsRole(req, roles.AD_MANAGER)
        }

        res.render('adManager.njk', adManagerViewModel)
    }).catch(reason => {
        res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
    });
}

function getFormatDateAsString(date) {
    return ("0" + date.getDay()).slice(-2) + "." + ("0" + date.getMonth()).slice(-2) + "." + date.getFullYear() + " | "
        + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
}

function adManagerUpload(req, res) {
    const file = req.file;
    if (file == null || file.originalname == null || !file.originalname.endsWith(".zip")) {
        return res.status(statusCodeForError(400))
            .render('error.njk', handleError({
                response: {
                    data: {
                        message: "The upload has to include exactly one zip file!"
                    }
                }
            }));
    }

    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);
    const headers = {
        headers: { ...formData.getHeaders() }
    };

    req.AD_SERVICE_API.post("/upload-ad", formData, headers)
        .then(response => {
            res.redirect('/ad-manager');
        }).catch(reason => {
            res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
        });
}

function adManagerDelete(req, res) {
    const formData = new FormData();
    formData.append("fileName", req.body.filename);
    const headerConfig = {
        headers: { ...formData.getHeaders() }
    }

    req.AD_SERVICE_API.post("/delete-ad", formData, headerConfig)
        .then((response) => {
            res.redirect('/ad-manager');
        }).catch(reason => {
            res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
        });
}

module.exports = adManagerRouter;

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

const { createError, handleError, statusCodeForError } = require('./errorHandler');
const { getJwtUser, hasJwtRole } = require('./cookie');
const { roles } = require('../model/role');
const { extendURL, extendRenderData } = require("./utilities.js");

const express = require('express');
const FormData = require('form-data');
const multer = require('multer');
const upload = multer(); // default multer uses web storage (access with file.buffer)

const adManagerRouter = express.Router({ mergeParams: true });

// Ad Manager (only works when logged in and user has AD_MANAGER role)
adManagerRouter.get('/', adManagerPage);
// upload zip with images and extract it there (overwrites images if already existing)
adManagerRouter.post('/upload', upload.single("uploadZip"), adManagerUpload);
// deletes an ad image from the server
adManagerRouter.post('/delete', adManagerDelete);


function adManagerPage(req, res) {
    if (!hasJwtRole(req.cookies, roles.AD_MANAGER)) {
        console.error("Cookie doesn't contain AD_MANAGER role (Status: 401)");
        return res
            .render('error.njk', createError("", { status: 401 }));
    }

    req.AD_SERVICE_API.get('/ads').then((response) => {

        response.data.forEach(ad => {
            ad.creationTime = (new Date(ad.creationTime)).toLocaleString('de-at');
        })

        let data = extendRenderData({
            data: response.data,
            username: getJwtUser(req.cookies),
            isAdManager: hasJwtRole(req.cookies, roles.AD_MANAGER),
            AD_SERVICE_BASE_PATH: process.env.AD_SERVICE_BASE_PATH
        }, req);

        res.render('adManager.njk', data)
    }).catch(reason => {
        res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
    });
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

    req.AD_SERVICE_API.post('/ads/upload', formData, headers)
        .then(response => {
            res.redirect(extendURL('/ad-manager'));
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

    req.AD_SERVICE_API.post('/ads/delete', formData, headerConfig)
        .then(response => {
            res.redirect(extendURL('/ad-manager'));
        }).catch(reason => {
            res.status(statusCodeForError(reason)).render('error.njk', handleError(reason));
        });
}

module.exports = adManagerRouter;

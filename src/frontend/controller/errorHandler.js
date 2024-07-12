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

exports.createError = function (errorMessage, data) {
    return { error: errorMessage, message: data };
}

exports.handleError = function (error) {
	const { code: errorTitle = 'Something Went Wrong', request, response, config } = error;
	const { method, url, baseURL } = config;
	const { data } = response || {}; // || {} handles undefined case
	const { message } = data || {}

	let outMessage = message || "No detailed message available.";

	if (response) {
		return { title: outMessage, error: outMessage, message: data }
	} else if (request) {
		const requestMetadata = {
			message: error.message,
			method: method,
			host: baseURL,
			path: url
		}

		return { title: errorTitle, error: errorTitle, message: requestMetadata };
	} else {
		return { title: errorTitle, error: errorTitle, message: { message: error.message } } // Lowest level error
	}
}

exports.statusCodeForError = function (err) {
    if (err.response) {
        if (err.response.status) {
            return err.response.status
        }
        return 500;
    } else {
        return 500;
    }
}

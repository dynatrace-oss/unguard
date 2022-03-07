
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
		return { error: outMessage, message: data }
	} else if (request) {
		const requestMetadata = {
			message: error.message,
			method: method,
			host: baseURL,
			path: url
		}

		return { error: errorTitle, message: requestMetadata };
	} else {
		return { error: errorTitle, message: { message: error.message } } // Lowest level error
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


exports.createError = function (errorMessage, data) {
    return { error: errorMessage, message: data };
}

exports.handleError = function (err) {
    let message = "No detailed message available."
    if (!err.response) {
        console.error(err)
        return { error: err.code, message: err };
    }
    if (err.response.data) {
        if (err.response.data.message && err.response.data.path) {
            message = err.response.data.message
            console.error(`${err.response.data.path} failed (Status: ${err.response.data.status}) with message: ${message}`)
        } else if (err.response.data.path) {
            console.error(`${err.response.data.path} failed with status: ${err.response.data.status}`)
        } else if (err.response.data.message) {
            console.error(`Failed with message: ${err.response.data.message}`)
            message = err.response.data.message;
        }
    } else {
        console.error(err)
    }

    return { error: message, message: err.response.data };
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

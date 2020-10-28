exports.handleError = function (err) {
    console.error(err)
    let message = "No detailed message available."
    if (err.response.data && err.response.data.message) {
        message = err.response.data.message
        console.error(message)
    }

    return {error: message, message: err.response.data};
}

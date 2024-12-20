const handleError = (err, req, res, next) => {
    res.status(err.status || 500).render('error', {
        title: 'Server Error',
        errorCode: err.status || 500,
        errorMessage: err.message || 'Something went wrong. Please try again later.'
    });
}

module.exports = handleError;
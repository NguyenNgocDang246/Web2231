const handleError404 = (req, res) => {
    console.log('404');
    res.status(404).render('error', {
        title: 'Page Not Found',
        errorCode: 404,
        errorMessage: 'The page you are looking for does not exist.'
    });
}

module.exports = handleError404;
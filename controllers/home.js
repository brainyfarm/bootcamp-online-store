/**
 * home
 * Handler for the home route
 * @param {any} req
 * @param {any} res
 */
function home(req, res) {
  res.render('index', { title: 'Welcome to Ugele Store!' });
}

module.exports = {
    home
}

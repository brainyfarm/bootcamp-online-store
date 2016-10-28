function home(req, res) {
  res.render('index', { title: 'Welcome to Ugele Store!' });
}

module.exports = {
    home
}

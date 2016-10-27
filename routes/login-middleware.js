const firebase = require('firebase');

module.exports = function loginMiddleware(req, res, next) {
  const user = firebase.auth().currentUser;

  if (user) {
    const { uid, email } = user;

    req.user = { id: uid, email };
    next();
  } else {
    res.redirect('/login');
  }
}
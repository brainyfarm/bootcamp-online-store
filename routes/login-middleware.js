const firebase = require('../helpers/firebase.js');

module.exports = function loginMiddleware(req, res, next) {
  const user = firebase.auth().currentUser;

  if (user) {
    const { uid, email } = user;

    let name, phone, store;
    
    // A hackish session.
    // Todo: Find a better way. A proper session storage maybe?
    // This is set in auth.js UpdateUserInfo
    // Yes, I know globals are bad. :(
    if (global.userInfo) {
      name = global.userInfo.firstname;
      store = global.userInfo.store;
      phone = global.userInfo.phone;
    }

    req.user = { id: uid, email, name, phone, store };
    next();
  } else {
    res.redirect('/login');
  }
}
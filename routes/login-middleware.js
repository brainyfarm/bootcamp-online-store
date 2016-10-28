const firebase = require('../helpers/firebase.js');

module.exports = function loginMiddleware(req, res, next) {
  const user = firebase.auth().currentUser;

  if (user) {
    const { uid, email } = user;

    let name, phone, store;
    
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
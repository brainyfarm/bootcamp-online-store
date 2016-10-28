const db = require('../helpers/firebase').database();
const uniqueUrl = require('../helpers/unique-url');
let Jusibe = require('jusibe');
Jusibe = new Jusibe(process.env.jusibeKey, process.env.jusibeToken);

function get(req, res, next) {

  if (req.user.store) {
    //Redirect instead to the user's store
    res.redirect('/manage');
    return;
  }

  res.render('dashboard', {
    title: 'Dashboard',
    currentUserName: req.user.name
  });

}

function post(req, res, next) {
  const userID = req.user.id;
  const storename = req.body.storename;
  const storeLink = uniqueUrl;

  const ref = db.ref('/');
  const userStoreRef = ref.child(`stores/${storeLink}`);
  const userRef = ref.child(`users/${userID}/stores`);

  userStoreRef.set({
    storeowner: userID,
    storename: storename,
    storelink: storeLink
  })

  userRef.update({
    [storeLink]: storename
  })

  // Temporary fix
  global.userInfo.store = { link: storeLink, name: storename };

  // Send an sms containing store link
  const payload = {
    to: req.user.phone,
    from: 'UGELE',
    message: `Your store public link on Ugele is ${req.hostname}/store/${storeLink}`
  };

  Jusibe.sendSMS(payload, function sendSMSCallback(err, res) {
    if (res.statusCode === 200) {
      console.log(res.body);
      return;
    } else {
      console.log(err);
      return;
    }
  });

  res.redirect('/manage');
}

module.exports = {
  get,
  post
};

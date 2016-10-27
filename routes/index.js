var express = require('express');
var router = express.Router();
var firebase = require('firebase');
require('dotenv').config()
var firebase = require('firebase');
var Jusibe = require('jusibe');
var Jusibe = new Jusibe(process.env.jusibeKey, process.env.jusibeToken);

const requireLoginMiddleware = require('./login-middleware');

/* A unique url generator */
var uniqueUrl = (function (min, max) {
  var randomChar = function () {
    return String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));
  };

  return [
    randomChar(),
    randomChar().toLowerCase(),
    randomChar(),
    randomChar().toLowerCase()].join("");
})(65, 77);


/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Welcome to Ugele Store!' });
});

router.get('/store/:id', function (req, res) {
  var storeID = req.params.id;
  console.log(storeID);
  res.render('store', { title: "Store", currentStoreID: storeID })
})

router.get('/dashboard', requireLoginMiddleware, function (req, res, next) {
  var db = firebase.database();
  var ref = db.ref('/');
  var usersRef = ref.child(`users/${req.user.id}/`);

  usersRef.on('value', function (snapshot) {
    const { firstname: currentUserName, stores } = snapshot.val();
    var currentStore;

    if (stores) {
      const link = Object.keys(stores)[0];
      const name = stores[link];

      currentStore = { link, name }; 
    }

    res.render('dashboard', {
      title: 'Dashboard',
      currentUserName,
      currentStore
    });

  });
});

router.post('/dashboard', requireLoginMiddleware, function (req, res, next) {
  var userID = req.user.id;
  var storename = req.body.storename;
  var storeLink = uniqueUrl;

  var db = firebase.database();
  var ref = db.ref('/');
  var userStoreRef = ref.child(`stores/${storeLink}`);
  var userRef = ref.child(`users/${userID}/stores`);

  userStoreRef.set({
    storeowner: userID,
    storename: storename,
    storelink: storeLink
  })

  userRef.update({
    [storeLink]: storename
  })

  // Send an sms containing store link
  var payload = {
    to: global.currentUserPhone,
    from: 'UGELE',
    message: `The link to your Ugele store is /store/${storeLink}`
  };

  // Jusibe.sendSMS(payload, function (err, res) {
  //   if (res.statusCode === 200)
  //     console.log(res.body);
  //   else
  //     console.log(err);
  // });

  res.redirect(`/manage/${storeLink}`);
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Create an account' })
});

router.post('/signup', function (req, res) {
  // Getting email and password variables
  var phoneNumber = req.body.phone;
  var email = req.body.email;
  var password = req.body.password;
  var firstName = req.body.firstname;

  firebase.auth()
    .createUserWithEmailAndPassword(email, password)

    .then(function (userObject) {
      var userID = userObject.uid;

      var db = firebase.database();
      var ref = db.ref('/');
      var usersRef = ref.child("users/" + userID);

      // Write the user joined date to the user table in db
      usersRef.set({
        joined: new Date().toISOString(),
        firstname: firstName,
        phone: phoneNumber
      })

      res.redirect('/dashboard');
    })

    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      return res.send(errorMessage);
    })
});

// Login GET route
router.get('/login', function (req, res) {
  // Check later if a user is already logged in.
  res.render('login', { title: "Login" })
})

// Login POST route 


router.post('/login', function (req, res) {
  // Getting email and password variables
  var email = req.body.email;
  var password = req.body.password;

  firebase.auth()
    .signInWithEmailAndPassword(email, password)

    .then(function (userObject) {
      res.redirect('/dashboard');
    })

    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      return res.send(errorMessage);
    })
});

router.get('/logout', function (req, res, next) {
  delete global.currentUser;
  res.redirect('/dashboard')
})


router.get('/manage/:id', requireLoginMiddleware, function (req, res) {
  res.render('manage');
})
module.exports = router;

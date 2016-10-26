var express = require('express');
var router = express.Router();
var firebase = require('firebase');
require('dotenv').config()
var firebase = require('firebase');
var Jusibe = require('jusibe');
var Jusibe = new Jusibe(process.env.jusibeKey, process.env.jusibeToken);


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
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Welcome to Store!' });
});

router.get('/store/:id', function (req, res) {
  var storeID = req.params.id;
  console.log(storeID);
  res.render('store', { title: "Store", currentStoreID: storeID })
})

router.get('/dashboard', function (req, res, next) {
  /* If no user is signed in */
  if (!global.currentUser)
    res.redirect('/login');

  var db = firebase.database();
  var ref = db.ref('/');
  var usersRef = ref.child("users/" + global.currentUserID + '/');
  var userStoreRef = ref.child("stores/" + global.currentUserID + '/');

  var storeOwnersRef = ref.child("owners/")

  usersRef.on('value', function (snapshot) {
    var userName = snapshot.val().firstname;
    // console.log(userName);

    userStoreRef.on('value', function (snapshot) {
      var userStoreObject = snapshot.val();
      var userLink;
      if (!userName) {
        userLink = null;
      }
      else {

        storeOwnersRef.on('value', function (snapshot) {
          userLink = snapshot.val().currentUserID || null;
        })

      }
      //console.log(userStoreObject);


      res.render('dashboard', {
        title: 'Dashboard', currentUser: global.currentUser,
        currentUserName: userName, currentUserLink: userLink,
        freeUrl: uniqueUrl
      });

    })


  })

})


router.post('/dashboard', function (req, res, next) {
  var userID = global.currentUserID;
  var storename = req.body.storename;
  var storelink = uniqueUrl;


  var db = firebase.database();
  var ref = db.ref('/');
  var userStoreRef = ref.child("stores/" + storelink);
  var ownersRef = ref.child("owners");



  userStoreRef.set({
    storeowner: global.currentUserID,
    storename: storename,
    storelink: storelink,
    products: []
  })

  ownersRef.update({
    [currentUserID]: storelink
  })

  // Send an sms containing store link
  var payload = {
    to: global.currentUserPhone,
    from: 'UGELE',
    message: 'The link to your store is /store/' + storelink
  };

  Jusibe.sendSMS(payload, function (err, res) {
    if (res.statusCode === 200)
      console.log(res.body);
    else
      console.log(err);
  });

  res.redirect('/manage/' + storelink);




})

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
      global.currentUser = userObject.email;
      global.currentUserID = userObject.uid;
      global.currentUserPhone = phoneNumber;
      global.currentUserName = firstName;

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
      global.currentUser = userObject.email;
      global.currentUserID = userObject.uid;

      var userID = userObject.uid;
      var db = firebase.database();
      var ref = db.ref('/');
      var usersRef = ref.child("users/" + userID);

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


router.get('/manage/:id', function(req, res){
  res.render('manage', {currentUserName : global.currentUserName});
})
module.exports = router;

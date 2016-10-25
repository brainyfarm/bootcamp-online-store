var express = require('express');
var router = express.Router();
var firebase = require('firebase');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', function(req, res, next){
  res.render('dashboard', {title: 'Dashboard', currentUser : global.currentUser});
})

router.get('/signup', function(req, res, next) {
  res.render('signup', {title: 'Create an account'})
});

router.post('/signup', function(req, res, next) {
  // Getting email and password variables
  var email = req.body.email;
  var password = req.body.password;
  var lastName = req.body.lastname;

  firebase.auth()
  .createUserWithEmailAndPassword(email, password)
    
    .then(function(userObject){
        global.currentUser = userObject.email;
        global.currentUserID = userObject.uid;

        var userID = userObject.uid;

        console.log(userID);

        var db = firebase.database();
        var ref = db.ref('/');
        var usersRef = ref.child("users/" + userID );

        // Write the user joined date to the user table in db
        usersRef.set({
              joined: new Date().toISOString(), 
              lastname: lastName
        })


        res.redirect('/dashboard');
    })

    .catch(function(error) {
    // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error)
    })
});


/*
router.get('/login', function(req, res, next) {
  res.render('signup', {title: 'Login'})
});

router.post('/login', function(req, res, next) {
  // Getting email and password variables
  var email = req.body.email;
  var password = req.body.password;
  firebase.auth()
  .createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    res.send(errorMessage);
    // ...
  }).then(function(userDetail){
      global.currentUser = email;
      res.send(email);
  })
});
*/
module.exports = router;

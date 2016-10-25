var express = require('express');
var router = express.Router();
var firebase = require('firebase');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to Store!' });
});

router.get('/dashboard', function(req, res, next){
  /* If no user is signed in */
  if(!global.currentUser)
    res.redirect('/login');

  var db = firebase.database();
  var ref = db.ref('/');
  var usersRef = ref.child("users/" + global.currentUserID  +'/' );
  var userStoreRef = ref.child("stores/" + global.currentUserID  +'/' );

  usersRef.on('value', function(snapshot){
    console.log(snapshot.val());
    var userName = snapshot.val().firstname;
      // console.log(userName);

      userStoreRef.on('value', function(snapshot){
          var userStoreObject = snapshot.val();
          var userLink;
          if(!userStoreObject){
            userLink = null;
          }
          else{
            userLink = userStoreObject.link;
          }
          console.log(userStoreObject);
          res.render('dashboard', {title: 'Dashboard', currentUser : global.currentUser, currentUserName : userName, currentUserLink: userStoreObject });

      })
     

  })
    
})

router.get('/signup', function(req, res, next) {
  res.render('signup', {title: 'Create an account'})
});

router.post('/signup', function(req, res) {
  // Getting email and password variables
  var email = req.body.email;
  var password = req.body.password;
  var firstName = req.body.firstname;

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
              firstname: firstName
        })



        res.redirect('/dashboard');
    })

    .catch(function(error) {
    // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      return res.send(errorMessage);
    })
});

// Login GET route
router.get('/login', function(req, res){
  // Check later if a user is already logged in.
    res.render('login', {title:"Login"})
})

// Login POST route 


router.post('/login', function(req, res) {
  // Getting email and password variables
  var email = req.body.email;
  var password = req.body.password;

  firebase.auth()
  .signInWithEmailAndPassword(email, password)
    
    .then(function(userObject){
        global.currentUser = userObject.email;
        global.currentUserID = userObject.uid;

        var userID = userObject.uid;

        console.log(userID);

        var db = firebase.database();
        var ref = db.ref('/');
        var usersRef = ref.child("users/" + userID );

        res.redirect('/dashboard');
    })

    .catch(function(error) {
    // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      return res.send(errorMessage);
    })
});

router.get('/logout', function(req, res, next){
  delete global.currentUser;
  res.redirect('/dashboard')
})
module.exports = router;

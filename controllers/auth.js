const firebase = require('../helpers/firebase');
const db = firebase.database();

function updateUserInfo(reference) {
    return db.ref(`/users/${reference}`).once('value')
        .then((snapshot) => {
            const firstname = snapshot.val().firstname;
            let store = snapshot.val().stores;
            const phone = snapshot.val().phone;

            if (store) {
                const link = Object.keys(store)[0];
                const name = store[link];
                store = { link, name };
            }

            global.userInfo = { firstname, store, phone };
            return true;
    });
}

function getSignup(req, res, next) {
    res.render('signup', { title: 'Create an account' })
}

function postSignup(req, res) {
    // Getting email and password variables
    const phoneNumber = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstname;

    firebase.auth()
        .createUserWithEmailAndPassword(email, password)

        .then((userObject) => {
            const userID = userObject.uid;

            const ref = db.ref('/');
            const usersRef = ref.child("users/" + userID);

            // Write the user joined date to the user table in db
            usersRef.set({
                joined: new Date().toISOString(),
                firstname: firstName,
                phone: phoneNumber
            })

            updateUserInfo(userID).then(() => {
                res.redirect('/dashboard');
            })
        })

        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            return res.send(errorMessage);
        })
}

function getLogin(req, res) {
    // Todo: Check if a user is already logged in.
    res.render('login', { title: "Login" })
}

function postLogin(req, res) {
    // Getting email and password variables
    const email = req.body.email;
    const password = req.body.password;

    firebase.auth()
        .signInWithEmailAndPassword(email, password)

        .then((userObject) => {
            updateUserInfo(userObject.uid).then(() => {
                res.redirect('/dashboard');
            })
        })

        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            return res.send(errorMessage);
        })
}

function logout(req, res, next) {
    firebase.auth()
        .signOut()
        .then(() => {
            res.redirect('/login');
        }, (error) => {
            console.error('Sign Out Error', error);
        });
}

module.exports = {
    getSignup,
    postSignup,
    getLogin,
    postLogin,
    logout
}

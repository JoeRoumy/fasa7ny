var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var Account = require('../models/account.js');
var User=require('../models/user.js');

module.exports = function(passport) {

  // used to serialize the user for the session
    passport.serializeUser(function(account, done) {
        done(null, account.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Account.findById(id, function(err, account) {
            done(err, account);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we can override with email
        usernameField : 'userName',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, userName, password, done) {

        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
        // we are checking to see if the user trying to login already exists
        Account.findOne({ 'userName' :  userName }, function(err, account) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (account) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken'));
            } else {
                // create the user
                var newAccount  = new Account();


                newAccount.userName    = userName;
                newAccount.email    = req.body.email;
                newAccount.type    = req.body.type;
                newAccount.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newAccount);
                    //redirect to different views according to type
                });
            }

        });

        });

    }));

    passport.use('local-login', new LocalStrategy({
         usernameField : 'userName',
         passwordField : 'password',
         passReqToCallback : true // allows us to pass back the entire request to the callback
     },
     function(req, userName, password, done) { // callback with email and password from our form

         // find a user whose email is the same as the forms email
         // we are checking to see if the user trying to login already exists
         Account.findOne({ 'userName' :  userName }, function(err, account) {
             // if there are any errors, return the error before anything else
             if (err)
                 return done(err);

             // if no user is found, return the message
             if (!account)
                 return done(null, false, req.flash('loginMessage', 'No User found')); // req.flash is the way to set flashdata using connect-flash

             // if the user is found but the password is wrong
             if (!account.validPassword(password))
                 return done(null, false, req.flash('loginMessage', 'invalid password')); // create the loginMessage and save it to session as flashdata

             // all is well, return successful user
             if(account.type==0){
               User.update({userAccountId:_id},{$set:{numberOfLogins:numberOfLogins+1}}).exec(function(err){
                 if(err){
                   res.send(err);
                 }
                 else{
                   res.send("succcessful LogIn");
                 }
               })
             }
             return done(null, account);
         });

     }));

 };
